const MAX_TEXT_LENGTH = 220;
const MAX_CITY_LENGTH = 80;
const MAX_INTERESTS = 8;
const MAX_DAYS = 5;

const CITY_DEMOS = {
  delhi: {
    tagline: 'Mughal layers, market energy, and monuments that still shape daily life.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=900&q=80',
    overview:
      'Delhi is a living archive where imperial forts, Sufi courtyards, colonial avenues, and street-food lanes sit within a metro ride of each other. This plan balances famous landmarks with neighborhoods where local routines still carry the citys cultural memory.',
    attractions: [
      ['Red Fort', 'Walk the sandstone ramparts that once anchored Shahjahanabad and still host national ceremonies.', 'A symbol of Mughal power and modern Indian independence.'],
      ['Humayuns Tomb', 'Explore the garden-tomb symmetry that inspired later Mughal architecture.', 'Its Persian charbagh layout shaped the visual language of North Indian monuments.'],
      ['Chandni Chowk', 'Move through spice shops, old havelis, temples, mosques, and snack stalls in Old Delhi.', 'The bazaar keeps centuries-old trade, food, and festival traditions alive.'],
    ],
    hiddenGems: [
      ['Mehrauli Archaeological Park', 'Mehrauli', 'A scattered open-air museum of tombs, stepwells, and pre-Mughal ruins.', 'Go early, then pair it with Qutub Minar before crowds build.'],
      ['Nizamuddin Basti', 'Nizamuddin', 'A dense cultural quarter known for qawwali, food lanes, and Sufi heritage.', 'Visit respectfully in the evening and dress modestly around the dargah.'],
    ],
  },
  mumbai: {
    tagline: 'A sea-facing city of Art Deco facades, railway rhythm, and cinematic ambition.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=900&q=80',
    overview:
      'Mumbai rewards travelers who move between waterfront icons and working neighborhoods. The citys culture is shaped by port history, local trains, film studios, food stalls, and communities that have built their own rituals along the Arabian Sea.',
    attractions: [
      ['Gateway of India', 'Start at the basalt arch overlooking the harbor and ferry routes.', 'It marks the citys colonial port history and remains one of its most public gathering spaces.'],
      ['Chhatrapati Shivaji Terminus', 'Admire the Gothic-Victorian railway station that powers the citys daily movement.', 'The station is a UNESCO site and a symbol of Mumbais commuter culture.'],
      ['Marine Drive', 'End the day along the Queens Necklace as the lights curve around Back Bay.', 'The promenade is where locals come to slow down, talk, snack, and watch monsoon clouds.'],
    ],
    hiddenGems: [
      ['Khotachiwadi', 'Girgaon', 'A pocket of Portuguese-style homes and narrow lanes hidden near busy markets.', 'Walk quietly and treat it as a lived neighborhood, not a set.'],
      ['Sassoon Dock', 'Colaba', 'A working fish dock and mural district with early-morning energy.', 'Arrive early for the market rhythm, then explore nearby galleries.'],
    ],
  },
  bengaluru: {
    tagline: 'Garden city calm, palace stories, craft beer, and temple bells.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=900&q=80',
    overview:
      'Bengaluru blends old cantonment lanes, leafy parks, royal landmarks, and a modern cafe culture. This route keeps the pace flexible so heritage stops, food breaks, and neighborhood walks feel like part of the same city story.',
    attractions: [
      ['Bangalore Palace', 'Tour the Tudor-style palace rooms, courtyards, and royal memorabilia.', 'It reflects the Wadiyar eras taste for hybrid Indian and European design.'],
      ['Vidhana Soudha', 'See the monumental neo-Dravidian government building from the outside.', 'The building is a civic landmark and a strong visual identity for Karnataka.'],
      ['Bull Temple', 'Visit the Basavanagudi shrine dedicated to Nandi.', 'The temple anchors one of the citys older cultural neighborhoods.'],
    ],
    hiddenGems: [
      ['Malleshwaram Food Walk', 'Malleshwaram', 'A relaxed route of dosa counters, filter coffee, flower stalls, and old homes.', 'Go in the morning when temple and market activity overlap.'],
      ['Rangoli Metro Art Center', 'MG Road', 'A public art corridor tucked beside the metro line.', 'Check for small exhibitions and weekend performances.'],
    ],
  },
  kolkata: {
    tagline: 'Trams, literature, river light, and conversations that stretch for hours.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=900&q=80',
    overview:
      'Kolkata is best experienced through slow walks, old institutions, food counters, and neighborhoods where artists, students, priests, and booksellers keep the city expressive. The plan mixes grand colonial architecture with deeply local creative spaces.',
    attractions: [
      ['Victoria Memorial', 'Explore marble galleries, lawns, and exhibits tied to colonial Bengal.', 'It is one of Kolkatas most recognizable heritage landmarks.'],
      ['Howrah Bridge', 'Watch the flow of people, taxis, and flower sellers around the Hooghly crossing.', 'The bridge is a daily-life symbol as much as an engineering icon.'],
      ['College Street', 'Browse bookstalls and pause at the Indian Coffee House.', 'The area is central to the citys student, literary, and debate culture.'],
    ],
    hiddenGems: [
      ['Kumartuli', 'North Kolkata', 'A potters quarter where Durga idols are sculpted for festivals around the world.', 'Visit before Durga Puja season for the most active workshops.'],
      ['Marble Palace Area', 'Jorasanko', 'A quieter heritage pocket near old mansions and cultural institutions.', 'Plan ahead because some interiors require permission.'],
    ],
  },
  chennai: {
    tagline: 'Temple towers, classical music, beach mornings, and filter coffee.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80',
    overview:
      'Chennai carries its culture through temple neighborhoods, music sabhas, beach rituals, old colonial traces, and food traditions that begin early in the morning. This route keeps the citys spiritual, coastal, and artistic identities connected.',
    attractions: [
      ['Kapaleeshwarar Temple', 'See Dravidian gopuram art and daily temple rituals in Mylapore.', 'The temple is a major anchor of Chennais devotional and festival calendar.'],
      ['Fort St George', 'Visit the old British fort complex and museum.', 'It marks a key chapter in the citys colonial and trading history.'],
      ['Marina Beach', 'Walk the long urban beachfront at sunrise or sunset.', 'The beach is a democratic public space for snacks, families, speeches, and sea breeze.'],
    ],
    hiddenGems: [
      ['Mylapore Tank Streets', 'Mylapore', 'A walkable grid of temple shops, flower sellers, music halls, and breakfast counters.', 'Start with idli, pongal, and filter coffee before the heat rises.'],
      ['DakshinaChitra', 'ECR', 'A living museum of South Indian homes, crafts, and performances.', 'Check the schedule for workshops before going.'],
    ],
  },
  indore: {
    tagline: 'Holkar heritage, night markets, and Malwa flavors in every lane.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Indore_Rajwada01.jpg/1280px-Indore_Rajwada01.jpg',
    overview:
      'Indore pairs royal Holkar history with one of Indias strongest street-food identities. The city is compact enough for a culture-first route that moves from palace architecture to markets, craft lanes, and late-night snacks.',
    attractions: [
      ['Rajwada Palace', 'Explore the seven-storey palace facade and the old-city lanes around it.', 'Rajwada is the clearest public symbol of Holkar-era Indore.'],
      ['Lal Bagh Palace', 'Tour rooms that show royal taste, European influence, and local history.', 'The palace helps explain Indores transition from princely state to modern city.'],
      ['Sarafa Bazaar', 'Return after dark when jewelry shops transform into food stalls.', 'The night market is central to Indores identity as a food capital.'],
    ],
    hiddenGems: [
      ['Krishnapura Chhatris', 'Rajwada Area', 'Cenotaphs by the river that are especially atmospheric in evening light.', 'Pair this with Rajwada to understand the old city core.'],
      ['Chhappan Dukan Morning Snacks', 'New Palasia', 'A cleaner, organized food street for poha, jalebi, and quick tastings.', 'Go hungry and share plates to sample more.'],
    ],
  },
};

export function clipText(value, max = MAX_TEXT_LENGTH) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function slugifyCity(value) {
  return clipText(value, MAX_CITY_LENGTH).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function parseDurationDays(duration) {
  const days = Number.parseInt(String(duration || ''), 10);
  if (!Number.isFinite(days)) return 2;
  return Math.min(Math.max(days, 1), MAX_DAYS);
}

export function normalizeDiscoverPayload(payload = {}) {
  const rawInterests = Array.isArray(payload.interests) ? payload.interests : [];

  return {
    city: clipText(payload.city, MAX_CITY_LENGTH),
    duration: clipText(payload.duration || '2 days', 24),
    budget: clipText(payload.budget || 'mid-range', 40),
    pace: clipText(payload.pace || 'balanced', 40),
    travelers: clipText(payload.travelers || 'friends or family', 60),
    tripGoal: clipText(payload.tripGoal || 'Explore heritage, food, and culture', MAX_TEXT_LENGTH),
    interests: rawInterests.map((interest) => clipText(interest, 50)).filter(Boolean).slice(0, MAX_INTERESTS),
  };
}

function toAttraction([name, description, culturalSignificance], image) {
  return {
    name,
    description,
    culturalSignificance,
    imageKeywords: name,
    image,
  };
}

function toHiddenGem([name, location, whySpecial, localSecret], image) {
  return {
    name,
    location,
    whySpecial,
    localSecret,
    imageKeywords: name,
    image,
  };
}

export function createDemoItinerary(payload = {}) {
  const safe = normalizeDiscoverPayload(payload);
  const key = slugifyCity(safe.city);
  const profile = CITY_DEMOS[key] || CITY_DEMOS.delhi;
  const city = safe.city || 'Delhi';
  const days = parseDurationDays(safe.duration);
  const interestsText = safe.interests.length ? safe.interests.join(', ') : 'heritage, food, and local stories';

  return {
    city,
    source: 'demo',
    tagline: profile.tagline,
    culturalOverview: profile.overview,
    itinerary: {
      summary: `A ${safe.duration} ${safe.budget} route for ${safe.travelers}, paced as ${safe.pace}, with emphasis on ${interestsText}. ${safe.tripGoal}`,
      days: Array.from({ length: days }, (_, index) => {
        const dayNumber = index + 1;
        const attraction = profile.attractions[index % profile.attractions.length][0];
        const gem = profile.hiddenGems[index % profile.hiddenGems.length][0];

        return {
          dayNumber,
          theme: dayNumber === 1 ? 'Icons, Food, and First Impressions' : `Local Layers and Neighborhood Stories ${dayNumber}`,
          morning: {
            activity: `Begin with ${attraction}, keeping the visit slow enough for photos, context, and neighborhood details.`,
            tip: 'Start early for softer light, cooler weather, and easier transport.',
          },
          afternoon: {
            activity: `Shift into a nearby market or museum stop that matches ${interestsText}.`,
            tip: `Keep one flexible hour so the ${safe.pace} pace still feels personal.`,
          },
          evening: {
            activity: `Close with ${gem} or a food walk inspired by local recommendations.`,
            tip: 'Ask vendors or guides what is seasonal before ordering or booking.',
          },
        };
      }),
    },
    attractions: profile.attractions.map((item) => toAttraction(item, profile.image)),
    hiddenGems: profile.hiddenGems.map((item) => toHiddenGem(item, profile.image)),
    localEvents: [
      {
        name: `${city} Heritage Walks`,
        season: 'Weekends and festival periods',
        description: `Guided walks often reveal architecture, food rituals, and neighborhood histories that a quick sightseeing route misses.`,
      },
      {
        name: `${city} Food and Craft Pop-ups`,
        season: 'Seasonal',
        description: `Local pop-ups and markets are useful for tasting regional snacks, meeting makers, and finding souvenirs with better context.`,
      },
    ],
    immersiveStory: {
      title: `A Local Thread Through ${city}`,
      storyText: `Every Indian city carries stories in small routines: the first tea stall opening, the temple bell before traffic grows, the vendor who knows which lane wakes first.\n\nUse this demo route as a reliable preview while the live Groq key is unavailable. It keeps the same structure as the AI response, so the city page can be tested end to end.`,
    },
  };
}
