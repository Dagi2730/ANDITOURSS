// frontend/src/components/TourForm.jsx (ERROR-FREE PAYLOAD)

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTour, reset } from '../features/tour/tourSlice.js';
import { toast } from 'react-toastify';

function TourForm() {
    // STATE: Using 'name' locally, but will map to 'title' in dispatch
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');

    const dispatch = useDispatch();

    const { isError, isSuccess, message } = useSelector(
        (state) => state.tour
    );

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Tour successfully created!');
        }
        dispatch(reset()); 

    }, [isError, isSuccess, message, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!name || !description || !duration || !price) {
            toast.error('Please fill in all fields');
            return;
        }

        // DISPATCH: Correcting the two payload errors
        dispatch(createTour({ 
            title: name, // <-- FIX 1: Send as 'title' to match backend model
            description, 
            duration: duration, // <-- FIX 2: Send as a String (as per your model: '3 Days')
            price: Number(price), // <-- Send price as a Number
        }));

        // Clear form fields
        setName('');
        setDescription('');
        setDuration('');
        setPrice('');
    };

    return (
        <section className='form-section'>
            <h3>Create New Tour</h3>
            <form onSubmit={onSubmit}>
                {/* Name (input uses 'name' state) */}
                <div className='form-group'>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        placeholder='Tour Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div className='form-group'>
                    <textarea
                        id='description'
                        name='description'
                        placeholder='Tour Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>

                {/* Duration (Days) */}
                <div className='form-group'>
                    <input
                        // Changed type to 'text' to prevent browser sending 0 if left blank
                        type='text' 
                        id='duration'
                        name='duration'
                        placeholder='Duration (e.g., 3 Days)'
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                </div>

                {/* Price */}
                <div className='form-group'>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        placeholder='Price ($)'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                
                <div className='form-group'>
                    <button type='submit' className='btn btn-primary'>
                        Add Tour
                    </button>
                </div>
            </form>
        </section>
    );
}

export default TourForm;