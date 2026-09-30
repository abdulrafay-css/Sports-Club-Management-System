const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true
    },
    sportType: {
      type: String,
      required: [true, 'Sport category is required'],
      enum: ['Tennis', 'Badminton', 'Swimming', 'Squash', 'Basketball', 'Gym', 'Football']
    },
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      default: 0
    },
    capacity: {
      type: Number,
      default: 2
    },
    isMaintenance: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);