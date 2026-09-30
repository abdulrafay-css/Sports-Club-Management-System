const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility reference is required']
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member reference is required']
    },
    bookingDate: {
      type: Date,
      required: [true, 'Date of booking is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required (e.g., 14:00)']
    },
    durationHours: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
      default: 1
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'paid'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);