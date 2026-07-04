'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCityBySlug, cityFallbackImage } from '../cities';

// Prefer the real Wikipedia/Wikimedia image attached server-side; otherwise
// build a stable keyword photo URL (no API key needed).
const placeImage = (item, city, seed) => {
  if (item && item.image) return item.image;
  const raw = (item?.imageKeywords || item?.name || 'landmark').toString().trim();
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

const keywordFallback = (query, seed) =>
  `https://loremflickr.com/600/400/${encodeURIComponent(query)}?lock=${seed}`;

function CityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const city = getCityBySlug(params.city);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const cityName = city?.name || decodeURIComponent(String(params.city || '')).replace(/(^|\s)\S/g, (t) => t.toUpperCase());
  const duration = searchParams.get('duration') || '2 days';
  const budget = searchParams.get('budget') || 'mid-range';
  const pace = searchParams.get('pace') || 'balanced';
  const travelers = searchParams.get('travelers') || 'friends or family';
  const tripGoal = searchParams.get('tripGoal') || '';
  const interestsParam = searchParams.get('interests') || '';

  useEffect(() => {
    let cancelled = false;

    async function loadItinerary() {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);
      setData(null);

      try {
        const interests = interestsParam.split(',').map((s) => s.trim()).filter(Boolean);
        const res = await fetch('/api/discover', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            city: cityName,
            duration,
            budget,
            pace,
            travelers,
            tripGoal,
            interests,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || json.error || 'Something went wrong');
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError({
            message: err.message,
            isKeyError: /Groq API Key|not set/i.test(err.message || ''),
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadItinerary();

    return () => {
      cancelled = true;
    };
  }, [budget, cityName, duration, interestsParam, pace, reloadKey, travelers, tripGoal]);

  const heroImg = data?.attractions?.find((a) => a.image)?.image || city?.hero || cityFallbackImage(city, 1600, 700);
  const tripChips = [
    searchParams.get('duration'),
    searchParams.get('budget'),
    searchParams.get('pace'),
    searchParams.get('travelers'),
  ].filter(Boolean);

  return (
    <div>
      <div className="glow-blur-1"></div>
      <div className="glow-blur-2"></div>

      <a href="#main-content" className="skip-link">Skip to itinerary content</a>

      <header>
        <div className="container nav-container">
          <Link href="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            AuraTravel
          </Link>
          <Link href="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            All cities
          </Link>
        </div>
      </header>

      {/* City hero */}
      <section className="city-hero">
        <Image
          className="city-hero-img"
          src={heroImg}
          alt={cityName}
          fill
          priority
          sizes="100vw"
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1';
              e.currentTarget.src = cityFallbackImage(city, 1600, 700);
            }
          }}
        />
        <div className="city-hero-overlay"></div>
        <div className="container city-hero-content">
          <span className="badge badge-accent" style={{ marginBottom: '14px' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {data?.source === 'demo' ? 'Demo itinerary' : 'Live Groq itinerary'}
          </span>
          <h1>{cityName}</h1>
          {(data?.tagline || city?.tagline) && (
            <p className="city-hero-tag">{data?.tagline || city?.tagline}</p>
          )}
          {tripChips.length > 0 && (
            <div className="trip-chips">
              {tripChips.map((c, i) => (
                <span key={i} className="trip-chip">{c}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <main className="container" id="main-content" tabIndex={-1} style={{ paddingBottom: '40px' }}>
        {/* Error */}
        {error && (
          <section className="animate-fade-in" style={{ marginTop: '32px' }} role="alert" aria-live="assertive">
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
                <p>To enable live AI recommendations, add your Groq API key:</p>
                <div className="code-box">
                  # In <strong>.env.local</strong> (or your Vercel env vars):<br />
                  <span>GROQ_API_KEY=gsk_your_actual_key_here</span>
                </div>
              </div>
            ) : (
              <div className="env-alert glass" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                <h3>Couldn&apos;t generate this route</h3>
                <p>{error.message}</p>
                <button className="btn btn-primary" onClick={() => setReloadKey((key) => key + 1)} style={{ marginTop: '8px' }}>Try again</button>
              </div>
            )}
          </section>
        )}

        {/* Loading skeleton */}
        {loading && (
          <section className="discovery-pane glass skeleton-container animate-fade-in" style={{ marginTop: '32px' }} role="status" aria-live="polite" aria-label={`Loading itinerary for ${cityName}`}>
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

        {/* Results */}
        {data && !loading && (
          <section className="discovery-pane glass animate-fade-in" style={{ marginTop: '32px' }} aria-live="polite">
            {/* Cultural Overview */}
            {data.culturalOverview && (
              <div className="overview-card">
                <p>{data.culturalOverview}</p>
              </div>
            )}

            {/* Day-by-Day Itinerary */}
            {data.itinerary && (
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
                {data.itinerary.summary && (
                  <p style={{ marginBottom: '24px', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
                    {data.itinerary.summary}
                  </p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {(data.itinerary.days || []).map((day, idx) => (
                    <div key={idx} className="glass" style={{ padding: '24px', borderLeft: '4px solid var(--secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                        <h4 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>Day {day.dayNumber}: {day.theme}</h4>
                        <span className="badge badge-secondary">Explore</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                        {[['Morning', 'var(--accent)', day.morning], ['Afternoon', 'var(--secondary)', day.afternoon], ['Evening', 'var(--primary)', day.evening]].map(([label, color, slot], i) =>
                          slot ? (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px' }}>
                              <strong style={{ color, fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>{label}</strong>
                              <p style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>{slot.activity}</p>
                              {slot.tip && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}><span aria-hidden="true">Tip: </span>{slot.tip}</p>}
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions */}
            {data.attractions?.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Must-Visit Cultural Attractions
                </h3>
                <div className="detail-grid">
                  {data.attractions.map((a, idx) => (
                    <div key={idx} className="detail-card has-image">
                      <div className="detail-card-media">
                        <Image
                          src={placeImage(a, data.city, 100 + idx)}
                          alt={a.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = keywordFallback(`${data.city},India,heritage`, 100 + idx);
                            }
                          }}
                        />
                      </div>
                      <div className="detail-card-body">
                        <h4>{a.name}</h4>
                        <p>{a.description}</p>
                        {a.culturalSignificance && (
                          <div className="detail-highlight">
                            <strong>Cultural Heritage</strong>
                            {a.culturalSignificance}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden Gems */}
            {data.hiddenGems?.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                  </svg>
                  Hidden Gems &amp; Secret Spots
                </h3>
                <div className="detail-grid">
                  {data.hiddenGems.map((g, idx) => (
                    <div key={idx} className="detail-card has-image" style={{ borderTop: '2px solid var(--secondary)' }}>
                      <div className="detail-card-media">
                        <Image
                          src={placeImage(g, data.city, 200 + idx)}
                          alt={g.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                          onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                              e.currentTarget.dataset.fallback = '1';
                              e.currentTarget.src = keywordFallback(`${data.city},India,street`, 200 + idx);
                            }
                          }}
                        />
                      </div>
                      <div className="detail-card-body">
                        <h4>{g.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', marginBottom: '8px', fontWeight: 600 }}>
                          <span aria-hidden="true">Location: </span>{g.location || 'Local Neighborhood'}
                        </p>
                        <p>{g.whySpecial}</p>
                        {g.localSecret && (
                          <div className="detail-highlight" style={{ borderLeftColor: 'var(--secondary)' }}>
                            <strong>Local Insider Tip</strong>
                            {g.localSecret}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Events */}
            {data.localEvents?.length > 0 && (
              <div className="pane-section">
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Local Festivals &amp; Events
                </h3>
                <div className="detail-grid">
                  {data.localEvents.map((ev, idx) => (
                    <div key={idx} className="detail-card">
                      <h4>{ev.name}</h4>
                      <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '4px 10px', marginBottom: '12px' }}>
                        <span aria-hidden="true">Season: </span>{ev.season}
                      </span>
                      <p>{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immersive Story */}
            {data.immersiveStory && (
              <div className="pane-section" style={{ marginBottom: 0 }}>
                <h3 className="pane-section-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  Immersive Storytelling &amp; Local Legends
                </h3>
                <div className="story-panel">
                  <h4 className="story-title">{data.immersiveStory.title}</h4>
                  <div className="story-text">
                    {String(data.immersiveStory.storyText || '').split('\n\n').map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Plan another */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/" className="btn btn-primary" style={{ padding: '14px 28px' }}>
                Plan another city
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AuraTravel. Groq-ready itinerary engine with Wikimedia imagery.</p>
        </div>
      </footer>
    </div>
  );
}

export default function CityPageWrapper() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>}>
      <CityPage />
    </Suspense>
  );
}
