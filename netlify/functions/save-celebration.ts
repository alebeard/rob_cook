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
    const body = JSON.parse(event.body || '{}');
    const {
      clientName,
      supportiveMessage,
      recipe,
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

    const result = await db.insert(celebrations).values({
      clientName,
      supportiveMessage,
      recipe: recipe || null,
      bibleVerse: bibleVerse || null,
      bibleReference: bibleReference || null,
      photoUrl: photoUrl || null,
      createdBy: createdBy || null,
    }).returning();

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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save celebration',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};