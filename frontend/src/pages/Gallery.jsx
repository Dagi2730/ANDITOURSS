import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogPosts } from '../features/blog/blogSlice';
import '../styles/Destinations.css';

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
    <div className="destinations-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Guest Stories & Gallery</h1>
            <p className="hero-subtitle">
              Real moments from Andi Tours journeys across Ethiopia – curated by your team.
            </p>
          </div>
        </div>
      </section>

      <section className="destinations-list" style={{ paddingTop: '40px' }}>
        {isLoading && posts.length === 0 ? (
          <div className="loading-message">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="no-destinations">
            <p>No stories have been published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="destinations-grid">
            {posts.map((post) => (
              <article key={post._id} className="destination-card">
                <div className="destination-image-wrapper">
                  <img
                    src={resolveImage(post.imageUrl)}
                    alt={post.title}
                    className="destination-image"
                  />
                  {post.featured && (
                    <span className="destination-badge">Featured</span>
                  )}
                </div>
                <div className="destination-content">
                  <h2 className="destination-title">{post.title}</h2>
                  {post.tour && (
                    <p className="destination-meta" style={{ fontWeight: 600 }}>
                      Tour: {post.tour.name}
                    </p>
                  )}
                  {post.location && (
                    <p className="destination-location">📍 {post.location}</p>
                  )}
                  {post.subtitle && (
                    <p className="destination-meta">{post.subtitle}</p>
                  )}
                  <p className="destination-description">
                    {post.story.length > 160
                      ? `${post.story.substring(0, 160)}...`
                      : post.story}
                  </p>
                  <div className="destination-footer">
                    <span className="destination-duration">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="destination-price">
                        {post.tags.slice(0, 2).join(' • ')}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Gallery;