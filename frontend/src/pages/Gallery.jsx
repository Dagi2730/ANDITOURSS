import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api, { getImageUrl } from '../lib/api';
import { getBlogPosts } from '../features/blog/blogSlice';

// Authentic local image import for fallback guest stories
import lalibelaImg from '../assets/images/lalibela.jpg';

const compressImage = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const maxWidth = 1400;
        const maxHeight = 1400;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

function Gallery() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, isLoading } = useSelector((state) => state.blog);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    location: '',
    story: '',
    tags: '',
  });

  useEffect(() => {
    dispatch(getBlogPosts());
  }, [dispatch]);

  const approvedPosts = useMemo(() => {
    return (posts || []).filter((post) => post.status !== 'PENDING');
  }, [posts]);

  const displayPosts = approvedPosts;

  const resolveImage = (imageUrl) => {
    if (!imageUrl) return lalibelaImg;
    if (typeof imageUrl === 'string' && (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:') || imageUrl.startsWith('/src/assets/'))) {
      return imageUrl;
    }
    return getImageUrl(imageUrl);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setImageFile(compressed);
    setPreviewUrl(URL.createObjectURL(compressed));
  };

  const handleGuestSubmission = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.story) {
      setSubmitMessage('Please add a title and a short story.');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('subtitle', formData.subtitle);
      payload.append('location', formData.location);
      payload.append('story', formData.story);
      payload.append('tags', formData.tags);
      if (imageFile) payload.append('image', imageFile);

      await api.post('/blog/submit', payload);

      setSubmitMessage('Thank you! Your photo story has been submitted and will be reviewed by the admin.');
      setFormData({ title: '', subtitle: '', location: '', story: '', tags: '' });
      setImageFile(null);
      setPreviewUrl('');
      dispatch(getBlogPosts());
    } catch (error) {
      console.error('Guest submission error:', error);
      setSubmitMessage(error.response?.data?.message || 'Unable to submit your story right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gly-page">
      <section className="gly-hero">
        <div className="gly-hero-inner">
          <h1 className="gly-hero-title">Guest Stories &amp; Gallery</h1>
          <p className="gly-hero-subtitle">
            Real moments from Andi Tours journeys across Ethiopia — written and framed by the people who lived them.
          </p>
        </div>
      </section>

      <section className="gly-body">
        {isLoading && approvedPosts.length === 0 ? (
          <div className="gly-state">Loading stories...</div>
        ) : (
          <div className="gly-grid">
            {displayPosts.map((post) => (
              <article key={post.id} className="gly-card">
                <div className="gly-image-frame">
                  <img
                    src={resolveImage(post.imageUrl)}
                    alt={post.title}
                    className="gly-image"
                  />
                  {post.featured && <span className="gly-stamp">Featured</span>}
                  {post.submittedByGuest && <span className="gly-stamp gly-guest-stamp">Guest</span>}
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
                        {Array.isArray(post.tags) ? post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="gly-tag">{tag}</span>
                        )) : null}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="gly-submission-card">
          <div className="gly-submission-copy">
            <span className="gly-submission-eyebrow">Share Your Moment</span>
            <h2>Have a photo from your trip? Add it to the public gallery.</h2>
            <p>Your submission will appear after an admin approves it.</p>
          </div>
          <form className="glass-form" onSubmit={handleGuestSubmission} style={{ padding: '30px', margin: 0 }}>
            <div className="input-group">
              <label style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                Story Title <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Story title" required />
            </div>
            <div className="input-group">
              <label style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                Location
              </label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Location (e.g. Lalibela)" />
            </div>
            <div className="input-group">
              <label style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                Story / Experience <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
              </label>
              <textarea name="story" value={formData.story} onChange={handleInputChange} placeholder="Tell us about the moment" rows="3" maxLength={3000} required />
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1', display: 'block', textAlign: 'right' }}>
                {formData.story.length} / 3000 characters
              </span>
            </div>
            <div className="input-group">
              <label style={{ color: '#ffffff', fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>
                Tags
              </label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="Tags (e.g. culture, trekking)" />
            </div>
            {previewUrl && <img src={previewUrl} alt="Preview" className="gly-upload-preview" />}
            <div className="input-group">
              <label className="gly-upload-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.4)', borderRadius: '12px', cursor: 'pointer', marginBottom: '20px' }}>
                <span>{imageFile ? imageFile.name : 'Choose an image'}</span>
                <input type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
              </label>
            </div>
            <button type="submit" className="send-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
            {submitMessage && <p className="gly-submit-message" style={{ marginTop: '15px' }}>{submitMessage}</p>}
          </form>
        </div>
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
          font-family: 'Raleway', sans-serif;
          color: var(--gly-ink);
          min-height: 100vh;
        }

        .gly-hero {
          padding: 140px 20px 40px !important;
          text-align: center;
        }

        .gly-hero-inner {
          max-width: 720px;
          margin: 0 auto;
        }

        .gly-hero-eyebrow {
          display: inline-block;
          font-size: 0.78rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: white;
          margin-bottom: 14px;
          font-weight: 700;
          text-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }

        .gly-hero-title {
          font-family: 'Raleway', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 800;
          color: white;
          margin: 0 0 16px;
          line-height: 1.15;
          text-shadow: 0 4px 10px rgba(0,0,0,0.28);
        }

        .gly-hero-subtitle {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.92);
          line-height: 1.6;
          margin: 0;
        }

        .gly-body {
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }

        .gly-submission-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 40px;
          color: white;
        }

        .gly-submission-copy h2 {
          margin: 0 0 10px;
          font-size: 1.3rem;
          color: white;
        }

        .gly-submission-copy p {
          margin: 0;
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
        }

        .gly-submission-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #A8C55A;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .gly-submission-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .gly-submission-form input,
        .gly-submission-form textarea {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          padding: 10px 12px;
          font: inherit;
          font-weight: 700;
          box-sizing: border-box;
          background: rgba(255,255,255,0.22);
          color: #ffffff;
          caret-color: #ffffff;
          -webkit-text-fill-color: #ffffff;
        }

        .gly-submission-form input::placeholder,
        .gly-submission-form textarea::placeholder {
          color: rgba(255,255,255,0.8);
        }

        .gly-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 1px dashed rgba(255,255,255,0.4);
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.95);
          cursor: pointer;
          font-size: 0.92rem;
        }

        .gly-upload-label input {
          display: none;
        }

        .gly-upload-preview {
          width: 100%;
          max-height: 180px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.25);
        }

        .gly-submit-btn {
          border: none;
          border-radius: 50px;
          background: linear-gradient(145deg, #556B2F, #6B8E23);
          color: #ffffff;
          padding: 10px 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .gly-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .gly-submit-message {
          margin: 0;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.95);
        }

        .gly-state {
          text-align: center;
          padding: 60px 20px;
          color: #ffffff !important;
          font-size: 1.15rem;
          font-weight: 600;
          text-shadow: 0 2px 6px rgba(0,0,0,0.6);
        }

        .gly-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 32px;
        }

        .gly-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .gly-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.4);
        }

        .gly-image-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
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
          background: #556B2F;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .gly-guest-stamp {
          top: 48px;
          background: #6B8E23;
        }

        .gly-location-tag {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
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
          color: #A8C55A;
          margin: 0 0 8px;
        }

        .gly-title {
          font-family: 'Raleway', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.28;
          margin: 0 0 6px;
          color: #ffffff;
        }

        .gly-subtitle {
          font-style: italic;
          font-size: 0.92rem;
          color: #cbd5e1;
          margin: 0;
        }

        .gly-divider {
          width: 40px;
          height: 3px;
          background: #A8C55A;
          border-radius: 2px;
          margin: 16px 0;
        }

        .gly-excerpt {
          font-size: 0.94rem;
          line-height: 1.65;
          color: #e2e8f0;
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
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gly-date {
          font-size: 0.78rem;
          color: #94a3b8;
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
          color: #A8C55A;
          background: rgba(85, 107, 47, 0.25);
          border: 1px solid rgba(168, 197, 90, 0.4);
          padding: 3px 10px;
          border-radius: 999px;
        }

        @media (max-width: 840px) {
          .gly-submission-card {
            grid-template-columns: 1fr;
          }
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