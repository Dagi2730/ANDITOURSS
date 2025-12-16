import React, { useState } from 'react';

function AdminPackages() {
  const [packages, setPackages] = useState([
    { 
      id: 1, 
      name: 'Simien Mountains Trek', 
      price: '$1,250', 
      duration: '7 days',
      highlights: 'Breathtaking mountain views, wildlife spotting, traditional villages',
      description: 'Explore the stunning Simien Mountains with experienced guides',
      travelDetails: 'Accommodation in mountain lodges, all meals included, transportation',
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      status: 'active' 
    },
    { 
      id: 2, 
      name: 'Danakil Depression Adventure', 
      price: '$1,800', 
      duration: '4 days',
      highlights: 'Active volcanoes, salt lakes, colorful mineral deposits',
      description: 'Visit one of the hottest places on earth with unique geological formations',
      travelDetails: 'Camping accommodation, 4x4 transportation, experienced local guides',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
      status: 'active' 
    },
    { 
      id: 3, 
      name: 'Lalibela Historical Tour', 
      price: '$950', 
      duration: '3 days',
      highlights: 'Rock-hewn churches, UNESCO World Heritage site, religious ceremonies',
      description: 'Discover the ancient rock-hewn churches of Lalibela',
      travelDetails: 'Hotel accommodation, local guide, entrance fees included',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
      status: 'active' 
    },
    { 
      id: 4, 
      name: 'Omo Valley Cultural Experience', 
      price: '$1,500', 
      duration: '5 days',
      highlights: 'Tribal communities, traditional ceremonies, local markets',
      description: 'Immerse yourself in the rich cultural heritage of Omo Valley tribes',
      travelDetails: 'Lodge accommodation, cultural permits, local translator',
      imageUrl: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
      status: 'active' 
    },
    { 
      id: 5, 
      name: 'Bale Mountains National Park', 
      price: '$1,100', 
      duration: '6 days',
      highlights: 'Endemic wildlife, Afro-alpine vegetation, scenic hiking trails',
      description: 'Explore the diverse ecosystems of Bale Mountains National Park',
      travelDetails: 'Lodge stays, park fees, professional hiking guide included',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w-800&q=80',
      status: 'active' 
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    highlights: '',
    description: '',
    travelDetails: '',
    imageUrl: '',
    status: 'active'
  });

  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsCard(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price.replace('$', ''),
      duration: pkg.duration,
      highlights: pkg.highlights || '',
      description: pkg.description || '',
      travelDetails: pkg.travelDetails || '',
      imageUrl: pkg.imageUrl || '',
      status: pkg.status
    });
    setImagePreview(pkg.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = (pkgId, pkgName) => {
    if (window.confirm(`Are you sure you want to delete package "${pkgName}"?`)) {
      setPackages(packages.filter(pkg => pkg.id !== pkgId));
      alert(`Package "${pkgName}" deleted successfully!`);
    }
  };

  const handleAddNew = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      highlights: '',
      description: '',
      travelDetails: '',
      imageUrl: '',
      status: 'active'
    });
    setImagePreview(null);
    setShowForm(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload this to a server
      // For demo purposes, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      setImagePreview(imageUrl);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.duration || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newPackage = {
      id: editingPackage ? editingPackage.id : Date.now(),
      name: formData.name,
      price: `$${formData.price}`,
      duration: formData.duration,
      highlights: formData.highlights,
      description: formData.description,
      travelDetails: formData.travelDetails,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Default image
      status: formData.status
    };

    if (editingPackage) {
      // Update existing package
      setPackages(packages.map(pkg => 
        pkg.id === editingPackage.id ? newPackage : pkg
      ));
      alert(`Package "${formData.name}" updated successfully!`);
    } else {
      // Add new package
      setPackages([...packages, newPackage]);
      alert(`Package "${formData.name}" added successfully!`);
    }

    setShowForm(false);
    setFormData({
      name: '',
      price: '',
      duration: '',
      highlights: '',
      description: '',
      travelDetails: '',
      imageUrl: '',
      status: 'active'
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="admin-packages-wrapper">
      <div className="admin-section-header">
        <h2>Travel Packages</h2>
        <div>
          <button 
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={() => alert('Exporting packages data...')}
          >
            Export Data
          </button>
          <button 
            className="admin-btn admin-btn-primary admin-btn-sm" 
            style={{ marginLeft: '10px' }}
            onClick={handleAddNew}
          >
            + Add New Package
          </button>
        </div>
      </div>

      {/* Package Details Modal */}
      {showDetailsCard && selectedPackage && (
        <div className="admin-modal-overlay" onClick={() => setShowDetailsCard(false)}>
          <div className="package-detail-card" onClick={e => e.stopPropagation()}>
            <div className="card-top-accent"></div>
            <div className="card-content">
              <div className="card-header">
                <h3>Package Details</h3>
                <span className="package-tag">{selectedPackage.name}</span>
              </div>

              {selectedPackage.imageUrl && (
                <div className="package-image-container">
                  <img 
                    src={selectedPackage.imageUrl} 
                    alt={selectedPackage.name}
                    className="package-image"
                  />
                </div>
              )}

              <div className="detail-grid">
                <div className="info-group">
                  <label>Package Name</label>
                  <p className="highlight-text">{selectedPackage.name}</p>
                </div>
                <div className="info-group">
                  <label>Price</label>
                  <p className="highlight-text">{selectedPackage.price}</p>
                </div>
                <div className="info-group">
                  <label>Duration</label>
                  <p>{selectedPackage.duration}</p>
                </div>
                <div className="info-group full">
                  <label>Description</label>
                  <div className="description-display">
                    {selectedPackage.description}
                  </div>
                </div>
                <div className="info-group full">
                  <label>Highlights</label>
                  <div className="highlights-display">
                    {selectedPackage.highlights}
                  </div>
                </div>
                <div className="info-group full">
                  <label>Travel Details</label>
                  <div className="travel-details-display">
                    {selectedPackage.travelDetails}
                  </div>
                </div>
              </div>
              
              <div className="card-actions">
                <button className="btn-close" onClick={() => setShowDetailsCard(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Package Form Modal */}
      {showForm && (
        <div className="form-modal-overlay">
          <div className="form-modal package-form-modal">
            <div className="form-modal-header">
              <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              {/* Image Upload Section */}
              <div className="admin-form-group">
                <label className="admin-form-label">Package Image</label>
                <div className="image-upload-container">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" className="preview-image" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="upload-area">
                      <label htmlFor="image-upload" className="upload-label">
                        <div className="upload-icon">📷</div>
                        <div>Click to upload image</div>
                        <div className="upload-hint">JPG, PNG or WebP (Max 5MB)</div>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file-input"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Package Name *</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Simien Mountains Trek"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Price ($) *</label>
                <input
                  type="number"
                  className="admin-form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 1250"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Duration *</label>
                <input
                  type="text"
                  className="admin-form-control"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 7 days"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Description *</label>
                <textarea
                  className="admin-form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Brief description of the package..."
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Highlights</label>
                <textarea
                  className="admin-form-control"
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Key features and attractions separated by commas..."
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Travel Details</label>
                <textarea
                  className="admin-form-control"
                  name="travelDetails"
                  value={formData.travelDetails}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Accommodation, transportation, inclusions..."
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Status</label>
                <select
                  className="admin-form-control"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn admin-btn-primary"
                >
                  {editingPackage ? 'Update Package' : 'Add Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-plain-table packages-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Package Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>#{pkg.id}</td>
                  <td>
                    <div className="package-table-image">
                      <img 
                        src={pkg.imageUrl} 
                        alt={pkg.name}
                        className="package-thumbnail"
                      />
                    </div>
                  </td>
                  <td>
                    <strong>{pkg.name}</strong>
                  </td>
                  <td>{pkg.price}</td>
                  <td>{pkg.duration}</td>
                  <td>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {pkg.description.substring(0, 60)}...
                    </div>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button 
                        className="view-btn"
                        onClick={() => handleView(pkg)}
                        title="View Details"
                      >
                        👁️ Details
                      </button>
                      <button 
                        className="admin-btn admin-btn-primary admin-btn-sm admin-btn-icon"
                        onClick={() => handleEdit(pkg)}
                        title="Edit Package"
                      >
                        ✏️
                      </button>
                      <button 
                        className="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon"
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        title="Delete Package"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-packages-wrapper {
          padding: 20px;
        }
        
        .package-detail-card {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideIn 0.3s ease;
          position: relative;
        }
        
        .package-image-container {
          margin: 20px 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .package-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          display: block;
        }
        
        .package-tag {
          background: #f5f5f5;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
          color: var(--admin-text);
          font-weight: 500;
        }
        
        .description-display,
        .highlights-display,
        .travel-details-display {
          background: white;
          border: 1px solid var(--admin-border);
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
          line-height: 1.6;
          color: var(--admin-text);
          font-style: italic;
          min-height: 80px;
          max-height: 200px;
          overflow-y: auto;
          background-color: #faf8f4;
        }
        
        .highlights-display {
          background-color: #fff8e1;
        }
        
        .travel-details-display {
          background-color: #e8f5e9;
        }
        
        /* Form Image Upload Styles */
        .image-upload-container {
          border: 2px dashed var(--admin-border);
          border-radius: 8px;
          padding: 20px;
          background: #fafafa;
          transition: all 0.3s ease;
        }
        
        .image-upload-container:hover {
          border-color: var(--admin-olive);
          background: #f5f5f5;
        }
        
        .image-preview {
          text-align: center;
        }
        
        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 6px;
          margin-bottom: 15px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .remove-image-btn {
          background: #ffebee;
          color: #c62828;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        
        .remove-image-btn:hover {
          background: #ffcdd2;
        }
        
        .upload-area {
          text-align: center;
          cursor: pointer;
        }
        
        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        
        .upload-icon {
          font-size: 2rem;
          opacity: 0.6;
        }
        
        .upload-hint {
          font-size: 0.85rem;
          color: #666;
          margin-top: 5px;
        }
        
        .file-input {
          display: none;
        }
        
        /* Table Image Styles */
        .package-table-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .package-thumbnail {
          width: 60px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .packages-table th:nth-child(2),
        .packages-table td:nth-child(2) {
          width: 80px;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .action-btns {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .view-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background: #e3f2fd;
          color: #0277bd;
        }
        
        .view-btn:hover {
          background: #bbdefb;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .package-detail-card {
            width: 95%;
            max-height: 95vh;
          }
          
          .card-content {
            padding: 20px;
          }
          
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .action-btns {
            flex-direction: column;
            align-items: stretch;
          }
          
          .action-btns button {
            width: 100%;
            margin-bottom: 5px;
          }
          
          .package-form-modal {
            max-width: 95%;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPackages;