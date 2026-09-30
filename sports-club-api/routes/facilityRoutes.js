const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(getFacilities)
  .post(protect, authorize('staff', 'admin'), createFacility);

router
  .route('/:id')
  .get(getFacilityById)
  .put(protect, authorize('staff', 'admin'), updateFacility)
  .delete(protect, authorize('admin'), deleteFacility);

module.exports = router;