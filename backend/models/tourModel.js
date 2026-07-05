import mongoose from 'mongoose';

const itineraryDaySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  highlights: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  travelDetails: {
    type: String,
    default: ''
  },
  itinerary: [itineraryDaySchema],
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;