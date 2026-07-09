import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedReviews } from '../features/review/reviewSlice';

function StarDisplay({ rating }) {
  return (
    <span className="fr-stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= rating ? 'fr-star-filled' : 'fr-star-empty'}>★</span>
      ))}
    </span>
  );
}

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredReviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getFeaturedReviews());
  }, [dispatch]);

  const handleStartExploring = () => {
    navigate('/destinations');
  };

  const adventures = [
    {
      icon: '🏛️',
      title: 'Historical & Cultural Routes',
      description: 'Walk through the living history of our ancient empires.',
    },
    {
      icon: '⛰️',
      title: 'Trekking & Hiking',
      description: 'Traverse the dramatic escarpments of the Simien and Bale Mountains.',
    },
    {
      icon: '🦅',
      title: 'Bird Watching & Safari',
      description: 'Witness the unique biodiversity of the highlands and the wild savannahs.',
    },
  ];

  return (
    <section className="welcome-section">
      <div className="welcome-container">
        <div className="welcome-intro">
          <h2 className="welcome-title">
            Welcome to <span className="highlight">Dobi Tours</span>
            <br />
            Your Guide to the Roof of Africa
          </h2>
          <p className="welcome-description">
            Discover Ethiopia through the eyes of an expert. With over 20 years
            of experience navigating the hidden paths, ancient history, and
            vibrant cultures of the "Roof of Africa," Andi brings you closer to
            the heart of the landscape than any guidebook ever could.
          </p>
        </div>

        <div className="expertise-block">
          <h3 className="expertise-heading">Expert-Curated Adventures</h3>
          <div className="expertise-grid">
            {adventures.map((item) => (
              <div className="expertise-card" key={item.title}>
                <div className="expertise-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>

          <div className="welcome-cta-wrap">
            <button className="hero-btn" onClick={handleStartExploring}>
              Start Exploring
            </button>
          </div>
        </div>

        {featuredReviews.length > 0 && (
          <div className="fr-block">
            <h3 className="expertise-heading">What Our Guests Say</h3>
            <div className="fr-grid">
              {featuredReviews.map((review) => (
                <div key={review.id} className="fr-card">
                  <StarDisplay rating={review.rating} />
                  <p className="fr-comment">"{review.comment}"</p>
                  <div className="fr-footer">
                    <strong>{review.user?.name}</strong>
                    {review.tour?.title && <span className="fr-tour">{review.tour.title}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .welcome-section {
          background: transparent;
          padding: 140px 5% 110px;
          position: relative;
          min-height: 100vh;
        }

        .welcome-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .welcome-intro {
          text-align: center;
          margin-bottom: 70px;
        }

        .welcome-eyebrow {
          display: inline-block;
          color: #A8C55A;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }

        .welcome-title {
          font-family: 'Raleway', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800;
          color: #ffffff;
          line-height: 1.35;
          margin: 0 0 24px 0;
          text-shadow: 2px 2px 12px rgba(0,0,0,0.6);
        }

        .welcome-title .highlight {
          color: #A8C55A;
        }

        .welcome-description {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.25rem;
          line-height: 1.8;
          max-width: 720px;
          margin: 0 auto;
          text-shadow: 1px 1px 8px rgba(0,0,0,0.5);
        }

        .welcome-cta-wrap {
          text-align: center;
          margin-top: 48px;
        }

        .hero-btn {
          background: linear-gradient(145deg, #556B2F, #6B8E23);
          color: white;
          padding: 18px 50px;
          border: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 1.15rem;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          transition: all 0.4s ease;
          font-family: 'Raleway', sans-serif;
          letter-spacing: 1px;
        }

        .hero-btn:hover {
          background: linear-gradient(145deg, #6B8E23, #556B2F);
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(107, 142, 35, 0.4);
          letter-spacing: 1.5px;
        }

        .hero-btn:active {
          transform: translateY(-2px);
        }

        .expertise-heading {
          text-align: center;
          color: #ffffff;
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 36px;
          position: relative;
          text-shadow: 1px 1px 6px rgba(0,0,0,0.5);
        }

        .expertise-heading::after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #6B8E23;
          margin: 14px auto 0;
          border-radius: 2px;
        }

        .expertise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }

        .expertise-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 34px 28px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .expertise-card:hover {
          background: rgba(255, 255, 255, 0.13);
          border-color: rgba(168, 197, 90, 0.4);
          transform: translateY(-6px);
        }

        .expertise-icon {
          font-size: 2.4rem;
          margin-bottom: 18px;
        }

        .expertise-card h4 {
          color: #ffffff;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
        }

        .expertise-card p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.92rem;
          line-height: 1.6;
          margin: 0;
        }

        .fr-block {
          margin-top: 90px;
        }

        .fr-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 28px;
        }

        .fr-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 28px 26px;
          text-align: left;
          transition: all 0.3s ease;
        }

        .fr-card:hover {
          background: rgba(255, 255, 255, 0.13);
          border-color: rgba(168, 197, 90, 0.4);
          transform: translateY(-6px);
        }

        .fr-stars {
          display: block;
          margin-bottom: 14px;
          font-size: 1.1rem;
        }

        .fr-star-filled { color: #A8C55A; }
        .fr-star-empty { color: rgba(255, 255, 255, 0.25); }

        .fr-comment {
          color: rgba(255, 255, 255, 0.88);
          font-style: italic;
          line-height: 1.7;
          font-size: 0.98rem;
          margin: 0 0 18px 0;
          text-shadow: 1px 1px 6px rgba(0,0,0,0.4);
        }

        .fr-footer {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .fr-footer strong {
          color: #ffffff;
          font-size: 0.95rem;
          text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
        }

        .fr-tour {
          color: #A8C55A;
          font-size: 0.82rem;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .welcome-section {
            padding: 110px 6% 80px;
          }
          .welcome-intro {
            margin-bottom: 50px;
          }
          .fr-block {
            margin-top: 60px;
          }
        }
      `}</style>
    </section>
  );
}

export default Home;