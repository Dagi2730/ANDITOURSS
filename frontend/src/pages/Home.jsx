import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import HotelRecommendations from '../components/HotelRecommendations';

// 5 Bundled Local Assets for 100% Guaranteed Image Loading (No CORS/Hotlinking Blocks)
import lalibelaImg from '../assets/images/lalibela.jpg';
import simienImg from '../assets/images/simien.jpg';
import danakilImg from '../assets/images/danakil.jpg';
import gondarImg from '../assets/images/gondar.jpg';
import bluenileImg from '../assets/images/bluenile.jpg';

const HERO_SLIDES = [
  {
    id: 1,
    image: lalibelaImg,
    title: "Lalibela Rock-Hewn Churches",
    subtitle: "8th Wonder of the Ancient World",
    location: "Lalibela, Amhara Region, Ethiopia",
    tagline: "Explore 11 monolithic churches carved entirely out of solid volcanic rock in the 12th century."
  },
  {
    id: 2,
    image: simienImg,
    title: "Simien Mountains Escarpments",
    subtitle: "The Roof of Africa",
    location: "Gondar Highlands, Ethiopia",
    tagline: "Trek dramatic escarpments over 4,000 meters and encounter endemic Gelada Baboons and Walia Ibex."
  },
  {
    id: 3,
    image: danakilImg,
    title: "Danakil Depression & Dallol",
    subtitle: "Surreal Volcanic Hydrothermal Fields",
    location: "Afar Region, Ethiopia",
    tagline: "Witness vibrant hydrothermal neon pools, active lava lakes at Erta Ale, and vast salt flats."
  },
  {
    id: 4,
    image: gondarImg,
    title: "Gondar Fasil Ghebbi Castles",
    subtitle: "The Camelot of Africa",
    location: "Gondar City, Ethiopia",
    tagline: "Step inside 17th-century royal fortress palaces, banquet halls, and historic bathhouses."
  },
  {
    id: 5,
    image: bluenileImg,
    title: "Blue Nile Falls & Lake Tana",
    subtitle: "Tis Abay - Great Smoke of the Nile",
    location: "Bahir Dar, Amhara Region, Ethiopia",
    tagline: "Experience the roaring cascade of the Blue Nile and ancient island monasteries on Lake Tana."
  }
];

function Home() {
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play slide carousel every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Global Keyboard Navigation (Left & Right Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleStartExploring = () => {
    navigate('/destinations');
  };

  const handleBookTourClick = () => {
    navigate('/tours');
  };

  return (
    <div style={{ background: '#0b0f19', color: '#ffffff', minHeight: '100vh' }}>

      {/* HERO CAROUSEL SECTION */}
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          position: 'relative',
          height: '85vh',
          minHeight: '600px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? 'scale(1)' : 'scale(1.04)',
              transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
              zIndex: index === currentSlide ? 1 : 0,
              pointerEvents: index === currentSlide ? 'auto' : 'none'
            }}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* High Contrast Vignette & Dark Overlay Gradient */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(11, 15, 25, 0.45) 0%, rgba(11, 15, 25, 0.85) 75%, #0b0f19 100%)'
            }} />

            {/* Slide Content Overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '0 1.5rem',
              zIndex: 2,
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              <span style={{
                background: 'rgba(85, 107, 47, 0.25)',
                color: '#A8C55A',
                fontSize: '0.85rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                padding: '0.4rem 1.25rem',
                borderRadius: '50px',
                border: '1px solid rgba(168, 197, 90, 0.4)',
                marginBottom: '1.25rem',
                backdropFilter: 'blur(6px)',
                textShadow: '0 2px 4px rgba(0,0,0,0.8)'
              }}>
                📍 {slide.location} • {slide.subtitle}
              </span>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: '1.2',
                marginBottom: '1.25rem',
                textShadow: '0 4px 16px rgba(0,0,0,0.9)',
                letterSpacing: '-0.5px'
              }}>
                {slide.title}
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: '#f1f5f9',
                lineHeight: '1.7',
                marginBottom: '2rem',
                maxWidth: '750px',
                textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                fontWeight: '500'
              }}>
                {slide.tagline}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={handleStartExploring}
                  style={{
                    background: 'linear-gradient(145deg, #556B2F, #6B8E23)',
                    color: '#ffffff',
                    padding: '1rem 2.25rem',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '800',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(85, 107, 47, 0.4)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  Explore Destinations
                </button>
                <button
                  onClick={handleBookTourClick}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    padding: '1rem 2.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    borderRadius: '50px',
                    fontWeight: '700',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  Book Guided Tour
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          style={{
            position: 'absolute',
            left: '1.5rem',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            transition: 'background 0.2s'
          }}
          aria-label="Previous Slide"
        >
          ‹
        </button>

        <button
          onClick={handleNextSlide}
          style={{
            position: 'absolute',
            right: '1.5rem',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            transition: 'background 0.2s'
          }}
          aria-label="Next Slide"
        >
          ›
        </button>

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          zIndex: 10,
          display: 'flex',
          gap: '0.6rem'
        }}>
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                width: idx === currentSlide ? '32px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: idx === currentSlide ? '#A8C55A' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* CONTAINER FOR EXPANDED LANDING CONTENT */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* ABOUT ANDI TOURS SECTION */}
        <section style={{
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          margin: '2rem 0 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              color: '#38bdf8',
              fontSize: '0.85rem',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              Who We Are
            </span>
            <h2 style={{
              fontSize: '2.4rem',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '1.25rem',
              lineHeight: '1.3'
            }}>
              About Andi Tours
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.25rem' }}>
              Welcome to <strong>Andi Tours</strong>! We believe traveling is all about creating real connections and seeing the true beauty of Ethiopia. The company was started by Andi, a friendly local guide with more than 20 years of experience leading trips. Over the years, Andi has traveled across more than 85% of Ethiopia from famous historic spots like Lalibela and the Simien Mountains to beautiful hidden places throughout the country.
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '2rem' }}>
              Having guided guests from all around the world, Andi knows how to make every trip easy, safe, and truly special. Whether you want a relaxing vacation, a cultural tour, or an exciting adventure, we take care of all the details so you can enjoy every moment of your journey.
            </p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ fontSize: '2rem', fontWeight: '800', color: '#A8C55A', margin: 0 }}>20+</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Years Experience</span>
              </div>
              <div>
                <h4 style={{ fontSize: '2rem', fontWeight: '800', color: '#A8C55A', margin: 0 }}>85%+</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Ethiopia Covered</span>
              </div>
              <div>
                <h4 style={{ fontSize: '2rem', fontWeight: '800', color: '#A8C55A', margin: 0 }}>100%</h4>
                <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Tailored Trips</span>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src={lalibelaImg}
              alt="Ethiopian Heritage Lalibela"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            />
          </div>
        </section>

        {/* WHY TRAVEL WITH US */}
        <section style={{ margin: '4rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
              Why Travel With Andi Tours?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
              We deliver premium, safe, and custom-designed Ethiopian adventures with high standards of service.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                icon: "🏛️",
                title: "Deep Cultural Heritage",
                desc: "Privileged access to historic monasteries, ancient castles, and authentic tribal ceremonies led by native guides."
              },
              {
                icon: "⛰️",
                title: "Customized Itineraries",
                desc: "Tailor every detail of your expedition from luxury lodge stays to rugged mountain trekking routes."
              },
              {
                icon: "🛡️",
                title: "Safety & 24/7 Support",
                desc: "Full ground logistics, private 4x4 vehicles, dedicated tour managers, and seamless assistance throughout your stay."
              },
              {
                icon: "🌱",
                title: "Sustainable Tourism",
                desc: "We support local Ethiopian communities, national park conservation, and eco-friendly mountain lodges."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2.25rem',
                  textAlign: 'left',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.75rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE ROUTE MAP COMPONENT */}
        <section style={{ margin: '4rem 0' }}>
          <InteractiveMap />
        </section>

        {/* HOTEL RECOMMENDATIONS COMPONENT */}
        <section style={{ margin: '4rem 0' }}>
          <HotelRecommendations />
        </section>

      </div>
    </div>
  );
}

export default Home;