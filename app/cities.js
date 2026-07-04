// Shared data for the featured cities. Used by the home page (cards + planner
// modal) and the dynamic /[city] route so both stay in sync.

export const CITIES = [
  {
    name: 'Delhi',
    slug: 'delhi',
    country: 'India',
    tagline: 'The Heartbeat of History',
    blurb: 'Mughal grandeur, colonial boulevards and buzzing bazaars layered across a thousand years.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80',
    query: 'Delhi,India,IndiaGate',
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    country: 'India',
    tagline: 'The Dream Weaver City',
    blurb: 'Art-deco seafronts, Bollywood dreams and street food that never sleeps.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
    query: 'Mumbai,India,GatewayOfIndia',
  },
  {
    name: 'Bengaluru',
    slug: 'bengaluru',
    country: 'India',
    tagline: 'The Silicon Valley of Heritage',
    blurb: 'Garden-city calm, palace gates and a café culture wrapped around ancient temples.',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=80',
    query: 'Bengaluru,India,VidhanaSoudha',
  },
  {
    name: 'Kolkata',
    slug: 'kolkata',
    country: 'India',
    tagline: 'The Cultural Capital of Joy',
    blurb: 'Trams, poetry, colonial mansions and the warmest adda over endless cups of chai.',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1600&q=80',
    query: 'Kolkata,India,HowrahBridge',
  },
  {
    name: 'Chennai',
    slug: 'chennai',
    country: 'India',
    tagline: 'The Gateway to Southern Soul',
    blurb: 'Temple gopurams, Marina breezes and filter-coffee mornings by the Bay of Bengal.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    hero: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
    query: 'Chennai,India,MarinaBeach',
  },
  {
    name: 'Indore',
    slug: 'indore',
    country: 'India',
    tagline: 'The Cleanest Gem of Heritage',
    blurb: 'Holkar palaces, the legendary Sarafa night bazaar and Malwa flavours in every lane.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Indore_Rajwada01.jpg/1280px-Indore_Rajwada01.jpg',
    hero: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Indore_Rajwada01.jpg/1280px-Indore_Rajwada01.jpg',
    query: 'Indore,Rajwada,palace,India',
  },
];

export const DURATION_OPTIONS = ['1 day', '2 days', '3 days'];
export const BUDGET_OPTIONS = ['budget', 'mid-range', 'luxury'];
export const PACE_OPTIONS = ['relaxed', 'balanced', 'fast-paced'];
export const TRAVELER_OPTIONS = ['solo', 'couple', 'friends or family', 'business'];

export const INTERESTS_OPTIONS = [
  'Heritage walks',
  'Food trails',
  'Hidden gems',
  'Museums',
  'Local festivals',
  'Craft workshops',
  'Street markets',
  'Storytelling',
];

export const getCityBySlug = (slug) =>
  CITIES.find((c) => c.slug === String(slug || '').toLowerCase());

// Fallback image for a city (used if a curated URL ever fails to load).
export const cityFallbackImage = (city, w = 800, h = 500) =>
  `https://loremflickr.com/${w}/${h}/${encodeURIComponent(city?.query || 'India,travel')}?lock=7`;
