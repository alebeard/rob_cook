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

    console.log('Starting database rebuild...');

    // Import database connection
    const { createDb } = await import('../../db/index');
    const db = createDb();

    console.log('Database connection created');

    // Drop existing table if it exists
    console.log('Dropping existing celebrations table...');
    await db.execute('DROP TABLE IF EXISTS "celebrations" CASCADE;');
    
    // Create fresh table with correct schema
    console.log('Creating fresh celebrations table...');
    await db.execute(`
      CREATE TABLE "celebrations" (
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

    console.log('Table created successfully');

    // Test insert to verify schema
    console.log('Testing schema with sample insert...');
    const testResult = await db.execute(`
      INSERT INTO "celebrations" ("supportiveMessage") 
      VALUES ('Test celebration - schema verification') 
      RETURNING id, "supportiveMessage", "createdAt";
    `);

    console.log('Test insert successful:', testResult);

    // Clean up test record
    await db.execute('DELETE FROM "celebrations" WHERE "supportiveMessage" = $1', ['Test celebration - schema verification']);
    
    console.log('Database rebuild completed successfully');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database rebuilt successfully',
        testResult: testResult[0]
      }),
    };

  } catch (error) {
    console.error('Database rebuild error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database rebuild failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack?.substring(0, 1000) : 'No stack'
      }),
    };
  }
};