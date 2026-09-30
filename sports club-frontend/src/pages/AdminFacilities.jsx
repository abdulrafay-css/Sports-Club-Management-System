import React, { useState, useEffect } from 'react';
import API from '../api/axiosClient';

export default function AdminFacilities() {
  const [facilities, setFacilities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sportType: 'Tennis',
    hourlyRate: '',
    capacity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const res = await API.get('/facilities');
      setFacilities(res.data.data);
    } catch (err) {
      setError('Could not load facilities');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.hourlyRate || !formData.capacity) {
      return setError('Please populate all facility details');
    }

    try {
      await API.post('/facilities', {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        capacity: Number(formData.capacity)
      });
      setSuccess('Facility created successfully!');
      setFormData({ name: '', sportType: 'Tennis', hourlyRate: '', capacity: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating facility');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this facility completely?')) return;
    try {
      await API.delete(`/facilities/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting facility');
    }
  };

  return (
    <div className="page-container">
      <h2>Manage Sports Facilities</h2>
      {error && <div className="error-alert">{error}</div>}
      {success && <div className="success-alert">{success}</div>}

      <div className="admin-grid">
        <form onSubmit={handleCreate} className="admin-form">
          <h3>Add New Facility</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Squash Court 2"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sport</label>
            <select name="sportType" value={formData.sportType} onChange={handleChange}>
              <option value="Tennis">Tennis</option>
              <option value="Badminton">Badminton</option>
              <option value="Swimming">Swimming</option>
              <option value="Squash">Squash</option>
              <option value="Basketball">Basketball</option>
              <option value="Gym">Gym</option>
              <option value="Football">Football</option>
            </select>
          </div>

          <div className="form-group">
            <label>Hourly Rate ($)</label>
            <input
              type="number"
              name="hourlyRate"
              placeholder="25"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              placeholder="4"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit">Add Facility</button>
        </form>

        <div className="admin-list">
          <h3>Active Inventory</h3>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sport</th>
                  <th>Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((fac) => (
                  <tr key={fac._id}>
                    <td>{fac.name}</td>
                    <td>{fac.sportType}</td>
                    <td>${fac.hourlyRate}/hr</td>
                    <td>
                      <button onClick={() => handleDelete(fac._id)} className="btn-table-cancel">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}