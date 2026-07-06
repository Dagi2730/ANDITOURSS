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
    <div className="destinations-container gallery-page">
      <section className="destinations-hero-transparent gallery-hero">
        <div className="gallery-hero-content">
          <p className="gallery-eyebrow">Travel Stories</p>
          <h1 className="hero-title-white">Guest Stories & Gallery</h1>
          <p className="hero-subtitle">
            Real moments from Andi Tours journeys across Ethiopia — curated by your team.
          </p>
        </div>
      </section>

      <section className="gallery-content-section">
        {isLoading && posts.length === 0 ? (
          <div className="gallery-loading">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="gallery-empty-state">
            <p>No stories have been published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="destinations-grid gallery-grid">
            {posts.map((post) => (
              <article key={post.id} className="tour-card gallery-card">
                <div className="tour-image gallery-image-wrapper">
                  <img
                    src={resolveImage(post.imageUrl)}
                    alt={post.title}
                    className="gallery-image"
                  />
                  {post.featured && (
                    <span className="tour-price">Featured</span>
                  )}
                </div>
                <div className="tour-info gallery-content">
                  <h2 className="gallery-title">{post.title}</h2>
                  {post.tour && (
                    <p className="gallery-tour">{post.tour.title}</p>
                  )}
                  {post.location && (
                    <p className="location">📍 {post.location}</p>
                  )}
                  {post.subtitle && (
                    <p className="gallery-subtitle">{post.subtitle}</p>
                  )}
                  <p className="gallery-excerpt">
                    {post.story.length > 160
                      ? `${post.story.substring(0, 160)}...`
                      : post.story}
                  </p>
                  <div className="tour-footer gallery-footer">
                    <span className="gallery-date">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="gallery-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="gallery-tag">{tag}</span>
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
    </div>
  );
}

export default Gallery;