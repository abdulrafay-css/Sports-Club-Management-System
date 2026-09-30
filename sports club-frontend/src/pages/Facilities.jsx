import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';

export default function Facilities() {
  const [facilities, setFacilities] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFacility, setActiveFacility] = useState(null);

  // Booking Modal Form State
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [durationHours, setDurationHours] = useState(1);
  const [notes, setNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const url = selectedSport ? `/facilities?sportType=${selectedSport}` : '/facilities';
      const res = await API.get(url);
      setFacilities(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [selectedSport]);

  const handleOpenBooking = (facility) => {
    setActiveFacility(facility);
    setModalError('');
    setModalSuccess('');
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    if (!bookingDate || !startTime) {
      return setModalError('Please pick both date and start time');
    }

    try {
      await API.post('/bookings', {
        facilityId: activeFacility._id,
        bookingDate,
        startTime,
        durationHours: Number(durationHours),
        notes
      });
      setModalSuccess('Booking placed successfully!');
      setTimeout(() => setActiveFacility(null), 1500);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error booking facility');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Available Facilities</h2>
        <div className="filter-group">
          <label>Filter Sport: </label>
          <select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
            <option value="">All Sports</option>
            <option value="Tennis">Tennis</option>
            <option value="Badminton">Badminton</option>
            <option value="Swimming">Swimming</option>
            <option value="Squash">Squash</option>
            <option value="Basketball">Basketball</option>
            <option value="Gym">Gym</option>
            <option value="Football">Football</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading sports amenities...</div>
      ) : (
        <div className="grid-cards">
          {facilities.map((f) => (
            <div key={f._id} className="card">
              <div className="card-tag">{f.sportType}</div>
              <h3>{f.name}</h3>
              <p>Capacity: {f.capacity} players</p>
              <p className="card-price">${f.hourlyRate} / hour</p>
              {f.isMaintenance ? (
                <button className="btn-disabled" disabled>Under Maintenance</button>
              ) : (
                <button onClick={() => handleOpenBooking(f)} className="btn-action">
                  Reserve Court
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {activeFacility && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Reserve {activeFacility.name}</h3>
            <p className="modal-sub">Rate: ${activeFacility.hourlyRate}/hr</p>

            {modalError && <div className="error-alert">{modalError}</div>}
            {modalSuccess && <div className="success-alert">{modalSuccess}</div>}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time (HH:MM)</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Special Notes / Equipment Rent</label>
                <input
                  type="text"
                  placeholder="Need racquets or balls"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="modal-total">
                Total: <strong>${activeFacility.hourlyRate * durationHours}</strong>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setActiveFacility(null)} className="btn-cancel">
                  Close
                </button>
                <button type="submit" className="btn-submit">
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}