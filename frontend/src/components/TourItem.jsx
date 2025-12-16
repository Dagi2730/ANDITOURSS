import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTour, updateTour } from '../features/tour/tourSlice.js';

function TourItem({ tour, showActions }) {
    const dispatch = useDispatch();

    // Local state for editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: tour.title,
        description: tour.description,
        price: tour.price,
        duration: tour.duration,
    });

    const { title, description, price, duration } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onDelete = () => {
        if (window.confirm('Are you sure you want to delete this tour?')) {
            dispatch(deleteTour(tour._id));
        }
    };

    const onUpdateSubmit = (e) => {
        e.preventDefault();
        dispatch(updateTour({ id: tour._id, tourData: formData }));
        setIsEditing(false);
    };

    // --- EDIT MODE UI ---
    if (isEditing) {
        return (
            <div className='tour-card' style={{ border: '2px solid orange', padding: '15px', margin: '10px' }}>
                <form onSubmit={onUpdateSubmit}>
                    <input type="text" name="title" value={title} onChange={onChange} style={{ display: 'block', width: '100%' }} />
                    <textarea name="description" value={description} onChange={onChange} style={{ display: 'block', width: '100%', margin: '10px 0' }} />
                    <input type="number" name="price" value={price} onChange={onChange} />
                    <input type="number" name="duration" value={duration} onChange={onChange} />
                    
                    <div style={{ marginTop: '10px' }}>
                        <button type="submit" className='btn btn-success'>Save Changes</button>
                        <button type="button" onClick={() => setIsEditing(false)} className='btn'>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }

    // --- VIEW MODE UI ---
    return (
        <div className='tour-card' style={{ border: '1px solid #ddd', padding: '15px', margin: '10px', borderRadius: '8px' }}>
            <h3>{tour.title}</h3>
            <p>{tour.description}</p>
            <p><strong>Price:</strong> ${tour.price} | <strong>Duration:</strong> {tour.duration} Days</p>
            
            {/* If showActions is passed as true from AdminDashboard, buttons WILL show */}
            {showActions && (
                <div className='tour-actions' style={{ marginTop: '10px' }}>
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className='btn btn-secondary' 
                        style={{ marginRight: '10px', backgroundColor: '#6c757d', color: 'white' }}
                    >
                        Edit
                    </button>
                    <button 
                        onClick={onDelete} 
                        className='btn btn-danger' 
                        style={{ backgroundColor: '#dc3545', color: 'white' }}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default TourItem;