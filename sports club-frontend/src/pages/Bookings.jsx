import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings');
      setBookings(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}`, { status: 'cancelled' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    }
  };

  return (
    <div className="page-container">
      <h2>{user?.role === 'member' ? 'My Reservations' : 'All Club Reservations'}</h2>
      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Facility</th>
                {user?.role !== 'member' && <th>Member</th>}
                <th>Date</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td><strong>{b.facility?.name || 'Deleted'}</strong> ({b.facility?.sportType})</td>
                  {user?.role !== 'member' && (
                    <td>{b.member?.name} <br /><small>{b.member?.email}</small></td>
                  )}
                  <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                  <td>{b.startTime}</td>
                  <td>{b.durationHours} hr(s)</td>
                  <td>${b.totalAmount}</td>
                  <td>
                    <span className={`status-pill status-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                  <td>
                    {user?.role === 'member' ? (
                      b.status !== 'cancelled' && (
                        <button onClick={() => handleCancel(b._id)} className="btn-table-cancel">
                          Cancel
                        </button>
                      )
                    ) : (
                      <div className="action-buttons">
                        {b.status !== 'confirmed' && (
                          <button onClick={() => handleStatusUpdate(b._id, 'confirmed')} className="btn-table-confirm">
                            Confirm
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button onClick={() => handleStatusUpdate(b._id, 'cancelled')} className="btn-table-cancel">
                            Cancel
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}