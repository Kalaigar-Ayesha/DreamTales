import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { mood, childAge } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Write a short, engaging ${mood.name.toLowerCase()} story for a ${childAge}-year-old child. The story should be:
- Age-appropriate and safe
- Around 150-200 words
- ${mood.description}
- Easy to understand with simple vocabulary
- Have a positive, uplifting ending
- Include vivid but gentle imagery that sparks imagination

Make it magical and wonderful, perfect for bedtime or quiet time.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a talented children\'s storyteller who creates magical, age-appropriate stories that help children process emotions and feel comforted. Write stories that are engaging but calming, with positive messages.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate story');
    }

    const story = data.choices[0].message.content;

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