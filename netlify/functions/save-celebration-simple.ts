import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
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

    console.log('Simple Save - Starting...');

    // Check environment
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

    // Get request data
    const body = JSON.parse(event.body || '{}');
    const { supportiveMessage } = body;

    if (!supportiveMessage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Supportive message is required' }),
      };
    }

    console.log('Request data valid, creating database connection...');

    // Import and create database
    const { createDb } = await import('../../db/index');
    const { celebrations } = await import('../../db/schema');
    const db = createDb();

    console.log('Database connection created, testing basic query...');

    // Test basic connection
    await db.execute('SELECT 1');
    console.log('Basic query successful');

    // Simple table creation without complex logic
    console.log('Ensuring table exists...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "celebrations" (
        "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        "supportiveMessage" text NOT NULL,
        "createdAt" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('Table creation/check complete');

    // Simple insert
    console.log('Attempting simple insert...');
    const result = await db.execute(`
      INSERT INTO "celebrations" ("supportiveMessage") 
      VALUES ($1) 
      RETURNING id, "supportiveMessage", "createdAt"
    `, [supportiveMessage]);
    
    console.log('Insert successful:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        celebration: result[0]
      }),
    };

  } catch (error) {
    console.error('Simple Save Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to save celebration',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack?.substring(0, 500) : 'No stack'
      }),
    };
  }
};