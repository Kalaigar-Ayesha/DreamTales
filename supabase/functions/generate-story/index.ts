import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Edge function called');
    const body = await req.json();
    console.log('Request body:', body);
    const { mood, childAge } = body;

    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      throw new Error('Gemini API key not configured');
    }

    console.log('Gemini API key is configured');
    console.log('Mood:', mood, 'Child Age:', childAge);

    const prompt = `Write a short, engaging ${mood.name.toLowerCase()} story for a ${childAge}-year-old child. The story should be:
- Age-appropriate and safe
- Around 150-200 words
- ${mood.description}
- Easy to understand with simple vocabulary
- Have a positive, uplifting ending
- Include vivid but gentle imagery that sparks imagination

Make it magical and wonderful, perfect for bedtime or quiet time.`;

    console.log('Making Gemini API request...');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a talented children's storyteller who creates magical, age-appropriate stories that help children process emotions and feel comforted. Write stories that are engaging but calming, with positive messages.

${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 300,
        }
      }),
    });

    console.log('Gemini API response status:', response.status);
    const data = await response.json();
    console.log('Gemini API response data:', data);
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || `Gemini API error: ${response.status}`);
    }

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Unexpected Gemini API response format:', data);
      throw new Error('Unexpected response format from Gemini API');
    }

    const story = data.candidates[0].content.parts[0].text;
    console.log('Story generated successfully');

    return new Response(JSON.stringify({ story }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});