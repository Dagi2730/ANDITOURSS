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

  if (!isUserAdmin()) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>🔒 Admin Blog Access Required</h2>
        <p style={{ margin: '20px 0', color: '#666' }}>
          You must be logged in as an administrator to manage stories.
        </p>
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#556B2F',
              border: '2px solid #556B2F',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Go to Login Page
          </button>
        </div>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || '';
  const baseURL = API_URL || 'http://localhost:8000';

  const resolveImage = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/600x400?text=Andi+Tours+Story';
    return imageUrl.startsWith('http') ? imageUrl : `${baseURL}${imageUrl}`;
  };

  return (
    <div className="admin-blog-wrapper">
      <div className="admin-section-header">
        <div>
          <h2>Stories & Gallery</h2>
          <p style={{ marginTop: '4px', color: '#666' }}>
            Curate your Andi Tours stories, experiences and gallery images. These appear on the public Gallery page.
          </p>
        </div>
        <button
          className="admin-btn admin-btn-primary admin-btn-sm"
          onClick={handleAddNew}
        >
          + New Story
        </button>
      </div>

      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal blog-form-modal">
            <div className="form-modal-header">
              <h3>{editingPost ? 'Edit Story' : 'Add New Story'}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Related Tour *</label>
                <select
                  className="admin-form-control"
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

              <div className="admin-form-group">
                <label className="admin-form-label">Feature Image *</label>
                <div className="image-upload-container">
                  {mainImage ? (
                    <div className="image-preview">
                      <img
                        src={mainImage}
                        alt="Preview"
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={removeMainImage}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="upload-area">
                      <label htmlFor="blog-image-upload" className="upload-label">
                        <div className="upload-icon">📷</div>
                        <div>Click to upload image</div>
                        <div className="upload-hint">
                          JPG, PNG or WebP (Max 5MB)
                        </div>
                      </label>
                      <input
                        id="blog-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageChange}
                        className="file-input"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Title *</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., Sunrise over the Simien Mountains"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Subtitle</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Short secondary line for this story"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Location</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="E.g., Simien Mountains, Lalibela, Danakil Depression..."
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Story *</label>
                <textarea
                  className="admin-form-control"
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Write the travel story, experience or description here..."
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Tags</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="E.g., mountains, trekking, culture (comma separated)"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    style={{ marginRight: '8px' }}
                  />
                  Mark as featured story
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Saving...'
                    : editingPost
                    ? 'Update Story'
                    : 'Create Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        {isLoading && posts.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center' }}>
            <p>Loading stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
            <div style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '20px' }}>
              📝
            </div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>No stories yet</h3>
            <p>Click "New Story" to create your first gallery item.</p>
          </div>
        ) : (
          <div className="admin-blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="admin-blog-card">
                <div className="admin-blog-image-wrapper">
                  <img
                    src={resolveImage(post.imageUrl)}
                    alt={post.title}
                    className="admin-blog-image"
                  />
                  {post.featured && (
                    <span className="admin-blog-badge">Featured</span>
                  )}
                </div>
                <div className="admin-blog-body">
                  <div className="admin-blog-header">
                    <h3>{post.title}</h3>
                    {post.location && (
                      <span className="admin-blog-location">
                        📍 {post.location}
                      </span>
                    )}
                  </div>
                  {post.tour && (
                    <p className="admin-blog-subtitle">
                      Tour:&nbsp;
                      <strong>{post.tour.title}</strong>
                    </p>
                  )}
                  {post.subtitle && (
                    <p className="admin-blog-subtitle">{post.subtitle}</p>
                  )}
                  <p className="admin-blog-excerpt">
                    {post.story.length > 140
                      ? `${post.story.substring(0, 140)}...`
                      : post.story}
                  </p>
                  <div className="admin-blog-meta">
                    <span>
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="admin-blog-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="admin-blog-tag">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="admin-blog-tag-more">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="admin-blog-actions">
                    <button
                      className="view-btn"
                      type="button"
                      onClick={() => handleEdit(post)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                      type="button"
                      onClick={() => handleDelete(post.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminBlog;