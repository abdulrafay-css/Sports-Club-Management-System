const Facility = require('../models/Facility');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Public / Authenticated
exports.getFacilities = async (req, res) => {
  try {
    const filter = {};
    if (req.query.sportType) {
      filter.sportType = req.query.sportType;
    }
    const facilities = await Facility.find(filter);
    res.status(200).json({ success: true, count: facilities.length, data: facilities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single facility
// @route   GET /api/facilities/:id
// @access  Public / Authenticated
exports.getFacilityById = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new facility
// @route   POST /api/facilities
// @access  Private (Staff/Admin)
exports.createFacility = async (req, res) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private (Staff/Admin)
exports.updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, data: facility });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private (Admin only)
exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }
    res.status(200).json({ success: true, message: 'Facility removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};