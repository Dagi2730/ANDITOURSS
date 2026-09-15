import React, { useState } from 'react';

// Authentic local image imports
import lalibelaImg from '../assets/images/lalibela.jpg';
import simienImg from '../assets/images/simien.jpg';
import danakilImg from '../assets/images/danakil.jpg';
import gondarImg from '../assets/images/gondar.jpg';
import omoImg from '../assets/images/omo.jpg';
import bahirdarImg from '../assets/images/bahirdar.jpg';
import axumImg from '../assets/images/axum.jpg';
import baleImg from '../assets/images/balemountains.jpg';
import hawassaImg from '../assets/images/hawassa.jpg';
import addisImg from '../assets/images/addisababa.jpg';

const HOTELS_DATA = [
  // LALIBELA
  {
    id: 1,
    name: "Maribela Hotel",
    region: "Lalibela",
    rating: 4.9,
    priceRange: "$$$",
    type: "Boutique Hotel",
    image: lalibelaImg,
    description: "Perched high on the Lalibela mountain ridge with breathtaking balcony views of the valleys. Known for warm Ethiopian hospitality and proximity to rock-hewn churches.",
    amenities: ["Panoramic Mountain View", "Free Wi-Fi", "Airport Shuttle", "On-site Restaurant", "Traditional Coffee Ceremony"],
    bestFor: "Culture & Rock Churches"
  },
  {
    id: 2,
    name: "Mezena Lodge",
    region: "Lalibela",
    rating: 4.85,
    priceRange: "$$$",
    type: "Boutique Lodge",
    image: lalibelaImg,
    description: "Spacious stone bungalows surrounded by indigenous flora, offering a serene swimming pool, spa, and shuttle service to Bete Giyorgis.",
    amenities: ["Outdoor Swimming Pool", "Spa & Wellness", "Stone Bungalows", "Restaurant & Bar", "Airport Transfer"],
    bestFor: "Relaxation & Heritage Stays"
  },
  {
    id: 3,
    name: "Roha Hotel Lalibela",
    region: "Lalibela",
    rating: 4.7,
    priceRange: "$$",
    type: "Classic Hotel",
    image: lalibelaImg,
    description: "One of Lalibela’s legendary classic hotels, situated amidst lush gardens just minutes from the Northern Group of churches.",
    amenities: ["Garden Terrace", "Authentic Ethiopian Dishes", "Free Wi-Fi", "Tour Assistance"],
    bestFor: "Pilgrimage & Heritage Tours"
  },
  {
    id: 4,
    name: "Ben Abeba Eco Stays",
    region: "Lalibela",
    rating: 4.8,
    priceRange: "$$",
    type: "Eco Lodge",
    image: lalibelaImg,
    description: "Iconic futuristic architecture perched over the Lasta mountains, famous for sunset dinners and eco-hiking access.",
    amenities: ["360° Sunset Deck", "Organic Farm-to-Table", "Guided Hikes", "Eco-friendly Design"],
    bestFor: "Sunsets & Dining"
  },

  // SIMIEN MOUNTAINS
  {
    id: 5,
    name: "Limalimo Lodge",
    region: "Simien Mountains",
    rating: 4.95,
    priceRange: "$$$$",
    type: "Luxury Eco-Lodge",
    image: simienImg,
    description: "A luxury eco-lodge situated on the edge of the Simien Mountains National Park. Sustainable architecture built with rammed earth and thatch.",
    amenities: ["Eco-Lodge Concept", "Guided Trekking", "Gourmet Dining", "Fireplace Lounges", "Birdwatching Decks"],
    bestFor: "Trekking & Endemic Wildlife"
  },
  {
    id: 6,
    name: "Simien Lodge",
    region: "Simien Mountains",
    rating: 4.8,
    priceRange: "$$$",
    type: "High-Altitude Lodge",
    image: simienImg,
    description: "The highest hotel in Africa at 3,260m altitude, featuring cozy heated tukul rooms right at Buyit Ras inside the national park.",
    amenities: ["Solar-Heated Rooms", "Gelada Baboon Viewing", "Trekking Base Camp", "Full Bar & Pub"],
    bestFor: "Highland Adventures"
  },
  {
    id: 7,
    name: "Walya Lodge Debark",
    region: "Simien Mountains",
    rating: 4.6,
    priceRange: "$$",
    type: "Mountain Lodge",
    image: simienImg,
    description: "Conveniently located at the park headquarters town of Debark, providing budget-friendly rooms and trekking guide arrangements.",
    amenities: ["Park HQ Proximity", "Free Wi-Fi", "Gear Rental Desk", "Hearty Breakfast"],
    bestFor: "Trek Planning & Budget Stays"
  },

  // BAHIR DAR & LAKE TANA
  {
    id: 8,
    name: "Kuriftu Resort & Spa Bahir Dar",
    region: "Bahir Dar & Lake Tana",
    rating: 4.88,
    priceRange: "$$$$",
    type: "Luxury Resort & Spa",
    image: bahirdarImg,
    description: "Nestled on the banks of Lake Tana, offering serene bungalow accommodation, organic spa treatments, and private boat excursions to island monasteries.",
    amenities: ["Lakefront Views", "Full Spa & Wellness", "Swimming Pool", "Private Boat Trips", "Sunset Terrace"],
    bestFor: "Lake Excursions & Spa"
  },
  {
    id: 9,
    name: "Haile Resort Bahir Dar",
    region: "Bahir Dar & Lake Tana",
    rating: 4.8,
    priceRange: "$$$",
    type: "Lakeside Resort",
    image: bahirdarImg,
    description: "Modern lakefront resort featuring spacious rooms, outdoor pool, athletics club, and fine dining on the shores of Lake Tana.",
    amenities: ["Lakefront Pool", "Fitness & Athletics", "Boat Docking", "Multiple Restaurants", "Children's Playground"],
    bestFor: "Lakeside Relaxation & Families"
  },
  {
    id: 10,
    name: "Blue Nile Resort",
    region: "Bahir Dar & Lake Tana",
    rating: 4.7,
    priceRange: "$$$",
    type: "Waterfront Hotel",
    image: bahirdarImg,
    description: "Located near the outlet of the Blue Nile River, featuring sprawling palm gardens, lake-view suites, and boat tour access.",
    amenities: ["Nile River Views", "Lush Palm Gardens", "Conference Center", "Free Airport Transfer"],
    bestFor: "River & Island Expeditions"
  },

  // GONDAR
  {
    id: 11,
    name: "Goha Hotel Gondar",
    region: "Gondar",
    rating: 4.75,
    priceRange: "$$$",
    type: "Hilltop Resort",
    image: gondarImg,
    description: "Situated high on a hill overlooking the royal castles of Fasil Ghebbi and the entire city of Gondar.",
    amenities: ["Panoramic Castle View", "Swimming Pool", "Cultural Dance Shows", "Free Wi-Fi"],
    bestFor: "Castle Views & History"
  },
  {
    id: 12,
    name: "Haile Resort Gondar",
    region: "Gondar",
    rating: 4.82,
    priceRange: "$$$",
    type: "Luxury City Resort",
    image: gondarImg,
    description: "Premium lodging featuring contemporary design, outdoor pool, wellness spa, and fine Ethiopian gastronomy.",
    amenities: ["Outdoor Pool", "Spa & Health Club", "Conference Facilities", "Gourmet Restaurant"],
    bestFor: "Modern Comfort & Business"
  },

  // AXUM
  {
    id: 13,
    name: "Yeha Hotel Axum",
    region: "Axum",
    rating: 4.7,
    priceRange: "$$",
    type: "Heritage Hotel",
    image: axumImg,
    description: "Overlooking the Northern Stelae Field and the Church of Our Lady Mary of Zion, offering historic atmosphere and quiet gardens.",
    amenities: ["Stelae Field Views", "Garden Restaurant", "Cultural Excursions", "Airport Shuttle"],
    bestFor: "Archaeology & Ancient Ruins"
  },
  {
    id: 14,
    name: "Sabian International Hotel",
    region: "Axum",
    rating: 4.65,
    priceRange: "$$",
    type: "City Hotel",
    image: axumImg,
    description: "Modern comfort in the heart of Axum city center, close to Dungur Palace (Queen of Sheba's Palace) and central markets.",
    amenities: ["Central Location", "Free Wi-Fi", "On-site Restaurant", "24h Concierge"],
    bestFor: "City Explorations"
  },

  // ADDIS ABABA
  {
    id: 15,
    name: "Sheraton Addis (Luxury Collection)",
    region: "Addis Ababa",
    rating: 4.95,
    priceRange: "$$$$$",
    type: "5-Star Luxury Palace",
    image: addisImg,
    description: "Ethiopia’s premier landmark luxury hotel set amidst lush gardens, featuring heated pools with underwater music and fine international dining.",
    amenities: ["Heated Swimming Pools", "World-Class Spa", "Multiple Gourmet Restaurants", "High-Security Compound"],
    bestFor: "VIP Stays & Luxury"
  },
  {
    id: 16,
    name: "Ethiopian Skylight Hotel",
    region: "Addis Ababa",
    rating: 4.9,
    priceRange: "$$$$",
    type: "Airport Luxury Hotel",
    image: addisImg,
    description: "Africa’s largest airport hotel located 5 minutes from Bole International Airport, boasting over 1,000 luxurious rooms and convention space.",
    amenities: ["Free 24h Airport Shuttle", "Outdoor Heated Pool", "Thai & Ethiopian Restaurants", "Executive Lounge"],
    bestFor: "Transit & Luxury Travelers"
  },
  {
    id: 17,
    name: "Radisson Blu Hotel Addis Ababa",
    region: "Addis Ababa",
    rating: 4.8,
    priceRange: "$$$$",
    type: "Business & Leisure Hotel",
    image: addisImg,
    description: "Located in the heart of the Kazanchis diplomatic district near the UN Economic Commission for Africa.",
    amenities: ["Rainforest Showers", "Rainforest Spa", "Verres en Vers Bistro", "Fitness Center"],
    bestFor: "Diplomatic & Business Trips"
  },

  // HAWASSA & RIFT VALLEY
  {
    id: 18,
    name: "Haile Resort Hawassa",
    region: "Hawassa & Rift Valley",
    rating: 4.75,
    priceRange: "$$$",
    type: "Lakeside Resort",
    image: hawassaImg,
    description: "Founded by legendary athlete Haile Gebrselassie. Located directly on the shore of Lake Hawassa with expansive gardens and athletics facilities.",
    amenities: ["Lake Shorefront", "Outdoor Pool", "Fitness & Athletics Center", "Multi-Cuisine Restaurants", "Kids Play Area"],
    bestFor: "Lakeside Leisure & Families"
  },
  {
    id: 19,
    name: "Sabana Beach Resort (Lake Langano)",
    region: "Hawassa & Rift Valley",
    rating: 4.8,
    priceRange: "$$$",
    type: "Rift Valley Beach Resort",
    image: hawassaImg,
    description: "Perched on a cliff overlooking the golden sandy beaches of Lake Langano, ideal for swimming, kayaking, and sunset relaxation.",
    amenities: ["Private Beach Access", "Cliffside Bungalows", "Water Sports", "Lakeside Bar"],
    bestFor: "Beach & Water Activities"
  },

  // BALE MOUNTAINS
  {
    id: 20,
    name: "Bale Mountain Lodge (Rira)",
    region: "Bale Mountains",
    rating: 4.92,
    priceRange: "$$$$",
    type: "Wilderness Eco-Lodge",
    image: baleImg,
    description: "Boutique eco-lodge nestled deep inside Harenna Cloud Forest in Bale Mountains National Park, home to rare wolves and endemic bird species.",
    amenities: ["Harenna Forest Views", "Private Fireplaces", "Guided Wolf Safaris", "Gourmet Eco-Dining"],
    bestFor: "Wildlife Safaris & Cloud Forests"
  },
  {
    id: 21,
    name: "Wabe Shebelle Hotel Robe",
    region: "Bale Mountains",
    rating: 4.5,
    priceRange: "$$",
    type: "Highland Hotel",
    image: baleImg,
    description: "Established hotel in Robe town, serving as a solid, comfortable base for day trips to Sanetti Plateau and Sof Omar Caves.",
    amenities: ["Town Center Base", "On-site Restaurant", "Parking", "Excursion Desk"],
    bestFor: "Sanetti Trekking Base"
  },

  // OMO VALLEY & ARBA MINCH
  {
    id: 22,
    name: "Buska Lodge Turmi",
    region: "Omo Valley & Arba Minch",
    rating: 4.85,
    priceRange: "$$$",
    type: "Safari Eco-Lodge",
    image: omoImg,
    description: "Surrounded by nature on the banks of the Weyto River in Turmi, providing traditional bungalow lodging near Hamer tribal villages.",
    amenities: ["Tribal Village Tours", "Open-Air Restaurant", "Traditional Huts", "Cultural Shows"],
    bestFor: "Hamer & Cultural Expeditions"
  },
  {
    id: 23,
    name: "Paradise Lodge Arba Minch",
    region: "Omo Valley & Arba Minch",
    rating: 4.78,
    priceRange: "$$$",
    type: "Panoramic Twin-Lake Lodge",
    image: omoImg,
    description: "Crafted in authentic Southern Ethiopian tribal style with thatched roofs, overlooking Lake Chamo, Lake Abaya, and Nechisar National Park.",
    amenities: ["Twin Lake Panorama", "Cultural Craft Shop", "Swimming Pool", "Organized Boat Safaris"],
    bestFor: "Twin Lake Views & Safaris"
  },

  // DANAKIL & MEKELE
  {
    id: 24,
    name: "Kuriftu Resort Semera",
    region: "Danakil & Mekele",
    rating: 4.8,
    priceRange: "$$$$",
    type: "Desert Oasis Resort",
    image: danakilImg,
    description: "Luxury oasis resort in Afar, featuring air-conditioned suites, refreshing pools, and high-end dining before heading into the Danakil desert.",
    amenities: ["Desert Oasis Pool", "Air-Conditioned Suites", "Spa & Wellness", "Expedition Logistics"],
    bestFor: "Danakil Desert Comfort"
  },
  {
    id: 25,
    name: "Planet Hotel Mekele",
    region: "Danakil & Mekele",
    rating: 4.7,
    priceRange: "$$$",
    type: "City Expedition Hotel",
    image: danakilImg,
    description: "Top-tier hotel in Mekele city center equipped with indoor pool, health club, and expedition prep services for Dallol and Erta Ale tours.",
    amenities: ["Indoor Pool & Sauna", "Expedition Prep", "Gourmet Restaurant", "Free Airport Transfer"],
    bestFor: "Danakil Expedition Base"
  }
];

export default function HotelRecommendations() {
  const [selectedRegion, setSelectedRegion] = useState('All');

  const regions = [
    'All',
    'Lalibela',
    'Simien Mountains',
    'Bahir Dar & Lake Tana',
    'Gondar',
    'Axum',
    'Addis Ababa',
    'Hawassa & Rift Valley',
    'Bale Mountains',
    'Omo Valley & Arba Minch',
    'Danakil & Mekele'
  ];

  const filteredHotels = selectedRegion === 'All'
    ? HOTELS_DATA
    : HOTELS_DATA.filter(h => h.region === selectedRegion);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      padding: '4rem 1.5rem',
      borderRadius: '24px',
      margin: '3rem 0',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3rem' }}>
        <span style={{
          background: 'rgba(85, 107, 47, 0.25)',
          color: '#A8C55A',
          fontSize: '0.85rem',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          padding: '0.5rem 1.25rem',
          borderRadius: '50px',
          display: 'inline-block',
          marginBottom: '1rem',
          border: '1px solid rgba(168, 197, 90, 0.4)'
        }}>
          Handpicked Regional Lodges & Hotels
        </span>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.7rem)',
          fontWeight: '800',
          color: '#ffffff',
          marginBottom: '1rem',
          letterSpacing: '-0.5px'
        }}>
          Recommended Ethiopian Hotels, Lodges & Resorts
        </h2>
        <p style={{
          color: '#cbd5e1',
          fontSize: '1.05rem',
          lineHeight: '1.7'
        }}>
          Explore top-rated eco-lodges, boutique hotels, desert camps, and luxury lakeside resorts across all major Ethiopian cities and circuit destinations.
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
                padding: '0.55rem 1.15rem',
                borderRadius: '50px',
                border: selectedRegion === r ? '2px solid #A8C55A' : '1px solid rgba(255,255,255,0.15)',
                background: selectedRegion === r ? 'linear-gradient(145deg, #556B2F, #6B8E23)' : 'rgba(255,255,255,0.06)',
                color: '#ffffff',
                fontWeight: selectedRegion === r ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                fontSize: '0.88rem',
                boxShadow: selectedRegion === r ? '0 4px 12px rgba(85, 107, 47, 0.4)' : 'none'
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
              background: '#0f172a',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
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
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(8px)',
                padding: '0.35rem 0.85rem',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#A8C55A',
                border: '1px solid rgba(168, 197, 90, 0.4)'
              }}>
                📍 {hotel.region}
              </div>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#556B2F',
                color: '#ffffff',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
              }}>
                ⭐ {hotel.rating}
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  {hotel.name}
                </h3>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#A8C55A' }}>
                  {hotel.priceRange}
                </span>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  color: '#cbd5e1',
                  background: 'rgba(255,255,255,0.08)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  {hotel.type}
                </span>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem', flex: 1 }}>
                {hotel.description}
              </p>

              {/* Tag for best for */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}>
                  Best For: {hotel.bestFor}
                </span>
              </div>

              {/* Amenities */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {hotel.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      background: 'rgba(255,255,255,0.06)',
                      color: '#e2e8f0',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
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
