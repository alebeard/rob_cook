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

  // Comprehensive collection of inspirational quotes for reliable offline access
  const fallbackQuotes = [
    // Mahatma Gandhi
    { text: "The best way to find yourself is to lose yourself in the service of others.", author: "Mahatma Gandhi" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
    { text: "Be the change that you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "The weak can never forgive. Forgiveness is the attribute of the strong.", author: "Mahatma Gandhi" },
    
    // Albert Einstein
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
    { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
    { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
    
    // Maya Angelou
    { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
    { text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.", author: "Maya Angelou" },
    { text: "Nothing will work unless you do.", author: "Maya Angelou" },
    { text: "Try to be a rainbow in someone's cloud.", author: "Maya Angelou" },
    
    // Eleanor Roosevelt
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "No one can make you feel inferior without your consent.", author: "Eleanor Roosevelt" },
    { text: "You must do the things you think you cannot do.", author: "Eleanor Roosevelt" },
    { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
    
    // Nelson Mandela
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "Courage is not the absence of fear, but the mastery of it.", author: "Nelson Mandela" },
    
    // Ralph Waldo Emerson
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
    
    // Walt Whitman
    { text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman" },
    { text: "Be curious, not judgmental.", author: "Walt Whitman" },
    { text: "I exist as I am, that is enough.", author: "Walt Whitman" },
    { text: "Resist much, obey little.", author: "Walt Whitman" },
    
    // Aristotle
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
    { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
    { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
    
    // Mother Teresa
    { text: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
    { text: "Not all of us can do great things. But we can do small things with great love.", author: "Mother Teresa" },
    { text: "Kind words can be short and easy to speak, but their echoes are truly endless.", author: "Mother Teresa" },
    
    // Oscar Wilde
    { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
    { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
    { text: "I can resist everything except temptation.", author: "Oscar Wilde" },
    { text: "The only way to get rid of a temptation is to yield to it.", author: "Oscar Wilde" },
    
    // Mark Twain
    { text: "The two most important days in your life are the day you are born and the day you find out why.", author: "Mark Twain" },
    { text: "Kindness is the language which the deaf can hear and the blind can see.", author: "Mark Twain" },
    { text: "Courage is resistance to fear, mastery of fear—not absence of fear.", author: "Mark Twain" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    
    // Confucius
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { text: "When we see men of worth, we should think of equaling them; when we see men of a contrary character, we should turn inwards and examine ourselves.", author: "Confucius" },
    
    // Buddha
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
    { text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "Buddha" },
    { text: "In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you.", author: "Buddha" },
    
    // Steve Jobs
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.", author: "Steve Jobs" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    
    // Winston Churchill
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill" },
    { text: "Courage is what it takes to stand up and speak; courage is also what it takes to sit down and listen.", author: "Winston Churchill" },
    { text: "We make a living by what we get, but we make a life by what we give.", author: "Winston Churchill" },
    
    // Helen Keller
    { text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.", author: "Helen Keller" },
    { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
    { text: "Keep your face to the sunshine and you cannot see a shadow.", author: "Helen Keller" },
    { text: "Alone we can do so little; together we can do so much.", author: "Helen Keller" },
    
    // Martin Luther King Jr.
    { text: "Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.", author: "Martin Luther King Jr." },
    { text: "The time is always right to do what is right.", author: "Martin Luther King Jr." },
    { text: "Faith is taking the first step even when you don't see the whole staircase.", author: "Martin Luther King Jr." },
    { text: "Our lives begin to end the day we become silent about things that matter.", author: "Martin Luther King Jr." },
    
    // Maya Angelou Additional
    { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
    { text: "Success is liking yourself, liking what you do, and liking how you do it.", author: "Maya Angelou" },
    
    // Theodore Roosevelt
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "It is hard to fail, but it is worse never to have tried to succeed.", author: "Theodore Roosevelt" },
    
    // Oprah Winfrey
    { text: "The biggest adventure you can ever take is to live the life of your dreams.", author: "Oprah Winfrey" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
    { text: "Be thankful for what you have; you'll end up having more.", author: "Oprah Winfrey" },
    
    // Rumi
    { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
    { text: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.", author: "Rumi" },
    { text: "The wound is the place where the Light enters you.", author: "Rumi" },
    
    // Dalai Lama
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "Be kind whenever possible. It is always possible.", author: "Dalai Lama" },
    
    // Miscellaneous Inspirational
    { text: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
    { text: "If you want to know what a man's like, take a good look at how he treats his inferiors, not his equals.", author: "J.K. Rowling" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "It is better to be hated for what you are than to be loved for what you are not.", author: "André Gide" },
    { text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.", author: "Bill Keane" },
    { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
    { text: "What we think, we become.", author: "Buddha" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "That which does not kill us makes us stronger.", author: "Friedrich Nietzsche" },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
    { text: "May you live all the days of your life.", author: "Jonathan Swift" },
    { text: "Life is a succession of lessons which must be lived to be understood.", author: "Helen Keller" },
    { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
    { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" }
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