// backend/models/tourModel.js

import mongoose from 'mongoose';

// Define the blueprint (Schema) for a Tour document
const tourSchema = mongoose.Schema(
    {
        // Name of the tour (e.g., 'Historical Addis Tour')
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
            unique: true, // No two tours can have the same title
        },
        // A short description of the tour
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        // The price of the tour
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        // The duration in days or hours
        duration: {
            type: String,
            required: [true, 'Please add a duration (e.g., 3 Days)'],
        },
        // URL for the main tour image
        image: {
            type: String,
            required: false,
        },
    },
    {
        // Adds 'createdAt' and 'updatedAt' timestamps automatically
        timestamps: true,
    }
);

// Create the Model from the Schema
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;