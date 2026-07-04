'use client';

import { useState } from 'react';

const METRO_CITIES = [
  { name: 'Delhi', country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', query: 'Delhi,India,IndiaGate', tagline: 'The Heartbeat of History' },
  { name: 'Mumbai', country: 'India', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80', query: 'Mumbai,India,GatewayOfIndia', tagline: 'The Dream Weaver City' },
  { name: 'Bengaluru', country: 'India', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80', query: 'Bengaluru,India,VidhanaSoudha', tagline: 'The Silicon Valley of Heritage' },
  { name: 'Kolkata', country: 'India', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=600&q=80', query: 'Kolkata,India,HowrahBridge', tagline: 'The Cultural Capital of Joy' },
  { name: 'Chennai', country: 'India', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80', query: 'Chennai,India,MarinaBeach', tagline: 'The Gateway to Southern Soul' },
  { name: 'Indore', country: 'India', image: 'https://loremflickr.com/600/400/Indore,Rajwada,India?lock=61', query: 'Indore,Rajwada,palace,India', tagline: 'The Cleanest Gem of Heritage' }
];

// Resolves the best available photo for a place. Prefers the real
// Wikipedia/Wikimedia image attached server-side; otherwise builds a stable
// keyword-based photo URL (no API key needed). `seed` keeps the same fallback
// photo across re-renders.
const buildPlaceImage = (item, city, seed) => {
  if (item && item.image) return item.image;
  const raw = (item?.imageKeywords || item?.name || 'landmark').toString().trim();
  // Keep the query broad (first 2 tokens + city) so the fallback pool is large
  // enough to return varied, relevant results.
  const tags = raw
    .replace(/[^\p{L}\p{N}\s,]/gu, ' ')
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .join(',');
  const cityTag = (city || '').replace(/[^\p{L}\p{N}]/gu, '');
  const query = encodeURIComponent([tags, cityTag].filter(Boolean).join(',') || 'India,travel');
  return `https://loremflickr.com/600/400/${query}?lock=${seed}`;
};

const CITY_FALLBACK = (query, seed) =>
  `https://loremflickr.com/600/400/${encodeURIComponent(query)}?lock=${seed}`;

const INTERESTS_OPTIONS = [
  'Heritage walks',
  'Food trails',
  'Hidden gems',
  'Museums',
  'Local festivals',
  'Craft workshops',
  'Street markets',
  'Storytelling'
];

export default function Home() {
  // Planner Form States
  const [city, setCity] = useState('Delhi');
  const [duration, setDuration] = useState('2 days');
  const [budget, setBudget] = useState('mid-range');
  const [pace, setPace] = useState('balanced');
  const [travelers, setTravelers] = useState('friends or family');
  const [tripGoal, setTripGoal] = useState('Discover heritage, food, and authentic local stories');
  const [selectedInterests, setSelectedInterests] = useState(['Heritage walks', 'Food trails', 'Hidden gems']);

  // UI States
  const [loading, setLoading] = useState(false);
  const [discoveryData, setDiscoveryData] = useState(null);
  const [error, setError] = useState(null);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const fetchItinerary = async (targetCity = city) => {
    setLoading(true);
    setError(null);
    setDiscoveryData(null);

    // Scroll to results section or loading section
    setTimeout(() => {
      const el = document.getElementById('planner-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          city: targetCity,
          duration,
          budget,
          pace,
          travelers,
          tripGoal,
          interests: selectedInterests
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      setDiscoveryData(data);
    } catch (err) {
      setError({
        message: err.message,
        isKeyError: err.message.includes('Groq API Key') || err.message.includes('not set')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchItinerary(city);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    fetchItinerary(selectedCity);
  };

  return (
    <div>
      {/* Background glow effects */}
      <div className="glow-blur-1"></div>
      <div className="glow-blur-2"></div>

      <header>
        <div className="container nav-container">
          <a href="#" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            AuraTravel
          </a>
          <span className="badge badge-primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Groq Engine Active
          </span>
        </div>
      </header>

      <main className="container">
        {/* Hero Section */}
        <section className="hero animate-fade-in-up">
          <span className="badge badge-accent" style={{ marginBottom: '16px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            AI Itinerary Co-pilot
          </span>
          <h1>Experience Cities Like a <span>Local</span></h1>
          <p>
            Skip generic guides. Input your travel preferences and generate a personalized, culture-first itinerary instantly.
          </p>
        </section>

        {/* Featured Metro Cities Section */}
        <section className="destinations-section animate-fade-in" style={{ padding: '0 0 60px 0' }}>
          <h2 className="section-title">Explore Indian Heritage Hubs</h2>
          <p className="section-subtitle">
            Click any featured city to automatically initialize a custom AI itinerary.
          </p>

          <div className="grid-destinations">
            {METRO_CITIES.map((metroCity, idx) => (
              <div
                key={idx}
                className="dest-card"
                onClick={() => handleCitySelect(metroCity.name)}
                id={`city-card-${metroCity.name.toLowerCase()}`}
              >
                <div className="dest-image-container">
                  <img
                    src={metroCity.image}
                    alt={`${metroCity.name} skyline`}
                    className="dest-img"
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = CITY_FALLBACK(metroCity.query, idx + 1);
                      }
                    }}
                  />
                </div>
                <div className="dest-overlay"></div>
                <div className="dest-content">
                  <span className="dest-tagline">{metroCity.tagline}</span>
                  <h3 className="dest-name">{metroCity.name}</h3>
                  <span className="dest-country">{metroCity.country}</span>
                  <div className="dest-explore-btn">
                    <span>Generate AI Route</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Itinerary Studio Section */}
        <section className="planner-section glass animate-fade-in" style={{ padding: '40px', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--secondary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            Groq-Powered Planner
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px', fontWeight: 800 }}>AI Itinerary Studio</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
            Customize your inputs below to design an authentic local itinerary tailored to your specifications.
          </p>

          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              
              {/* City dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 24, 18, 0.7)',
                    border: '1px solid var(--card-border)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}
                  required
                >
                  {METRO_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Duration Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 24, 18, 0.7)',
                    border: '1px solid var(--card-border)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="1 day">1 day</option>
                  <option value="2 days">2 days</option>
                  <option value="3 days">3 days</option>
                </select>
              </div>

              {/* Budget Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Budget</label>
                <select 
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 24, 18, 0.7)',
                    border: '1px solid var(--card-border)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="budget">budget</option>
                  <option value="mid-range">mid-range</option>
                  <option value="luxury">luxury</option>
                </select>
              </div>

              {/* Pace Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Pace</label>
                <select 
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 24, 18, 0.7)',
                    border: '1px solid var(--card-border)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="relaxed">relaxed</option>
                  <option value="balanced">balanced</option>
                  <option value="fast-paced">fast-paced</option>
                </select>
              </div>

              {/* Travelers */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Travelers</label>
                <select 
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(10, 24, 18, 0.7)',
                    border: '1px solid var(--card-border)',
                    color: '#fff',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="solo">solo traveler</option>
                  <option value="couple">couple</option>
                  <option value="friends or family">friends or family</option>
                  <option value="business">business traveler</option>
                </select>
              </div>

            </div>

            {/* Trip Goal Textarea */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Trip goal</label>
              <textarea 
                value={tripGoal}
                onChange={(e) => setTripGoal(e.target.value)}
                placeholder="What do you want to accomplish or experience on this trip?"
                rows={3}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: 'rgba(13, 20, 38, 0.7)',
                  border: '1px solid var(--card-border)',
                  color: '#fff',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Interests Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Interests</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {INTERESTS_OPTIONS.map((interest, idx) => {
                  const isActive = selectedInterests.includes(interest);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '30px',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--secondary)' : 'rgba(255, 255, 255, 0.1)',
                        background: isActive ? 'var(--secondary)' : 'rgba(10, 24, 18, 0.4)',
                        color: isActive ? 'hsl(160, 40%, 6%)' : '#fff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? '0 0 15px var(--secondary-glow)' : 'none'
                      }}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '12px' }}>
              Generate {city || 'City'} AI Route
            </button>
          </form>
        </section>

        {/* Anchor point for scrolling */}
        <div id="planner-anchor" style={{ height: '10px' }}></div>

        {/* Dynamic AI Results Pane */}
        {error && (
          <section className="animate-fade-in">
            {error.isKeyError ? (
              <div className="env-alert glass">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  Setup Required: Groq API Key Missing
                </h3>
                <p>
                  To enable live generative AI recommendations, please add your Groq API key in the configuration:
                </p>
                <div className="code-box">
                  # 1. Open the file <strong>.env.local</strong> at the project root.<br/>
                  # 2. Replace the placeholder value with your key:<br/>
                  <span>GROQ_API_KEY=gsk_your_actual_key_here</span>
                </div>
                <p style={{ marginTop: '16px', fontSize: '0.9rem', opacity: 0.8 }}>
                  Once updated, restart your local development server to load the new environment variable.
                </p>
              </div>
            ) : (
              <div className="env-alert glass" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                <h3>Error Executing GenAI</h3>
                <p>{error.message}</p>
              </div>
            )}
          </section>
        )}

        {loading && (
          <section className="discovery-pane glass skeleton-container animate-fade-in" id="loading-skeleton">
            <div className="shimmer-bg skeleton-title"></div>
            <div className="shimmer-bg skeleton-tagline"></div>
            <div className="shimmer-bg skeleton-text"></div>
            <div className="shimmer-bg skeleton-text"></div>
            <div className="shimmer-bg skeleton-text short"></div>
            <div className="skeleton-grid">
              <div className="shimmer-bg skeleton-card"></div>
              <div className="shimmer-bg skeleton-card"></div>
              <div className="shimmer-bg skeleton-card"></div>
            </div>
          </section>
        )}

        {discoveryData && !loading && (
          <section className="discovery-pane glass animate-fade-in" id="discovery-results">
            <div className="discovery-header">
              <div className="discovery-title">
                <h2>{discoveryData.city} Custom Route</h2>
                <div className="discovery-tagline">{discoveryData.tagline}</div>
              </div>
              <span className="badge badge-accent">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                Groq Studio Planner
              </span>
            </div>

            {/* Cultural Overview */}
            {discoveryData.culturalOverview && (
              <div className="overview-card">
                <p>{discoveryData.culturalOverview}</p>
              </div>
            )}

            {/* Custom Day-by-Day Itinerary */}
            {discoveryData.itinerary && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Custom Day-by-Day Plan
                </h3>
                <p style={{ marginBottom: '24px', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                  {discoveryData.itinerary.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
                  {discoveryData.itinerary.days.map((day, idx) => (
                    <div key={idx} className="glass" style={{ padding: '24px', position: 'relative', borderLeft: '4px solid var(--secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Day {day.dayNumber}: {day.theme}</h4>
                        <span className="badge badge-secondary">Explore</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '16px' }}>
                        {day.morning && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                            <strong style={{ color: 'var(--accent)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>🌅 Morning</strong>
                            <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>{day.morning.activity}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>💡 {day.morning.tip}</p>
                          </div>
                        )}
                        {day.afternoon && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                            <strong style={{ color: 'var(--secondary)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>☀️ Afternoon</strong>
                            <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>{day.afternoon.activity}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>💡 {day.afternoon.tip}</p>
                          </div>
                        )}
                        {day.evening && (
                          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                            <strong style={{ color: 'var(--primary)', fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>🌙 Evening</strong>
                            <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>{day.evening.activity}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>💡 {day.evening.tip}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Core Attractions */}
            {discoveryData.attractions && discoveryData.attractions.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Must-Visit Cultural Attractions
                </h3>
                <div className="detail-grid">
                  {discoveryData.attractions.map((attraction, idx) => (
                    <div key={idx} className="detail-card has-image">
                      <div className="detail-card-media">
                        <img
                          src={buildPlaceImage(attraction, discoveryData.city, 100 + idx)}
                          alt={attraction.name}
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = CITY_FALLBACK(`${discoveryData.city},India,heritage`, 100 + idx);
                            }
                          }}
                        />
                      </div>
                      <div className="detail-card-body">
                        <h4>{attraction.name}</h4>
                        <p>{attraction.description}</p>
                        {attraction.culturalSignificance && (
                          <div className="detail-highlight">
                            <strong>Cultural Heritage</strong>
                            {attraction.culturalSignificance}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Gems */}
            {discoveryData.hiddenGems && discoveryData.hiddenGems.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                  Hidden Gems & Secret Spots
                </h3>
                <div className="detail-grid">
                  {discoveryData.hiddenGems.map((gem, idx) => (
                    <div key={idx} className="detail-card has-image" style={{ borderTop: '2px solid var(--secondary)' }}>
                      <div className="detail-card-media">
                        <img
                          src={buildPlaceImage(gem, discoveryData.city, 200 + idx)}
                          alt={gem.name}
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = CITY_FALLBACK(`${discoveryData.city},India,street`, 200 + idx);
                            }
                          }}
                        />
                      </div>
                      <div className="detail-card-body">
                        <h4>{gem.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '8px', fontWeight: 600 }}>
                          📍 {gem.location || 'Local Neighborhood'}
                        </p>
                        <p>{gem.whySpecial}</p>
                        {gem.localSecret && (
                          <div className="detail-highlight" style={{ borderLeftColor: 'var(--secondary)' }}>
                            <strong>Local Insider Tip</strong>
                            {gem.localSecret}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Events & Festivals */}
            {discoveryData.localEvents && discoveryData.localEvents.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Local Festivals & Events
                </h3>
                <div className="detail-grid">
                  {discoveryData.localEvents.map((event, idx) => (
                    <div key={idx} className="detail-card">
                      <h4>{event.name}</h4>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '4px 10px', marginBottom: '12px' }}>
                        📅 {event.season}
                      </span>
                      <p>{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immersive Folklore Story */}
            {discoveryData.immersiveStory && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Immersive Storytelling & Local Legends
                </h3>
                <div className="story-panel">
                  <h4 className="story-title">{discoveryData.immersiveStory.title}</h4>
                  <div className="story-text">
                    {discoveryData.immersiveStory.storyText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AuraTravel. Powered by Groq Llama 3.3. Zero-weight assets configuration.</p>
        </div>
      </footer>
    </div>
  );
}
