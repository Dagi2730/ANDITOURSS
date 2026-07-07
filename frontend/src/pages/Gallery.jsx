import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogPosts } from '../features/blog/blogSlice';

function Gallery() {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getBlogPosts());
  }, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL || '';
  const baseURL = API_URL || 'http://localhost:8000';

  const resolveImage = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/800x500?text=Andi+Tours';
    return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`;
  };

  return (
    <div className="gly-page">
      <section className="gly-hero">
        <div className="gly-hero-inner">
          <span className="gly-hero-eyebrow">Field Notes</span>
          <h1 className="gly-hero-title">Guest Stories &amp; Gallery</h1>
          <p className="gly-hero-subtitle">
            Real moments from Andi Tours journeys across Ethiopia — written and framed by the people who lived them.
          </p>
        </div>
      </section>

      <section className="gly-body">
        {isLoading && posts.length === 0 ? (
          <div className="gly-state">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="gly-state">
            <p>No stories have been published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="gly-grid">
            {posts.map((post) => (
              <article key={post.id} className="gly-card">
                <div className="gly-image-frame">
                  <img
                    src={resolveImage(post.imageUrl)}
                    alt={post.title}
                    className="gly-image"
                  />
                  {post.featured && <span className="gly-stamp">Featured</span>}
                  {post.location && (
                    <span className="gly-location-tag">📍 {post.location}</span>
                  )}
                </div>

                <div className="gly-content">
                  {post.tour && <p className="gly-tour-label">{post.tour.title}</p>}
                  <h2 className="gly-title">{post.title}</h2>
                  {post.subtitle && <p className="gly-subtitle">{post.subtitle}</p>}

                  <div className="gly-divider" />

                  <p className="gly-excerpt">
                    {post.story.length > 160
                      ? `${post.story.substring(0, 160)}...`
                      : post.story}
                  </p>

                  <div className="gly-footer">
                    <span className="gly-date">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="gly-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="gly-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');

        .gly-page {
          --gly-olive: #556B2F;
          --gly-olive-dark: #3E4F22;
          --gly-clay: #B5651D;
          --gly-ink: #2B2A25;
          --gly-ivory: #FAF7F1;
          --gly-sage: #E3E7D3;
          font-family: 'Inter', sans-serif;
          color: var(--gly-ink);
          background: var(--gly-ivory);
          min-height: 100vh;
        }

        .gly-hero {
          background: linear-gradient(160deg, var(--gly-olive-dark) 0%, var(--gly-olive) 100%);
          padding: 72px 24px 64px;
          text-align: center;
        }

        .gly-hero-inner {
          max-width: 680px;
          margin: 0 auto;
        }

        .gly-hero-eyebrow {
          display: inline-block;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #D8E3B8;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .gly-hero-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 16px;
          line-height: 1.15;
        }

        .gly-hero-subtitle {
          font-size: 1.05rem;
          color: #EDF1E0;
          line-height: 1.6;
          margin: 0;
        }

        .gly-body {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        .gly-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b6a63;
          font-size: 1.05rem;
        }

        .gly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 32px;
        }

        .gly-card {
          background: #ffffff;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(43, 42, 37, 0.06);
          border: 1px solid rgba(43, 42, 37, 0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .gly-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(43, 42, 37, 0.12);
        }

        .gly-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--gly-sage);
        }

        .gly-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .gly-card:hover .gly-image {
          transform: scale(1.05);
        }

        .gly-stamp {
          position: absolute;
          top: 14px;
          right: 14px;
          background: var(--gly-clay);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .gly-location-tag {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(20, 20, 15, 0.62);
          backdrop-filter: blur(3px);
          color: #fff;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 999px;
        }

        .gly-content {
          padding: 22px 22px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .gly-tour-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gly-olive);
          margin: 0 0 8px;
        }

        .gly-title {
          font-family: 'Fraunces', serif;
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 1.28;
          margin: 0 0 6px;
          color: var(--gly-ink);
        }

        .gly-subtitle {
          font-style: italic;
          font-size: 0.92rem;
          color: #6b6a63;
          margin: 0;
        }

        .gly-divider {
          width: 40px;
          height: 3px;
          background: var(--gly-olive);
          border-radius: 2px;
          margin: 16px 0;
        }

        .gly-excerpt {
          font-size: 0.94rem;
          line-height: 1.65;
          color: #4a493f;
          margin: 0 0 20px;
          flex: 1;
        }

        .gly-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 16px;
          border-top: 1px solid rgba(43, 42, 37, 0.08);
        }

        .gly-date {
          font-size: 0.78rem;
          color: #8a8878;
          font-weight: 500;
        }

        .gly-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .gly-tag {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--gly-olive-dark);
          background: var(--gly-sage);
          padding: 3px 10px;
          border-radius: 999px;
        }

        @media (max-width: 640px) {
          .gly-hero {
            padding: 56px 20px 48px;
          }
          .gly-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Gallery;