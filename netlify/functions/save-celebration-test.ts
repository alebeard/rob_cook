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

    // Test 1: Basic response
    console.log('Test function reached successfully');
    
    // Test 2: Check environment
    const hasDbUrl = !!process.env.NETLIFY_DATABASE_URL;
    console.log('Environment check:', { hasDbUrl });

    // Test 3: Try dynamic imports one by one
    try {
      console.log('Testing db/index import...');
      const dbModule = await import('../../db/index');
      console.log('db/index import successful');
      
      console.log('Testing db/schema import...');
      const schemaModule = await import('../../db/schema');
      console.log('db/schema import successful');
      
      // Test 4: Try to create db connection
      const { db } = dbModule;
      console.log('Database object created');
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Test function completed successfully',
          environment: { hasDbUrl },
          imports: 'All imports successful'
        }),
      };
      
    } catch (importError) {
      console.error('Import error:', importError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Import failed',
          details: importError instanceof Error ? importError.message : 'Unknown import error',
          stack: importError instanceof Error ? importError.stack : 'No stack'
        }),
      };
    }

  } catch (criticalError) {
    console.error('Critical error:', criticalError);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Critical function error',
        details: criticalError instanceof Error ? criticalError.message : 'Unknown error'
      }),
    };
  }
};