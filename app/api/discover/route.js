import { NextResponse } from 'next/server';

// Fetches the top Wikipedia search hit (title + page image) for a query.
// No API key required. Returns null on any miss.
async function fetchWikiHit(query) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=800&origin=*`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AuraTravel/1.0 (cultural travel discovery demo)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0];
    if (!first?.thumbnail?.source) return null;
    return { title: first.title || '', thumb: first.thumbnail.source };
  } catch {
    return null;
  }
}

// Searches Wikimedia Commons files directly for an actual photo of the place.
// This covers many lesser-known spots that lack a dedicated Wikipedia article.
async function fetchCommonsHit(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=800&origin=*`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'AuraTravel/1.0 (cultural travel discovery demo)' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0];
    const info = first?.imageinfo?.[0];
    if (!info?.thumburl) return null;
    return { title: first.title || '', thumb: info.thumburl };
  } catch {
    return null;
  }
}

// A hit is trusted only if the article/file title shares a distinctive word with
// the place name. This rejects false matches (e.g. a generic city article whose
// lead photo would otherwise be reused for every place).
function isRelevantHit(hit, placeName, cityName) {
  if (!hit) return false;
  const stop = new Set(['the', 'of', 'and', 'palace', 'temple', 'bazaar', 'market', 'fort', 'lake', 'garden', 'road', 'city', (cityName || '').toLowerCase()]);
  const tokens = (placeName || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3 && !stop.has(t));
  if (tokens.length === 0) return true; // nothing distinctive to check against
  const title = hit.title.toLowerCase();
  return tokens.some((t) => title.includes(t));
}

// Attaches a real, place-accurate image URL to each attraction / hidden gem.
async function enrichWithImages(parsed, cityName) {
  const city = parsed?.city || cityName || '';
  const items = [
    ...(Array.isArray(parsed?.attractions) ? parsed.attractions : []),
    ...(Array.isArray(parsed?.hiddenGems) ? parsed.hiddenGems : []),
  ];
  await Promise.all(
    items.map(async (item) => {
      if (!item || typeof item !== 'object') return;
      const name = item.name || item.imageKeywords || '';
      const kw = item.imageKeywords || name;

      // 1) Wikipedia article lead image — cleanest "hero" shots for landmarks.
      const wiki =
        (await fetchWikiHit(`${kw} ${city}`)) || (await fetchWikiHit(`${name} ${city}`));
      if (isRelevantHit(wiki, name, city)) {
        item.image = wiki.thumb;
        return;
      }

      // 2) Wikimedia Commons file search — real photos of lesser-known places.
      const commons =
        (await fetchCommonsHit(`${name} ${city}`)) || (await fetchCommonsHit(`${kw} ${city}`));
      if (isRelevantHit(commons, name, city)) {
        item.image = commons.thumb;
        return;
      }

      // 3) No trustworthy match — let the client use a keyword photo fallback.
      item.image = null;
    })
  );
  return parsed;
}

export async function POST(request) {
  try {
    const { 
      city, 
      duration = '2 days', 
      budget = 'mid-range', 
      pace = 'balanced', 
      travelers = 'friends or family', 
      tripGoal = '', 
      interests = [] 
    } = await request.json();

    if (!city) {
      return NextResponse.json({ error: 'City parameter is required.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY_HERE') {
      return NextResponse.json(
        { 
          error: 'Groq API Key is not set.', 
          message: 'Please paste your GROQ_API_KEY in the `.env.local` file at the root of the project and restart the server.'
        }, 
        { status: 500 }
      );
    }

    const systemPrompt = `You are a world-class travel planner, cultural historian, and local storyteller.
Your task is to plan a custom itinerary for "${city}" matching the user's preferences:
- Duration: ${duration}
- Budget: ${budget}
- Pace: ${pace}
- Travelers: ${travelers}
- Specific Trip Goal: ${tripGoal || 'Explore heritage, food, and culture'}
- Selected Interests: ${interests.join(', ') || 'general sightseeing'}

You MUST return your response as a JSON object. Ensure the keys and structure match EXACTLY as follows:

{
  "city": "Name of the City",
  "tagline": "A short, poetic tagline capturing the city's essence",
  "culturalOverview": "A beautiful, rich paragraph summarizing the unique cultural identity, heritage, and atmosphere of the city.",
  
  "itinerary": {
    "summary": "A customized overview summarizing how this trip fits the traveler's pace, budget, and interests.",
    "days": [
      {
        "dayNumber": 1,
        "theme": "Theme of Day 1 (e.g. Ancient Roots & Street Flavors)",
        "morning": {
          "activity": "Detailed activity description suited for the budget and pace.",
          "tip": "Local insider tip or custom for this morning activity."
        },
        "afternoon": {
          "activity": "Detailed activity description suited for the budget and pace.",
          "tip": "Local insider tip or custom for this afternoon activity."
        },
        "evening": {
          "activity": "Detailed activity description suited for the budget and pace.",
          "tip": "Local insider tip or custom for this evening activity."
        }
      }
    ]
  },

  "attractions": [
    {
      "name": "Name of Landmark 1",
      "description": "Engaging description focusing on history and architecture",
      "culturalSignificance": "Why this is culturally important to the locals",
      "imageKeywords": "2-4 concise photo search keywords for THIS exact place, e.g. 'Rajwada Palace Indore'"
    },
    {
      "name": "Name of Landmark 2",
      "description": "Engaging description focusing on history and architecture",
      "culturalSignificance": "Why this is culturally important to the locals",
      "imageKeywords": "2-4 concise photo search keywords for THIS exact place"
    }
  ],
  "hiddenGems": [
    {
      "name": "Hidden Gem 1",
      "location": "General neighborhood or area",
      "whySpecial": "Why this is a hidden gem and what unique local experience it offers.",
      "localSecret": "An insider tip or custom for visiting this place.",
      "imageKeywords": "2-4 concise photo search keywords for THIS exact spot"
    }
  ],
  "localEvents": [
    {
      "name": "Event/Festival 1",
      "season": "Month or season of occurrence",
      "description": "Details about the festival celebrations, food, and cultural meaning."
    }
  ],
  "immersiveStory": {
    "title": "A title for a local legend, folklore, or historic anecdote",
    "storyText": "A detailed, captivating storytelling text (2 paragraphs) describing a local legend, myth, historical event, or neighborhood custom that makes the city feel alive."
  }
}

Note: The "days" array in the itinerary object should contain exactly ${parseInt(duration) || 2} day objects. Keep all text rich but concise. Do not include any pre-text or post-text. The response must be pure JSON.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Plan custom trip for ${city}` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API Error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from Groq API.', details: errorText }, { status: groqResponse.status });
    }

    const data = await groqResponse.json();
    const parsedContent = JSON.parse(data.choices[0].message.content);

    // Enrich with real Wikipedia/Wikimedia photos for each place.
    await enrichWithImages(parsedContent, city);

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.', message: error.message }, { status: 500 });
  }
}
