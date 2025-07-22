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

    console.log('Testing insert with existing schema...');

    // Import database connection using the working method from db-test
    const { neon } = await import('@netlify/neon');
    const { drizzle } = await import('drizzle-orm/neon-http');
    
    // Create database connection directly (same as db-test which works)
    const client = neon(process.env.NETLIFY_DATABASE_URL!);
    const db = drizzle({ client });

    console.log('Database connection created');

    // First, check what columns exist in the current table
    console.log('Checking existing table structure...');
    const tableInfo = await db.execute(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'celebrations'
      ORDER BY ordinal_position;
    `);

    console.log('Current table columns:', tableInfo);

    // Try a simple insert with just required fields
    console.log('Attempting simple insert...');
    
    try {
      const result = await db.execute(`
        INSERT INTO "celebrations" ("supportiveMessage") 
        VALUES ($1) 
        RETURNING id, "supportiveMessage";
      `, ['Test insert from test-insert function']);
      
      console.log('Simple insert successful:', result);
      
      // Clean up test record
      await db.execute(`DELETE FROM "celebrations" WHERE "supportiveMessage" = $1`, ['Test insert from test-insert function']);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Insert test successful',
          tableStructure: tableInfo,
          insertResult: result[0]
        }),
      };
      
    } catch (insertError) {
      console.error('Insert failed:', insertError);
      
      return {
        statusCode: 200, // Return 200 so we can see the error details
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Insert failed but table exists',
          tableStructure: tableInfo,
          insertError: insertError instanceof Error ? insertError.message : 'Unknown insert error'
        }),
      };
    }

  } catch (error) {
    console.error('Test insert error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Test insert failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack?.substring(0, 1000) : 'No stack'
      }),
    };
  }
};