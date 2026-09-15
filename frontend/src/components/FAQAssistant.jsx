import React, { useState } from 'react';
import '../styles/FAQAssistant.css';

const FAQ_ITEMS = [
  {
    question: 'What should I pack for an Ethiopian tour?',
    answer:
      'Pack layers! Ethiopia\'s highlands can be cool (5–15°C mornings), while lowlands like the Danakil reach 50°C+. Essentials: sturdy hiking boots, sunscreen (SPF 50+), a wide-brim hat, insect repellent, a rain jacket (June–September is rainy season), and a headlamp for early treks. For cultural visits, carry modest clothing that covers shoulders and knees.',
  },
  {
    question: 'When is the best time to visit Ethiopia?',
    answer:
      'The dry season (October–March) is ideal for most destinations — clear skies, comfortable temperatures, and perfect trekking conditions. The rainy season (June–September) brings lush green landscapes and fewer crowds, but some roads become challenging. The Danakil Depression is best visited November–February when temperatures are "only" around 35°C. Timkat (January) and Meskel (September) festivals are must-see cultural experiences.',
  },
  {
    question: 'How do I handle altitude sickness in the highlands?',
    answer:
      'The Simien and Bale Mountains reach 4,000m+. Acclimatize gradually — spend a day in Addis Ababa (2,400m) before heading higher. Stay hydrated, avoid alcohol the first day, and consider acetazolamide (Diamox) after consulting your doctor. Our guides are trained to recognize symptoms and adjust pace accordingly. Most travelers adapt within 1–2 days.',
  },
  {
    question: 'What vaccines and health precautions do I need?',
    answer:
      'Yellow Fever vaccination is required if arriving from an endemic country. Recommended vaccines: Hepatitis A & B, Typhoid, Tetanus, and Polio booster. Malaria prophylaxis is advised for lowland areas (Omo Valley, Danakil). Carry a basic first-aid kit, water purification tablets, and any personal medications. Travel insurance with medical evacuation coverage is strongly recommended.',
  },
  {
    question: 'Is it safe to travel in Ethiopia?',
    answer:
      'Ethiopia is generally safe for tourists, especially in established tourism areas (Lalibela, Gondar, Simien Mountains, Addis Ababa). Our tours include experienced local guides, reliable drivers, and vetted accommodations. We monitor travel advisories daily and adjust itineraries proactively. Solo travelers, families, and groups all travel comfortably with our support.',
  },
  {
    question: 'What currency should I bring, and can I use cards?',
    answer:
      'The Ethiopian Birr (ETB) is the local currency. Bring clean, recent USD or EUR bills to exchange at banks in Addis Ababa — older or damaged notes may be refused. ATMs are available in cities but unreliable in rural areas. Credit cards work at major hotels in Addis but rarely elsewhere. We recommend carrying enough cash for your entire trip outside the capital.',
  },
];

const FAQAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    setOpenFAQ(null); // Reset open FAQ on close
  };

  const handleFAQClick = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="faq-assistant-container">
      {isOpen && (
        <div className="faq-popup">
          <div className="faq-popup-header">
            <h3>Ethiopia Travel Guide</h3>
            <button className="faq-close-btn" onClick={toggleAssistant}>
              ✕
            </button>
          </div>
          <div className="faq-popup-body">
            <p className="faq-welcome">Hi! Do you have any questions before your Ethiopian adventure?</p>
            <div className="faq-list">
              {FAQ_ITEMS.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => handleFAQClick(index)}
                    aria-expanded={openFAQ === index}
                  >
                    {faq.question}
                    <span className={`faq-chevron ${openFAQ === index ? 'open' : ''}`}>▼</span>
                  </button>
                  <div className={`faq-answer ${openFAQ === index ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        className={`faq-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleAssistant}
        aria-label="FAQ Assistant"
      >
        <span className="faq-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
      </button>
    </div>
  );
};

export default FAQAssistant;
