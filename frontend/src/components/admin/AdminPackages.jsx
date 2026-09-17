import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const ETHIOPIA_DESTINATION_LOCATIONS = [
  "Addis Ababa (Capital & Entoto Highlands)",
  "Adama / Nazret (Oromia)",
  "Arba Minch & Lake Chamo / Nechisar",
  "Asosa (Benishangul-Gumuz)",
  "Awash National Park & Awash River Falls",
  "Axum Ancient Obelisks & Tigray Historical Monuments",
  "Bahir Dar, Lake Tana & Blue Nile Falls",
  "Bale Mountains National Park & Sanetti Plateau",
  "Bishoftu / Debre Zeyit Crater Lakes",
  "Bonga & Kaffa Coffee Biosphere Reserve",
  "Chencha & Dorze Highland Village",
  "Danakil Depression, Dallol & Erta Ale Volcano",
  "Debre Birhan & Ankober Palace Escarpment",
  "Debre Libanos Monastery & Jemma River Gorge",
  "Debre Markos (East Gojjam)",
  "Dessie & Kombolcha (South Wollo)",
  "Dilla & Gedeo Megalithic Cultural Landscape",
  "Dire Dawa Historic Railway City",
  "Gambela National Park & Baro River",
  "Goba & Robe (Bale Zone)",
  "Gondar Fasil Ghebbi Castles & Royal Baths",
  "Gurage Zone (Wolkite, Butajira, Agena & Tiya)",
  "Harar Jugol Fortified Historic City",
  "Hawassa Lakeside & Great Rift Valley",
  "Jigjiga (Somali Region)",
  "Jimma & Abba Jifar Royal Palace",
  "Jinka & Omo Valley Expeditions",
  "Lalibela Rock-Hewn Monolithic Churches",
  "Mekelle & Gheralta Rock Churches",
  "Metu & Sor Waterfalls (Illubabor)",
  "Moyale & Borena Pastoralist Zone",
  "Nekemte (East Welega)",
  "Omo Valley Cultural Circuits (Turmi, Karo, Mursi)",
  "Semera & Lake Abbe (Afar Region)",
  "Simien Mountains National Park & Ras Dashen",
  "Tiya World Heritage Megalithic Site (Gurage)",
  "Wolaita Sodo (Wolaita Zone)",
  "Woldiya & Lasta Highlands (North Wollo)",
  "Yabelo Wildlife Sanctuary (Borena)",
  "Yirgalem & Sidama Coffee Forests",
  "Ziway / Batu Lake & Bird Sanctuary"
];

const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80';
  if (url.startsWith('http') || url.startsWith('blob:')) return url;
  const backendBase = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
  return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

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

function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailsCard, setShowDetailsCard] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
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
      console.error('Error fetching tours:', error);
      setLoading(false);
    }
  };

  // Keyboard navigation for closing modals with Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false);
        setShowDetailsCard(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- HANDLERS ---
  const handleView = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsCard(true);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    const loc = pkg.location || '';
    const isKnown = ETHIOPIA_DESTINATION_LOCATIONS.includes(loc);
    setIsCustomLocation(!isKnown && loc !== '');
    setFormData({
      title: pkg.title || '',
      duration: pkg.duration || '',
      location: loc,
      highlights: pkg.highlights || '',
      description: pkg.description || '',
      travelDetails: pkg.travelDetails || '',
      itinerary: Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
        ? pkg.itinerary
        : [{ day: 1, title: '', description: '' }],
      imageUrl: pkg.imageUrl || ''
    });
    setImageFiles([]);
    const existingImages = Array.isArray(pkg.images) && pkg.images.length > 0
      ? pkg.images.map(img => getImageUrl(img))
      : [getImageUrl(pkg.imageUrl)];
    setImagePreviews(existingImages);
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
    setIsCustomLocation(false);
    setFormData({
      title: '',
      duration: '',
      location: '',
      highlights: '',
      description: '',
      travelDetails: '',
      itinerary: [{ day: 1, title: '', description: '' }],
      imageUrl: ''
    });
    setImageFiles([]);
    setImagePreviews([]);
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

  const handleImageUpload = async (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 0) {
      const sliced = selected.slice(0, 5);
      const compressedFiles = await Promise.all(sliced.map(f => compressImage(f)));
      setImageFiles(compressedFiles);
      const previews = compressedFiles.map(f => URL.createObjectURL(f));
      setImagePreviews(previews);
    }
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title || !formData.title.trim()) {
      alert('Please enter a Package Title.');
      return;
    }
    if (!formData.duration || !formData.duration.trim()) {
      alert('Please enter the Package Duration.');
      return;
    }
    if (!formData.location || !formData.location.trim()) {
      alert('Please select or specify a Package Location.');
      return;
    }
    if (!formData.description || !formData.description.trim()) {
      alert('Please enter a Package Description.');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('duration', formData.duration.trim());
    data.append('location', formData.location.trim());
    data.append('description', formData.description.trim());
    data.append('highlights', formData.highlights?.trim() || '');
    data.append('travelDetails', formData.travelDetails?.trim() || '');
    data.append('price', '0');
    data.append('itinerary', JSON.stringify(formData.itinerary || []));

    if (imageFiles.length > 0) {
      imageFiles.forEach(file => {
        data.append('images', file);
      });
    } else if (formData.imageUrl) {
      data.append('imageUrl', formData.imageUrl);
    }

    try {
      if (editingPackage) {
        const res = await api.put(`/tours/${editingPackage.id}`, data);
        setPackages(packages.map(p => p.id === editingPackage.id ? res.data : p));
      } else {
        const res = await api.post('/tours', data);
        setPackages([res.data, ...packages]);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Save error:", err.response?.data || err);

      try {
        const refetch = await api.get('/tours');
        if (Array.isArray(refetch.data)) {
          setPackages(refetch.data);
          const titleMatch = refetch.data.find(p => p.title?.toLowerCase() === formData.title.trim().toLowerCase());
          if (titleMatch) {
            setShowForm(false);
            alert("Package saved successfully!");
            return;
          }
        }
      } catch (rErr) {
        // Ignore
      }

      alert(err.response?.data?.message || err.message || "Error saving package. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-packages-wrapper">
      <div className="itinerary-header-section">
        <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Travel Packages</h2>
        <button className="add-itinerary-btn" onClick={handleAddNew}>+ Add New Package</button>
      </div>

      {/* --- ORIGINAL STYLE DETAIL CARD --- */}
      {showDetailsCard && selectedPackage && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={() => setShowDetailsCard(false)}>
          <div className="package-detail-card" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '25px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>{selectedPackage.title}</h3>
                <span className="package-tag">{selectedPackage.duration}</span>
              </div>

              {selectedPackage.imageUrl && (
                <div className="package-image-container">
                  <img src={getImageUrl(selectedPackage.imageUrl)} alt={selectedPackage.title} className="package-image" />
                </div>
              )}

              <div className="description-display">
                <strong>Description:</strong><br />{selectedPackage.description}
              </div>

              <div className="highlights-display">
                <strong>Highlights:</strong><br />{selectedPackage.highlights}
              </div>

              <div className="travel-details-display">
                <strong>Travel Details:</strong><br />{selectedPackage.travelDetails}
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

              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button className="btn-cancel" onClick={() => setShowDetailsCard(false)}>Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className="form-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.55)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="package-detail-card" style={{ padding: '30px', maxWidth: '850px' }}>
            <div className="itinerary-header-section" style={{ marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <button className="remove-day-btn" onClick={() => setShowForm(false)}>✕ Close</button>
            </div>

            <form id="tour-package-form" onSubmit={handleFormSubmit} className="admin-package-form" noValidate>
              <div className="form-group">
                <label className="form-label">Package Images (Up to 5)</label>
                <div className="image-upload-container">
                  <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="file-input" id="fileInput" />
                  <label htmlFor="fileInput" className="upload-label">
                    <span className="upload-icon" style={{ fontSize: '1.5rem' }}>📷</span>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Click to Upload Package Images (Select up to 5)</span>
                  </label>
                  {imagePreviews.length > 0 && (
                    <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {imagePreviews.map((url, idx) => (
                        <img key={idx} src={url} style={{ width: '90px', height: '65px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #556B2F' }} alt={`preview ${idx + 1}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">
                    Title <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input type="text" name="title" placeholder="e.g. Historic Route & Lalibela" className="admin-form-input" value={formData.title} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Duration <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                  </label>
                  <input type="text" name="duration" placeholder="e.g. 5 Days / 4 Nights" className="admin-form-input" value={formData.duration} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Location <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                </label>
                <select
                  name="locationSelect"
                  className="admin-form-input"
                  value={isCustomLocation ? 'OTHER' : (ETHIOPIA_DESTINATION_LOCATIONS.includes(formData.location) ? formData.location : (formData.location ? 'OTHER' : ''))}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'OTHER') {
                      setIsCustomLocation(true);
                      setFormData(prev => ({ ...prev, location: ETHIOPIA_DESTINATION_LOCATIONS.includes(prev.location) ? '' : prev.location }));
                    } else {
                      setIsCustomLocation(false);
                      setFormData(prev => ({ ...prev, location: val }));
                    }
                  }}
                  required={!isCustomLocation && !formData.location}
                >
                  <option value="">Select Destination City / Region...</option>
                  {ETHIOPIA_DESTINATION_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                  <option value="OTHER">➕ Other / Type Custom Location...</option>
                </select>

                {isCustomLocation && (
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="text"
                      name="location"
                      className="admin-form-input"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Type custom location (e.g. Gurage Zone, Hawassa, Butajira)"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Description <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>*</span>
                </label>
                <textarea name="description" rows="3" maxLength={2000} placeholder="Package overview..." className="admin-form-textarea" value={formData.description} onChange={handleInputChange} required />
                <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                  {formData.description.length} / 2000 characters
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Highlights</label>
                <textarea name="highlights" rows="3" maxLength={1000} placeholder="Key highlights of the tour..." className="admin-form-textarea" value={formData.highlights} onChange={handleInputChange} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                  {formData.highlights.length} / 1000 characters
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Travel Details</label>
                <textarea name="travelDetails" rows="3" maxLength={1000} placeholder="Important travel & booking details..." className="admin-form-textarea" value={formData.travelDetails} onChange={handleInputChange} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
                  {formData.travelDetails.length} / 1000 characters
                </span>
              </div>

              {/* --- ITINERARY SECTION --- */}
              <div className="itinerary-form-section">
                <div className="itinerary-section-header">
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 700 }}>Itinerary Days</h4>
                  <button type="button" className="add-day-btn" onClick={addItineraryDay}>+ Add Day</button>
                </div>
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="itinerary-day-card">
                    <div className="itinerary-day-header">
                      <span className="day-badge">Day {item.day}</span>
                      <button type="button" className="remove-day-btn" onClick={() => removeItineraryDay(index)}>Remove</button>
                    </div>
                    <div className="itinerary-fields">
                      <input
                        type="text"
                        className="admin-form-input"
                        value={item.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        placeholder="Title (e.g. Flight to Lalibela & Rock Churches)"
                      />
                      <textarea
                        rows="3"
                        className="admin-form-textarea"
                        value={item.description}
                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                        placeholder="What happens on this day?"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" form="tour-package-form" className="btn-save" disabled={loading}>
                  {loading ? 'Saving Package...' : editingPackage ? 'Save Package' : 'Add Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-container" style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '14px 18px', color: '#0f172a', fontWeight: '700', fontSize: '0.95rem', textAlign: 'left' }}>Image</th>
              <th style={{ padding: '14px 18px', color: '#0f172a', fontWeight: '700', fontSize: '0.95rem', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '14px 18px', color: '#0f172a', fontWeight: '700', fontSize: '0.95rem', textAlign: 'left' }}>Duration</th>
              <th style={{ padding: '14px 18px', color: '#0f172a', fontWeight: '700', fontSize: '0.95rem', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td className="package-table-image" style={{ padding: '12px 18px' }}>
                  <img src={getImageUrl(pkg.imageUrl)} className="package-thumbnail" alt="" />
                </td>
                <td style={{ padding: '12px 18px', color: '#0f172a', fontWeight: '700', fontSize: '0.95rem' }}>{pkg.title}</td>
                <td style={{ padding: '12px 18px', color: '#334155', fontWeight: '600', fontSize: '0.92rem' }}>{pkg.duration}</td>
                <td className="action-btns" style={{ padding: '12px 18px' }}>
                  <button className="view-btn" onClick={() => handleView(pkg)}>View</button>
                  <button className="add-itinerary-btn" style={{ background: '#556B2F' }} onClick={() => handleEdit(pkg)}>Edit</button>
                  <button className="remove-day-btn" onClick={() => handleDelete(pkg.id, pkg.title)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-packages-wrapper { padding: 20px; }
        .package-detail-card { 
          background: white; 
          border-radius: 16px; 
          width: 100%; 
          max-width: 800px; 
          max-height: 90vh; 
          overflow-y: auto; 
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25); 
          animation: slideIn 0.3s ease; 
          position: relative; 
        }
        .package-image-container { margin: 20px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        .package-image { width: 100%; height: 300px; object-fit: cover; display: block; }
        .package-tag { background: #f1f5f9; padding: 6px 14px; border-radius: 20px; font-size: 0.9rem; color: #334155; font-weight: 600; }
        
        .description-display, .highlights-display, .travel-details-display { 
          background: #f8fafc; 
          border: 1px solid #cbd5e1; 
          border-radius: 8px; 
          padding: 15px; 
          margin-top: 10px; 
          line-height: 1.6; 
          color: #1e293b; 
          min-height: 80px; 
          max-height: 200px; 
          overflow-y: auto; 
        }

        .itinerary-display { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-top: 15px; }
        .itinerary-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0; }
        .itinerary-day { background: #556B2F; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; min-width: 60px; text-align: center; }
        .itinerary-header { display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
        .itinerary-title { margin: 0; color: #0f172a; font-size: 1.1rem; font-weight: 700; }
        .itinerary-description { margin: 0; color: #334155; line-height: 1.6; padding-left: 75px; }
        .itinerary-header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }

        /* --- UNIFORM FORM STYLING --- */
        .admin-package-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 650px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
        }

        .admin-form-input,
        .admin-form-textarea {
          width: 100% !important;
          background-color: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px !important;
          padding: 12px 16px !important;
          font-size: 0.95rem !important;
          font-family: inherit !important;
          box-sizing: border-box !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }

        .admin-form-input::placeholder,
        .admin-form-textarea::placeholder {
          color: #64748b !important;
          opacity: 1 !important;
        }

        .admin-form-input:focus,
        .admin-form-textarea:focus {
          outline: none !important;
          border-color: #556B2F !important;
          box-shadow: 0 0 0 3px rgba(85, 107, 47, 0.15) !important;
          background-color: #ffffff !important;
        }

        .admin-form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        /* --- ITINERARY FORM SECTION --- */
        .itinerary-form-section {
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 20px;
          background-color: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .itinerary-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .add-day-btn {
          background-color: #556B2F;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .add-day-btn:hover {
          background-color: #6B8E23;
        }

        .itinerary-day-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .itinerary-day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .day-badge {
          background: #556B2F;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
        }

        .remove-day-btn {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .remove-day-btn:hover {
          background: #dc2626;
          color: white;
        }

        .itinerary-fields {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .form-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-cancel:hover {
          background: #e2e8f0;
        }

        .btn-save {
          padding: 12px 24px;
          background: #556B2F;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }

        .btn-save:hover {
          background: #6B8E23;
          transform: translateY(-1px);
        }

        .add-itinerary-btn { background: #556B2F; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s ease; }
        .add-itinerary-btn:hover { background: #6B8E23; }

        .image-upload-container { border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; background: #f8fafc; text-align: center; }
        .file-input { display: none; }
        .upload-label { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
        .package-thumbnail { width: 60px; height: 40px; object-fit: cover; border-radius: 6px; }
        .view-btn { padding: 6px 14px; border: none; border-radius: 6px; cursor: pointer; background: #e0f2fe; color: #0369a1; font-weight: 600; }
        .view-btn:hover { background: #bae6fd; }

        @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default AdminPackages;