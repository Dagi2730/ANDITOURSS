import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  numberOfTourists: {
    type: Number,
    required: true,
    min: 1
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  comments: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  isNewBooking: {
    type: Boolean,
    default: true
  },
  isUpdated: {
    type: Boolean,
    default: false
  },
  lastUpdatedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;