import React, { useState } from 'react';

const HOTELS_DATA = [
  {
    id: 1,
    name: "Maribela Hotel",
    region: "Lalibela",
    rating: 4.9,
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    description: "Perched high on the Lalibela mountain ridge with breathtaking balcony views of the valleys. Known for warm Ethiopian hospitality and proximity to rock-hewn churches.",
    amenities: ["Panoramic Mountain View", "Free Wi-Fi", "Airport Shuttle", "On-site Restaurant", "Traditional Coffee Ceremony"],
    bestFor: "Culture & Sightseeing"
  },
  {
    id: 2,
    name: "Limalimo Lodge",
    region: "Simien Mountains",
    rating: 4.95,
    priceRange: "$$$$",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "A luxury eco-lodge situated on the edge of the Simien Mountains National Park. Sustainable architecture built with rammed earth and thatch.",
    amenities: ["Eco-Lodge Concept", "Guided Trekking", "Gourmet Dining", "Fireplace Lounges", "Birdwatching Decks"],
    bestFor: "Nature & Trekking"
  },
  {
    id: 3,
    name: "Kuriftu Resort & Spa",
    region: "Bahir Dar",
    rating: 4.8,
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    description: "Nestled on the banks of Lake Tana, offering serene bungalow accommodation, organic spa treatments, and private boat excursions to island monasteries.",
    amenities: ["Lakefront Views", "Full Spa & Wellness", "Swimming Pool", "Private Boat Trips", "Sunset Terrace"],
    bestFor: "Relaxation & Lake Exploration"
  },
  {
    id: 4,
    name: "Haile Resort Hawassa",
    region: "Hawassa",
    rating: 4.75,
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    description: "Founded by legendary athlete Haile Gebrselassie. Located directly on the shore of Lake Hawassa with expansive gardens and athletics facilities.",
    amenities: ["Lake Shorefront", "Outdoor Pool", "Fitness & Athletics Center", "Multi-Cuisine Restaurants", "Kids Play Area"],
    bestFor: "Lakeside Leisure & Families"
  },
  {
    id: 5,
    name: "Paradise Lodge Arba Minch",
    region: "Arba Minch / Omo Valley",
    rating: 4.7,
    priceRange: "$$$",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
    description: "Crafted in authentic Southern Ethiopian tribal style with thatched roofs, overlooking Lake Chamo, Lake Abaya, and the Nechisar National Park.",
    amenities: ["Twin Lake Panorama", "Cultural Craft Shop", "Swimming Pool", "Organized Safaris", "Bar & Terrace"],
    bestFor: "Omo Valley Expeditions"
  },
  {
    id: 6,
    name: "Agoro Lodge",
    region: "Mekele / Danakil Gateway",
    rating: 4.65,
    priceRange: "$$",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    description: "Comfortable stone lodge in Adigrat/Mekele area, serving as the perfect comfortable retreat after exploring Tigray rock churches or Danakil expeditions.",
    amenities: ["Traditional Stone Architecture", "Authentic Cuisine", "Tour Preparation Hub", "Quiet Courtyards"],
    bestFor: "Adventure Travel Base"
  }
];

export default function HotelRecommendations() {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = ['All', 'Lalibela', 'Simien Mountains', 'Bahir Dar', 'Hawassa', 'Arba Minch / Omo Valley', 'Mekele / Danakil Gateway'];

  const filteredHotels = selectedRegion === 'All'
    ? HOTELS_DATA
    : HOTELS_DATA.filter(h => h.region === selectedRegion);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #111827 0%, #1a202c 100%)',
      color: '#ffffff',
      padding: '4rem 1.5rem',
      borderRadius: '24px',
      margin: '3rem 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
        <span style={{
          background: 'rgba(234, 179, 8, 0.15)',
          color: '#facc15',
          fontSize: '0.875rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          padding: '0.5rem 1.25rem',
          borderRadius: '50px',
          display: 'inline-block',
          marginBottom: '1rem',
          border: '1px solid rgba(234, 179, 8, 0.3)'
        }}>
          Handpicked Accommodations
        </span>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '1rem',
          letterSpacing: '-0.5px'
        }}>
          Recommended Ethiopian Lodges & Hotels
        </h2>
        <p style={{
          color: '#cbd5e1',
          fontSize: '1.1rem',
          lineHeight: '1.7'
        }}>
          We partner with top-rated eco-lodges, boutique hotels, and luxury resorts across Ethiopia to ensure comfort, authentic hospitality, and spectacular views throughout your trip.
        </p>

        {/* Region Filter Buttons */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setSelectedRegion(r)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: selectedRegion === r ? '2px solid #facc15' : '1px solid rgba(255,255,255,0.15)',
                background: selectedRegion === r ? '#facc15' : 'rgba(255,255,255,0.05)',
                color: selectedRegion === r ? '#0f172a' : '#f8fafc',
                fontWeight: selectedRegion === r ? '700' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                fontSize: '0.9rem'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {filteredHotels.map(hotel => (
          <div
            key={hotel.id}
            style={{
              background: '#1e293b',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            {/* Image & Badges */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img
                src={hotel.image}
                alt={hotel.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.85rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#facc15',
                border: '1px solid rgba(250, 204, 21, 0.3)'
              }}>
                📍 {hotel.region}
              </div>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#059669',
                color: '#ffffff',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⭐ {hotel.rating}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  {hotel.name}
                </h3>
                <span style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>
                  {hotel.priceRange}
                </span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem', flex: 1 }}>
                {hotel.description}
              </p>

              {/* Tag for best for */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  Best For: {hotel.bestFor}
                </span>
              </div>

              {/* Amenities */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {hotel.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#cbd5e1',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px'
                    }}
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
