import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../../features/blog/blogSlice';
import { getTours } from '../../features/tour/tourSlice';

function AdminBlog() {
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);
  const { tours } = useSelector((state) => state.tour);

  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [formData, setFormData] = useState({
    tourId: '',
    title: '',
    subtitle: '',
    location: '',
    story: '',
    tags: '',
    featured: false,
  });

  useEffect(() => {
    dispatch(getBlogPosts());
    dispatch(getTours());
  }, [dispatch]);

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      tourId: '',
      title: '',
      subtitle: '',
      location: '',
      story: '',
      tags: '',
      featured: false,
    });
    setMainImage(null);
    setMainImageFile(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      tourId: post.tour?.id || '',
      title: post.title || '',
      subtitle: post.subtitle || '',
      location: post.location || '',
      story: post.story || '',
      tags: (post.tags || []).join(', '),
      featured: !!post.featured,
    });
    setMainImage(post.imageUrl || null);
    setMainImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await dispatch(deleteBlogPost(id)).unwrap();
        alert('Story deleted successfully');
      } catch (err) {
        alert(err || 'Failed to delete story');
      }
    }
  };

  const handleApprove = async (post) => {
    try {
      const payload = new FormData();
      payload.append('status', 'APPROVED');
      await dispatch(updateBlogPost({ id: post.id, formData: payload })).unwrap();
      alert('Story approved successfully');
    } catch (err) {
      alert(err || 'Failed to approve story');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      setMainImageFile(file);
      setMainImage(URL.createObjectURL(file));
    }
  };

  const removeMainImage = () => {
    setMainImage(null);
    setMainImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tourId) {
      alert('Please select which tour this gallery image belongs to');
      return;
    }

    if (!formData.title || !formData.story) {
      alert('Please provide at least a title and story');
      return;
    }

    if (!editingPost && !mainImageFile) {
      alert('Please upload a main image for this story');
      return;
    }

    const payload = new FormData();
    payload.append('tourId', formData.tourId);
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('location', formData.location);
    payload.append('story', formData.story);
    payload.append('tags', formData.tags);
    payload.append('featured', formData.featured ? 'true' : 'false');

    if (mainImageFile) {
      payload.append('image', mainImageFile);
    }

    try {
      if (editingPost) {
        await dispatch(
          updateBlogPost({ id: editingPost.id, formData: payload })
        ).unwrap();
        alert('Story updated successfully!');
      } else {
        await dispatch(createBlogPost(payload)).unwrap();
        alert('New story created successfully!');
      }

      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error('Error saving story:', err);
      alert(err?.message || err || 'Failed to save story');
    }
  };

  const isUserAdmin = () => {
    return user?.role?.toString().toUpperCase() === 'ADMIN';
  };

  const API_URL = import.meta.env.VITE_API_URL || '';
  const baseURL = API_URL || 'http://localhost:8000';

  const resolveImage = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x300?text=Andi+Tours';
    return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`;
  };

  if (!isUserAdmin()) {
    return (
      <div className="ablg-page">
        <div className="ablg-locked">
          <h2>🔒 Admin Blog Access Required</h2>
          <p>You must be logged in as an administrator to manage stories.</p>
          <button className="ablg-btn ablg-btn-outline" onClick={() => window.location.href = '/login'}>
            Go to Login Page
          </button>
        </div>
        <style>{`
          .ablg-page { font-family: 'Inter', sans-serif; }
          .ablg-locked { padding: 60px 24px; text-align: center; }
          .ablg-locked h2 { margin-bottom: 12px; }
          .ablg-locked p { color: #666; margin-bottom: 24px; }
          .ablg-btn-outline {
            background: transparent; color: #556B2F; border: 2px solid #556B2F;
            padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="ablg-page">
      <div className="ablg-header">
        <div>
          <h2 className="ablg-heading">Stories &amp; Gallery</h2>
          <p className="ablg-subheading">
            Curate the stories and gallery images shown on the public Gallery page.
          </p>
        </div>
        <button className="ablg-btn ablg-btn-primary" onClick={handleAddNew}>
          + New Story
        </button>
      </div>

      {showForm && (
        <div className="ablg-modal-overlay" onClick={() => { setShowForm(false); resetForm(); }}>
          <div className="ablg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ablg-modal-header">
              <h3>{editingPost ? 'Edit Story' : 'Add New Story'}</h3>
              <button className="ablg-close-btn" onClick={() => { setShowForm(false); resetForm(); }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="ablg-form">
              <div className="ablg-field">
                <label className="ablg-label">Related Tour *</label>
                <select
                  className="ablg-control"
                  name="tourId"
                  value={formData.tourId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a tour...</option>
                  {tours.map((tour) => (
                    <option key={tour.id} value={tour.id}>
                      {tour.title} ({tour.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Feature Image *</label>
                {mainImage ? (
                  <div className="ablg-image-preview">
                    <img src={mainImage} alt="Preview" />
                    <button type="button" className="ablg-btn ablg-btn-danger-ghost" onClick={removeMainImage}>
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <label htmlFor="blog-image-upload" className="ablg-upload-area">
                    <div className="ablg-upload-icon">📷</div>
                    <div>Click to upload image</div>
                    <div className="ablg-upload-hint">JPG, PNG or WebP (Max 5MB)</div>
                    <input
                      id="blog-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Title *</label>
                <input
                  type="text" className="ablg-control" name="title"
                  value={formData.title} onChange={handleInputChange}
                  placeholder="E.g., Sunrise over the Simien Mountains" required
                />
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Subtitle</label>
                <input
                  type="text" className="ablg-control" name="subtitle"
                  value={formData.subtitle} onChange={handleInputChange}
                  placeholder="Short secondary line for this story"
                />
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Location</label>
                <input
                  type="text" className="ablg-control" name="location"
                  value={formData.location} onChange={handleInputChange}
                  placeholder="E.g., Simien Mountains, Lalibela..."
                />
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Story *</label>
                <textarea
                  className="ablg-control" name="story" rows="5"
                  value={formData.story} onChange={handleInputChange}
                  placeholder="Write the travel story or experience here..." required
                />
              </div>

              <div className="ablg-field">
                <label className="ablg-label">Tags</label>
                <input
                  type="text" className="ablg-control" name="tags"
                  value={formData.tags} onChange={handleInputChange}
                  placeholder="E.g., mountains, trekking, culture (comma separated)"
                />
              </div>

              <div className="ablg-field ablg-checkbox-field">
                <label className="ablg-checkbox-label">
                  <input
                    type="checkbox" name="featured"
                    checked={formData.featured} onChange={handleInputChange}
                  />
                  Mark as featured story
                </label>
              </div>

              <div className="ablg-form-actions">
                <button type="button" className="ablg-btn ablg-btn-secondary" onClick={() => { setShowForm(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="ablg-btn ablg-btn-primary" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingPost ? 'Update Story' : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="ablg-list">
        {isLoading && posts.length === 0 ? (
          <div className="ablg-empty">Loading stories...</div>
        ) : posts.length === 0 ? (
          <div className="ablg-empty">
            <div className="ablg-empty-icon">📝</div>
            <h3>No stories yet</h3>
            <p>Click "New Story" to create your first gallery item.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="ablg-row">
              <div className="ablg-row-thumb">
                <img src={resolveImage(post.imageUrl)} alt={post.title} />
              </div>

              <div className="ablg-row-body">
                <div className="ablg-row-top">
                  <h3 className="ablg-row-title">{post.title}</h3>
                  {post.featured && <span className="ablg-badge">Featured</span>}
                  {post.submittedByGuest && <span className="ablg-badge ablg-badge-guest">Guest</span>}
                  {post.status === 'PENDING' && <span className="ablg-badge ablg-badge-pending">Pending</span>}
                </div>
                <div className="ablg-row-meta">
                  {post.tour && <span>{post.tour.title}</span>}
                  {post.location && <span>📍 {post.location}</span>}
                  <span>
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="ablg-row-excerpt">
                  {post.story.length > 140 ? `${post.story.substring(0, 140)}...` : post.story}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="ablg-row-tags">
                    {post.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="ablg-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ablg-row-actions">
                {post.status === 'PENDING' && (
                  <button className="ablg-btn ablg-btn-primary ablg-btn-sm" onClick={() => handleApprove(post)}>
                    ✓ Approve
                  </button>
                )}
                <button className="ablg-btn ablg-btn-secondary ablg-btn-sm" onClick={() => handleEdit(post)}>
                  ✏️ Edit
                </button>
                <button className="ablg-btn ablg-btn-danger ablg-btn-sm" onClick={() => handleDelete(post.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ablg-page {
          --ablg-olive: #556B2F;
          --ablg-olive-dark: #3E4F22;
          --ablg-ink: #2B2A25;
          --ablg-bg: #F7F6F2;
          font-family: 'Inter', sans-serif;
          color: var(--ablg-ink);
          padding: 24px;
        }

        .ablg-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 28px;
        }

        .ablg-heading { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; }
        .ablg-subheading { margin: 0; color: #6b6a63; font-size: 0.92rem; }

        .ablg-btn {
          border: none; border-radius: 8px; cursor: pointer; font-family: inherit;
          font-weight: 600; font-size: 0.9rem; padding: 10px 20px; transition: all 0.15s ease;
        }
        .ablg-btn-primary { background: var(--ablg-olive); color: #fff; }
        .ablg-btn-primary:hover { background: var(--ablg-olive-dark); }
        .ablg-btn-secondary { background: #eee; color: #333; }
        .ablg-btn-secondary:hover { background: #ddd; }
        .ablg-btn-danger { background: #fdecea; color: #c0392b; }
        .ablg-btn-danger:hover { background: #fbd9d5; }
        .ablg-btn-danger-ghost { background: none; color: #c0392b; border: 1px solid #f0c4bd; margin-top: 10px; }
        .ablg-btn-sm { padding: 7px 14px; font-size: 0.82rem; }

        .ablg-list { display: flex; flex-direction: column; gap: 14px; }

        .ablg-row {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 20px;
          align-items: center;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 16px;
        }

        .ablg-row-thumb {
          width: 120px; height: 120px; border-radius: 8px; overflow: hidden; flex-shrink: 0;
          background: var(--ablg-bg);
        }
        .ablg-row-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .ablg-row-body { min-width: 0; }
        .ablg-row-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ablg-row-title { margin: 0; font-size: 1.1rem; font-weight: 700; }

        .ablg-badge {
          background: #B5651D; color: #fff; font-size: 0.68rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 999px;
        }
        .ablg-badge-guest {
          background: var(--ablg-olive);
        }
        .ablg-badge-pending {
          background: #c97d00;
        }

        .ablg-row-meta {
          display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.8rem; color: #8a8878;
          margin: 6px 0 8px; font-weight: 500;
        }

        .ablg-row-excerpt {
          margin: 0 0 8px; font-size: 0.88rem; line-height: 1.5; color: #4a493f;
        }

        .ablg-row-tags { display: flex; gap: 6px; flex-wrap: wrap; }
        .ablg-tag {
          font-size: 0.7rem; font-weight: 600; color: var(--ablg-olive-dark);
          background: #E3E7D3; padding: 2px 9px; border-radius: 999px;
        }

        .ablg-row-actions {
          display: flex; flex-direction: column; gap: 8px; align-items: stretch;
        }

        .ablg-empty {
          text-align: center; padding: 60px 20px; color: #8a8878; background: #fff;
          border-radius: 12px; border: 1px dashed #ddd;
        }
        .ablg-empty-icon { font-size: 2.6rem; margin-bottom: 12px; opacity: 0.6; }
        .ablg-empty h3 { margin: 0 0 6px; color: var(--ablg-ink); }

        .ablg-modal-overlay {
          position: fixed; inset: 0; background: rgba(20, 20, 15, 0.55);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
        }

        .ablg-modal {
          background: #fff; border-radius: 14px; width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto; padding: 28px;
        }

        .ablg-modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
        }
        .ablg-modal-header h3 { margin: 0; font-size: 1.25rem; }
        .ablg-close-btn {
          background: none; border: none; font-size: 1.1rem; cursor: pointer; color: #888;
        }

        .ablg-form { display: flex; flex-direction: column; gap: 16px; }
        .ablg-field { display: flex; flex-direction: column; gap: 6px; }
        .ablg-label { font-size: 0.85rem; font-weight: 600; color: var(--ablg-ink); }

        .ablg-control {
          padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
          font-family: inherit; font-size: 0.92rem; width: 100%; box-sizing: border-box;
        }
        .ablg-control:focus { outline: none; border-color: var(--ablg-olive); }

        .ablg-upload-area {
          border: 2px dashed #ddd; border-radius: 10px; padding: 28px 16px;
          text-align: center; cursor: pointer; color: #666; background: var(--ablg-bg);
        }
        .ablg-upload-area:hover { border-color: var(--ablg-olive); }
        .ablg-upload-icon { font-size: 1.8rem; margin-bottom: 6px; }
        .ablg-upload-hint { font-size: 0.78rem; color: #999; margin-top: 4px; }

        .ablg-image-preview img {
          width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px; display: block;
        }

        .ablg-checkbox-field { flex-direction: row; align-items: center; }
        .ablg-checkbox-label {
          display: flex; align-items: center; gap: 8px; font-size: 0.9rem; font-weight: 500; cursor: pointer;
        }

        .ablg-form-actions {
          display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px;
        }

        @media (max-width: 640px) {
          .ablg-row {
            grid-template-columns: 1fr;
          }
          .ablg-row-thumb { width: 100%; height: 180px; }
          .ablg-row-actions { flex-direction: row; }
        }
      `}</style>
    </div>
  );
}

export default AdminBlog;