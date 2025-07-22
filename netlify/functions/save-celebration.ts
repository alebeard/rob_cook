import { Handler } from '@netlify/functions';
import { db } from '../../db/index';
import { celebrations } from '../../db/schema';

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Check if database connection is available
    if (!process.env.NETLIFY_DATABASE_URL) {
      console.error('NETLIFY_DATABASE_URL environment variable not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database not configured',
          details: 'NETLIFY_DATABASE_URL environment variable not found'
        }),
      };
    }

    const body = JSON.parse(event.body || '{}');
    const {
      clientName,
      supportiveMessage,
      activityDetails,
      documents,
      bibleVerse,
      bibleReference,
      photoUrl,
      createdBy
    } = body;

    if (!supportiveMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Supportive message is required' }),
      };
    }

    console.log('Attempting to save celebration to database...');
    
    // First, try to ensure the table exists by creating it if it doesn't
    try {
      // Check if table exists and what columns it has
      let tableExists = false;
      let hasActivityDetails = false;
      let hasDocuments = false;
      
      try {
        const tableInfo = await db.execute(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'celebrations';
        `);
        
        tableExists = tableInfo.length > 0;
        hasActivityDetails = tableInfo.some((row: any) => row.column_name === 'activityDetails');
        hasDocuments = tableInfo.some((row: any) => row.column_name === 'documents');
        
        console.log('Table status:', { tableExists, hasActivityDetails, hasDocuments });
        
        // Add missing columns if table exists but columns are missing
        if (tableExists) {
          if (!hasActivityDetails) {
            await db.execute('ALTER TABLE "celebrations" ADD COLUMN "activityDetails" text');
            console.log('Added activityDetails column');
          }
          if (!hasDocuments) {
            await db.execute('ALTER TABLE "celebrations" ADD COLUMN "documents" text');
            console.log('Added documents column');
          }
        }
      } catch (columnCheckError) {
        console.log('Column check failed, will create table:', columnCheckError);
        tableExists = false;
      }

      if (!tableExists) {
        // Create table with new schema
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "celebrations" (
            "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            "clientName" varchar(255),
            "supportiveMessage" text NOT NULL,
            "activityDetails" text,
            "documents" text,
            "bibleVerse" text,
            "bibleReference" varchar(100),
            "photoUrl" text,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "createdBy" varchar(255)
          );
        `);
        console.log('Table created with new schema');
      }
    } catch (tableError) {
      console.log('Table setup failed:', tableError);
      // Try to create basic table as fallback
      try {
        await db.execute(`
          CREATE TABLE IF NOT EXISTS "celebrations" (
            "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            "clientName" varchar(255),
            "supportiveMessage" text NOT NULL,
            "activityDetails" text,
            "documents" text,
            "bibleVerse" text,
            "bibleReference" varchar(100),
            "photoUrl" text,
            "createdAt" timestamp DEFAULT now() NOT NULL,
            "createdBy" varchar(255)
          );
        `);
      } catch (fallbackError) {
        console.error('Fallback table creation failed:', fallbackError);
      }
    }

    const result = await db.insert(celebrations).values({
      clientName,
      supportiveMessage,
      activityDetails: activityDetails || null,
      documents: documents || null,
      bibleVerse: bibleVerse || null,
      bibleReference: bibleReference || null,
      photoUrl: photoUrl || null,
      createdBy: createdBy || null,
    }).returning();

    console.log('Successfully saved celebration:', result[0]);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        celebration: result[0] 
      }),
    };
  } catch (error) {
    console.error('Database error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      env: {
        hasDbUrl: !!process.env.NETLIFY_DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save celebration',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};