import { Handler } from '@netlify/functions';
import { db } from '../../db/index';

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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database not configured',
          details: 'NETLIFY_DATABASE_URL environment variable not found'
        }),
      };
    }

    console.log('Starting database migration...');

    // First, check if the table exists and what columns it has
    try {
      const tableInfo = await db.execute(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'celebrations';
      `);
      
      console.log('Current table columns:', tableInfo);

      // Check if we need to migrate from recipe to activityDetails
      const hasRecipe = tableInfo.some((row: any) => row.column_name === 'recipe');
      const hasActivityDetails = tableInfo.some((row: any) => row.column_name === 'activityDetails');
      const hasDocuments = tableInfo.some((row: any) => row.column_name === 'documents');

      console.log('Migration status:', { hasRecipe, hasActivityDetails, hasDocuments });

      let migrations = [];

      if (hasRecipe && !hasActivityDetails) {
        // Rename recipe to activityDetails
        migrations.push('ALTER TABLE "celebrations" RENAME COLUMN "recipe" TO "activityDetails"');
        console.log('Planning to rename recipe -> activityDetails');
      }

      if (!hasActivityDetails && !hasRecipe) {
        // Add activityDetails column if neither exists
        migrations.push('ALTER TABLE "celebrations" ADD COLUMN "activityDetails" text');
        console.log('Planning to add activityDetails column');
      }

      if (!hasDocuments) {
        // Add documents column
        migrations.push('ALTER TABLE "celebrations" ADD COLUMN "documents" text');
        console.log('Planning to add documents column');
      }

      // Execute migrations
      for (const migration of migrations) {
        console.log('Executing migration:', migration);
        await db.execute(migration);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Database migration completed',
          migrationsExecuted: migrations
        }),
      };

    } catch (tableError) {
      console.log('Table does not exist, creating new table...');
      
      // Create the table with the new schema
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: 'Database table created with new schema'
        }),
      };
    }

  } catch (error) {
    console.error('Migration error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
    };
  }
};