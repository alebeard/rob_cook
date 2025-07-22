import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers };
    }

    console.log('DB Test - Starting...');
    
    // Check environment
    const hasDbUrl = !!process.env.NETLIFY_DATABASE_URL;
    console.log('Environment check:', { hasDbUrl });
    
    if (!hasDbUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'NETLIFY_DATABASE_URL not set',
          hasDbUrl
        }),
      };
    }

    // Test imports
    console.log('Testing imports...');
    const { createDb } = await import('../../db/index');
    console.log('Import successful');

    // Test database connection
    console.log('Creating database connection...');
    const db = createDb();
    console.log('Database object created');

    // Test simple query
    console.log('Testing simple query...');
    const result = await db.execute('SELECT 1 as test');
    console.log('Query result:', result);

    // Test table existence
    console.log('Checking if celebrations table exists...');
    try {
      const tableCheck = await db.execute(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'celebrations'
        LIMIT 5;
      `);
      console.log('Table check result:', tableCheck);
    } catch (tableError) {
      console.log('Table check error (may not exist yet):', tableError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database test completed',
        environment: { hasDbUrl },
        queryResult: result
      }),
    };

  } catch (error) {
    console.error('DB Test Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack'
      }),
    };
  }
};