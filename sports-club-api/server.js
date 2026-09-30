const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Body parser & CORS
app.use(express.json());
app.use(cors());

// Mount API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Root endpoint test
app.get('/', (req, res) => {
  res.json({ message: 'Sports Club REST API is running...' });
});

// Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});