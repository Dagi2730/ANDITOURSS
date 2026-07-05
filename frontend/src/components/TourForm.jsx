// frontend/src/components/TourForm.jsx

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTour, reset } from '../features/tour/tourSlice.js';
import { toast } from 'react-toastify';

function TourForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        duration: '',
        price: '',
        highlights: '',
        travelDetails: '',
        imageUrl: '',
        itinerary: [{ day: 1, title: '', description: '' }],
        status: 'active'
    });

    const dispatch = useDispatch();
    const { isError, isSuccess, message } = useSelector((state) => state.tour);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Tour successfully created!');
            // Reset form after success
            setFormData({
                name: '',
                description: '',
                duration: '',
                price: '',
                highlights: '',
                travelDetails: '',
                imageUrl: '',
                itinerary: [{ day: 1, title: '', description: '' }],
                status: 'active'
            });
        }
        dispatch(reset());
    }, [isError, isSuccess, message, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItineraryChange = (index, field, value) => {
        const updatedItinerary = [...formData.itinerary];
        updatedItinerary[index][field] = value;
        setFormData(prev => ({ ...prev, itinerary: updatedItinerary }));
    };

    const addItineraryDay = () => {
        const newDay = { 
            day: formData.itinerary.length + 1, 
            title: '', 
            description: '' 
        };
        setFormData(prev => ({ 
            ...prev, 
            itinerary: [...prev.itinerary, newDay] 
        }));
    };

    const removeItineraryDay = (index) => {
        if (formData.itinerary.length > 1) {
            const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
            // Re-number the days
            const renumberedItinerary = updatedItinerary.map((item, i) => ({
                ...item,
                day: i + 1
            }));
            setFormData(prev => ({ ...prev, itinerary: renumberedItinerary }));
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.duration || !formData.price) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Filter out empty itinerary items
        const filteredItinerary = formData.itinerary.filter(item => 
            item.title.trim() !== '' && item.description.trim() !== ''
        );

        // Dispatch with all fields
        dispatch(createTour({ 
            name: formData.name,
            description: formData.description, 
            duration: formData.duration,
            price: Number(formData.price),
            highlights: formData.highlights || '',
            travelDetails: formData.travelDetails || '',
            imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            itinerary: filteredItinerary.length > 0 ? filteredItinerary : [],
            status: formData.status
        }));
    };

    return (
        <section className='form-section'>
            <h3>Create New Tour Package</h3>
            <form onSubmit={onSubmit}>
                {/* Package Name */}
                <div className='form-group'>
                    <label htmlFor='name'>Package Name *</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Tour Name (e.g., Simien Mountains Trek)'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Description */}
                <div className='form-group'>
                    <label htmlFor='description'>Description *</label>
                    <textarea
                        id='description'
                        name='description'
                        placeholder='Brief description of the tour package...'
                        value={formData.description}
                        onChange={handleInputChange}
                        rows='4'
                        required
                    ></textarea>
                </div>

                {/* Duration */}
                <div className='form-group'>
                    <label htmlFor='duration'>Duration *</label>
                    <input
                        type='text'
                        id='duration'
                        name='duration'
                        placeholder='Duration (e.g., 7 days)'
                        value={formData.duration}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Price */}
                <div className='form-group'>
                    <label htmlFor='price'>Price ($) *</label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Price (e.g., 1250)'
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Highlights Section */}
                <div className='form-group'>
                    <label htmlFor='highlights'>Highlights</label>
                    <textarea
                        id='highlights'
                        name='highlights'
                        placeholder='Key features and attractions (e.g., Breathtaking mountain views, wildlife spotting, traditional villages)'
                        value={formData.highlights}
                        onChange={handleInputChange}
                        rows='3'
                    ></textarea>
                    <small>List the main highlights and attractions of this tour</small>
                </div>

                {/* Travel Details Section */}
                <div className='form-group'>
                    <label htmlFor='travelDetails'>Travel Details</label>
                    <textarea
                        id='travelDetails'
                        name='travelDetails'
                        placeholder='Accommodation, transportation, inclusions (e.g., Accommodation in mountain lodges, all meals included, transportation)'
                        value={formData.travelDetails}
                        onChange={handleInputChange}
                        rows='3'
                    ></textarea>
                    <small>Include accommodation type, transportation, meals, and other inclusions</small>
                </div>

                {/* Image URL */}
                <div className='form-group'>
                    <label htmlFor='imageUrl'>Image URL</label>
                    <input
                        type='url'
                        id='imageUrl'
                        name='imageUrl'
                        placeholder='https://images.unsplash.com/photo-...'
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                    />
                    <small>Leave empty to use default image</small>
                </div>

                {/* Itinerary Section */}
                <div className='form-group'>
                    <label>Tour Itinerary (Day-by-Day)</label>
                    <div style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '8px', 
                        padding: '15px', 
                        backgroundColor: '#f9f9f9',
                        marginTop: '10px'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>Daily Schedule</h4>
                            <button 
                                type='button'
                                onClick={addItineraryDay}
                                style={{
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    padding: '6px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                + Add Day
                            </button>
                        </div>
                        
                        {formData.itinerary.map((item, index) => (
                            <div key={index} style={{
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '6px',
                                padding: '15px',
                                marginBottom: '10px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}>
                                    <h5 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>
                                        Day {item.day}
                                    </h5>
                                    {formData.itinerary.length > 1 && (
                                        <button 
                                            type='button'
                                            onClick={() => removeItineraryDay(index)}
                                            style={{
                                                background: '#ffebee',
                                                color: '#c62828',
                                                border: 'none',
                                                padding: '4px 10px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={item.title}
                                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                        placeholder='Day Title (e.g., Arrival in Gondar)'
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px'
                                        }}
                                    />
                                    <textarea
                                        className='form-control'
                                        value={item.description}
                                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                        rows='2'
                                        placeholder='Day description and activities...'
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <small>Add detailed day-by-day itinerary for the tour</small>
                </div>

                {/* Status */}
                <div className='form-group'>
                    <label htmlFor='status'>Status</label>
                    <select
                        id='status'
                        name='status'
                        value={formData.status}
                        onChange={handleInputChange}
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            width: '100%'
                        }}
                    >
                        <option value='active'>Active</option>
                        <option value='inactive'>Inactive</option>
                    </select>
                </div>
                
                <div className='form-group'>
                    <button type='submit' className='btn btn-primary'>
                        Create Tour Package
                    </button>
                </div>
            </form>
        </section>
    );
}

export default TourForm;
