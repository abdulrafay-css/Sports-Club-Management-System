const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All booking operations require an authenticated user
router.use(protect);

router
  .route('/')
  .post(createBooking)
  .get(getBookings);

router
  .route('/:id')
  .get(getBookingById)
  .put(updateBooking)
  .delete(authorize('admin'), deleteBooking);

module.exports = router;