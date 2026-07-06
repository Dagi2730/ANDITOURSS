import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    duration: '',
    location: '',
    highlights: '',
    description: '',
    travelDetails: '',
    itinerary: [{ day: 1, title: '', description: '' }],
    imageUrl: ''
  });

  // --- API FETCH ---
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/tours');
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsCard(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      title: pkg.title || '',
      price: pkg.price?.toString() || '',
      duration: pkg.duration || '',
      location: pkg.location || '',
      highlights: pkg.highlights || '',
      description: pkg.description || '',
      travelDetails: pkg.travelDetails || '',
      itinerary: Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
        ? pkg.itinerary
        : [{ day: 1, title: '', description: '' }],
      imageUrl: pkg.imageUrl || ''
    });
    setImagePreview(pkg.imageUrl || null);
    setShowForm(true);
  };

  const handleDelete = async (pkgId, pkgTitle) => {
    if (window.confirm(`Delete "${pkgTitle}"?`)) {
      try {
        await api.delete(`/tours/${pkgId}`);
        setPackages(packages.filter(p => p.id !== pkgId));
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleAddNew = () => {
    setEditingPackage(null);
    setFormData({
      title: '', price: '', duration: '', location: '', highlights: '', description: '',
      travelDetails: '', itinerary: [{ day: 1, title: '', description: '' }],
      imageUrl: ''
    });
    setImagePreview(null);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItineraryChange = (index, field, value) => {
    const updated = [...formData.itinerary];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, itinerary: updated }));
  };

  const addItineraryDay = () => {
    setFormData(prev => ({ 
      ...prev, 
      itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: '', description: '' }] 
    }));
  };

  const removeItineraryDay = (index) => {
    const filtered = formData.itinerary.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, itinerary: filtered.map((d, i) => ({ ...d, day: i + 1 })) }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imageUrl: url }));
      setImagePreview(url);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Strip any "$" and send price as a real number — Prisma schema requires Float
    const cleanedPrice = Number(formData.price.toString().replace('$', '').trim());

    const submissionData = {
      ...formData,
      price: cleanedPrice,
      location: formData.location || 'Ethiopia'
    };

    try {
      if (editingPackage) {
        const res = await api.put(`/tours/${editingPackage.id}`, submissionData);
        setPackages(packages.map(p => p.id === editingPackage.id ? res.data : p));
      } else {
        const res = await api.post('/tours', submissionData);
        setPackages([...packages, res.data]);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving data to database. Ensure backend is running.");
    }
  };

  return (
    <div className="admin-packages-wrapper">
      <div className="itinerary-header-section">
        <h2>Travel Packages</h2>
        <button className="add-itinerary-btn" onClick={handleAddNew}>+ Add New Package</button>
      </div>

      {/* --- ORIGINAL STYLE DETAIL CARD --- */}
      {showDetailsCard && selectedPackage && (
        <div className="admin-modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}} onClick={() => setShowDetailsCard(false)}>
          <div className="package-detail-card" onClick={e => e.stopPropagation()}>
            <div style={{padding: '20px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>{selectedPackage.title}</h3>
                <span className="package-tag">{selectedPackage.duration}</span>
              </div>

              {selectedPackage.imageUrl && (
                <div className="package-image-container">
                  <img src={selectedPackage.imageUrl} alt={selectedPackage.title} className="package-image" />
                </div>
              )}

              <div className="itinerary-indicator">
                <strong>Price:</strong> ${selectedPackage.price}
              </div>

              <div className="description-display">
                <strong>Description:</strong><br/>{selectedPackage.description}
              </div>

              <div className="highlights-display">
                <strong>Highlights:</strong><br/>{selectedPackage.highlights}
              </div>

              <div className="travel-details-display">
                <strong>Travel Details:</strong><br/>{selectedPackage.travelDetails}
              </div>
              
              {selectedPackage.itinerary?.length > 0 && (
                <div className="itinerary-display">
                  <h4>Full Itinerary</h4>
                  {selectedPackage.itinerary.map((item, index) => (
                    <div key={index} className="itinerary-item">
                      <div className="itinerary-header">
                        <span className="itinerary-day">Day {item.day}</span>
                        <h4 className="itinerary-title">{item.title}</h4>
                      </div>
                      <p className="itinerary-description">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div style={{marginTop: '20px'}}>
                <button className="remove-image-btn" onClick={() => setShowDetailsCard(false)}>Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className="form-modal-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
          <div className="package-detail-card" style={{padding: '30px'}}>
            <div className="itinerary-header-section">
              <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <button className="remove-itinerary-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleFormSubmit} style={{display: 'flex', flexDirection:'column', gap:'10px'}}>
              <div className="image-upload-container">
                 <input type="file" onChange={handleImageUpload} className="file-input" id="fileInput" />
                 <label htmlFor="fileInput" className="upload-label">
                    <span className="upload-icon">📷</span>
                    <span>Click to Upload Image</span>
                 </label>
                 {imagePreview && <img src={imagePreview} className="package-thumbnail" style={{width: '100px', marginTop: '10px'}} alt="preview" />}
              </div>

              <input type="text" name="title" placeholder="Package Name" className="itinerary-item-form" style={{width:'100%'}} value={formData.title} onChange={handleInputChange} required />
              <input type="text" name="price" placeholder="Price (e.g. 1200)" className="itinerary-item-form" style={{width:'100%'}} value={formData.price} onChange={handleInputChange} required />
              <input type="text" name="duration" placeholder="Duration (e.g. 5 Days / 4 Nights)" className="itinerary-item-form" style={{width:'100%'}} value={formData.duration} onChange={handleInputChange} required />
              <input type="text" name="location" placeholder="Location (e.g. Lalibela, Ethiopia)" className="itinerary-item-form" style={{width:'100%'}} value={formData.location} onChange={handleInputChange} />
              <textarea name="description" placeholder="Description" className="description-display" style={{width:'100%'}} value={formData.description} onChange={handleInputChange} required />
              <textarea name="highlights" placeholder="Highlights" className="highlights-display" style={{width:'100%'}} value={formData.highlights} onChange={handleInputChange} />
              <textarea name="travelDetails" placeholder="Travel Details" className="travel-details-display" style={{width:'100%'}} value={formData.travelDetails} onChange={handleInputChange} />
              
              <div className="itinerary-form-section">
                <div className="itinerary-header-section">
                  <h4>Itinerary Days</h4>
                  <button type="button" className="add-itinerary-btn" onClick={addItineraryDay}>+ Add Day</button>
                </div>
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="itinerary-item-form">
                    <div className="itinerary-item-header">
                       <h5>Day {item.day}</h5>
                       <button type="button" className="remove-itinerary-btn" onClick={() => removeItineraryDay(index)}>Remove</button>
                    </div>
                    <div className="itinerary-fields">
                       <input type="text" value={item.title} onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} placeholder="Title" />
                       <textarea value={item.description} onChange={(e) => handleItineraryChange(index, 'description', e.target.value)} placeholder="What happens on this day?" />
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="add-itinerary-btn" style={{padding:'15px', fontSize:'1rem'}}>Save Package to Database</button>
            </form>
          </div>
        </div>
      )}

      {/* --- LIST TABLE --- */}
      <div className="admin-table-container" style={{marginTop: '20px'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden'}}>
          <thead style={{background: '#f8f9fa', borderBottom: '2px solid #eee'}}>
            <tr>
              <th style={{padding: '15px'}}>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} style={{borderBottom: '1px solid #eee'}}>
                <td className="package-table-image" style={{padding: '10px'}}>
                   <img src={pkg.imageUrl} className="package-thumbnail" alt="" />
                </td>
                <td style={{padding: '10px'}}><strong>{pkg.title}</strong></td>
                <td>${pkg.price}</td>
                <td>{pkg.duration}</td>
                <td className="action-btns">
                  <button className="view-btn" onClick={() => handleView(pkg)}>View</button>
                  <button className="add-itinerary-btn" style={{background:'#556B2F'}} onClick={() => handleEdit(pkg)}>Edit</button>
                  <button className="remove-itinerary-btn" onClick={() => handleDelete(pkg.id, pkg.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
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
          color: #333;
          font-weight: 500;
        }
        
        .description-display,
        .highlights-display,
        .travel-details-display {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 15px;
          margin-top: 10px;
          line-height: 1.6;
          color: #333;
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
        
        /* Itinerary Styles */
        .itinerary-display {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          margin-top: 10px;
        }
        
        .itinerary-item {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .itinerary-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .itinerary-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }
        
        .itinerary-day {
          background: #556B2F;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          min-width: 60px;
          text-align: center;
        }
        
        .itinerary-title {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }
        
        .itinerary-description {
          margin: 0;
          color: #555;
          line-height: 1.6;
          padding-left: 75px;
        }
        
        .itinerary-indicator {
          font-size: 0.9rem;
          color: #666;
          margin: 20px 0 10px 0;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        /* Itinerary Form Styles */
        .itinerary-form-section {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: #f9f9f9;
        }
        
        .itinerary-header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .itinerary-header-section h4 {
          margin: 0;
          color: #333;
        }
        
        .add-itinerary-btn {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }
        
        .add-itinerary-btn:hover {
          background: #f5f5f5;
        }
        
        .itinerary-item-form {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 10px;
        }
        
        .itinerary-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .itinerary-item-header h5 {
          margin: 0;
          color: #333;
          font-size: 1rem;
        }
        
        .remove-itinerary-btn {
          background: #ffebee;
          color: #c62828;
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }
        
        .remove-itinerary-btn:hover {
          background: #ffcdd2;
        }
        
        .itinerary-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        /* Image Upload Styles */
        .image-upload-container {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 20px;
          background: #fafafa;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .image-upload-container:hover {
          border-color: #556B2F;
          background: #f5f5f5;
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
          padding: 10px;
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
          .itinerary-description {
            padding-left: 0;
          }
          .action-btns {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPackages;