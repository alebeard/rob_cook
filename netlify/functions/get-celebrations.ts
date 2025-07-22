import { Handler } from '@netlify/functions';
import { db } from '../../db/index';
import { celebrations } from '../../db/schema';
import { desc } from 'drizzle-orm';

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const result = await db
      .select()
      .from(celebrations)
      .orderBy(desc(celebrations.createdAt))
      .limit(50); // Limit to last 50 celebrations

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        celebrations: result 
      }),
    };
  } catch (error) {
    console.error('Database error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch celebrations',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};