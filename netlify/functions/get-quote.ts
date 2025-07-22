import { Handler } from '@netlify/functions';

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

  // Fallback quotes from philosophers, poets, writers, and thinkers
  const fallbackQuotes = [
    { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.", author: "Albert Einstein" },
    { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
    { text: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.", author: "J.K. Rowling" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "It is better to be hated for what you are than to be loved for what you are not.", author: "André Gide" },
    { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" }
  ];

  try {
    // Try to fetch from a quotes API that supports server-side requests
    try {
      const response = await fetch('https://api.quotable.io/random?tags=motivational,inspirational,wisdom&minLength=30&maxLength=120');
      
      if (response.ok) {
        const data = await response.json();
        if (data.content && data.author) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              quote: {
                text: data.content,
                author: data.author
              },
              source: 'api'
            }),
          };
        }
      }
    } catch (apiError) {
      console.log('API fetch failed:', apiError);
    }

    // Use fallback quote if API fails
    const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        quote: randomFallback,
        source: 'fallback'
      }),
    };
  } catch (error) {
    console.error('Quote function error:', error);
    
    // Return a safe fallback
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        quote: fallbackQuotes[0],
        source: 'error_fallback'
      }),
    };
  }
};