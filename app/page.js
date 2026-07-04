'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CITIES,
  DURATION_OPTIONS,
  BUDGET_OPTIONS,
  PACE_OPTIONS,
  TRAVELER_OPTIONS,
  INTERESTS_OPTIONS,
  cityFallbackImage,
} from './cities';

export default function Home() {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState(null); // city object when modal open

  const openPlanner = (city) => setActiveCity(city);
  const closePlanner = () => setActiveCity(null);

  return (
    <div>
      {/* Background glow effects */}
      <div className="glow-blur-1"></div>
      <div className="glow-blur-2"></div>

      <header>
        <div className="container nav-container">
          <a href="#" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            AuraTravel
          </a>
          <span className="badge badge-primary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            AI Route Engine
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
            Pick a heritage hub, tell us how you like to travel, and get a personalized,
            culture-first itinerary generated live by Generative AI.
          </p>
        </section>

        {/* Featured Cities Section */}
        <section className="destinations-section animate-fade-in" style={{ padding: '0 0 60px 0' }}>
          <h2 className="section-title">Explore Indian Heritage Hubs</h2>
          <p className="section-subtitle">
            Choose a city to start planning — we&apos;ll open a quick planner, then craft your custom route.
          </p>

          <div className="grid-destinations">
            {CITIES.map((city) => (
              <button
                type="button"
                key={city.slug}
                className="dest-card"
                onClick={() => openPlanner(city)}
                id={`city-card-${city.slug}`}
              >
                <div className="dest-image-container">
                  <Image
                    src={city.image}
                    alt={`${city.name} skyline`}
                    className="dest-img"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    onError={(e) => {
                      if (!e.currentTarget.dataset.fallback) {
                        e.currentTarget.dataset.fallback = '1';
                        e.currentTarget.src = cityFallbackImage(city);
                      }
                    }}
                  />
                </div>
                <div className="dest-overlay"></div>
                <div className="dest-content">
                  <span className="dest-tagline">{city.tagline}</span>
                  <h3 className="dest-name">{city.name}</h3>
                  <span className="dest-country">{city.country}</span>
                  <div className="dest-explore-btn">
                    <span>Plan this trip</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* How it works strip */}
        <section className="steps-strip animate-fade-in">
          {[
            { n: '01', t: 'Pick a city', d: 'Tap any heritage hub to lock in your destination.' },
            { n: '02', t: 'Set your vibe', d: 'Duration, budget, pace, company and interests.' },
            { n: '03', t: 'Get your route', d: 'A live AI itinerary on its own shareable city page.' },
          ].map((s) => (
            <div key={s.n} className="glass step-card">
              <span className="step-num">{s.n}</span>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AuraTravel. Groq-ready itinerary engine with Wikimedia imagery.</p>
        </div>
      </footer>

      {activeCity && (
        <PlannerModal city={activeCity} onClose={closePlanner} router={router} />
      )}
    </div>
  );
}

function PlannerModal({ city, onClose, router }) {
  const closeButtonRef = useRef(null);
  const [duration, setDuration] = useState('2 days');
  const [budget, setBudget] = useState('mid-range');
  const [pace, setPace] = useState('balanced');
  const [travelers, setTravelers] = useState('friends or family');
  const [tripGoal, setTripGoal] = useState('Discover heritage, food, and authentic local stories');
  const [selectedInterests, setSelectedInterests] = useState(['Heritage walks', 'Food trails', 'Hidden gems']);
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const params = new URLSearchParams({
      duration,
      budget,
      pace,
      travelers,
      tripGoal,
      interests: selectedInterests.join(','),
    });
    router.push(`/${city.slug}?${params.toString()}`);
  };

  const selectStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(10, 24, 18, 0.7)',
    border: '1px solid var(--card-border)',
    color: '#fff',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-card glass"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`planner-title-${city.slug}`}
        aria-describedby={`planner-description-${city.slug}`}
      >
        {/* Locked-city header */}
        <div className="modal-hero">
          <Image
            src={city.image}
            alt={city.name}
            fill
            sizes="640px"
            onError={(e) => {
              if (!e.currentTarget.dataset.fallback) {
                e.currentTarget.dataset.fallback = '1';
                e.currentTarget.src = cityFallbackImage(city);
              }
            }}
          />
          <div className="modal-hero-overlay"></div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close planner" ref={closeButtonRef}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="modal-hero-content">
            <span className="badge badge-secondary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Destination locked
            </span>
            <h3 id={`planner-title-${city.slug}`}>{city.name}</h3>
            <span className="modal-hero-tag" id={`planner-description-${city.slug}`}>{city.tagline}</span>
          </div>
        </div>

        {/* Planner form */}
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-grid">
            <label className="field">
              <span>Duration</span>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} style={selectStyle}>
                {DURATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Budget</span>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={selectStyle}>
                {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Pace</span>
              <select value={pace} onChange={(e) => setPace(e.target.value)} style={selectStyle}>
                {PACE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Travelers</span>
              <select value={travelers} onChange={(e) => setTravelers(e.target.value)} style={selectStyle}>
                {TRAVELER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Trip goal</span>
            <textarea
              value={tripGoal}
              onChange={(e) => setTripGoal(e.target.value)}
              rows={2}
              placeholder="What do you want to experience?"
              style={{ ...selectStyle, cursor: 'text', resize: 'vertical' }}
            />
          </label>

          <div className="field">
            <span>Interests</span>
            <div className="pill-row">
              {INTERESTS_OPTIONS.map((interest) => {
                const isActive = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`pill ${isActive ? 'pill-active' : ''}`}
                    aria-pressed={isActive}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem' }} disabled={submitting}>
            {submitting ? 'Crafting your route…' : `Generate ${city.name} AI Route`}
            {!submitting && (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
