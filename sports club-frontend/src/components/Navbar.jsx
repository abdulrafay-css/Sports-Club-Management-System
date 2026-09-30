import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/facilities" className="nav-brand">
          🏆 SportsClub
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/facilities">Facilities</Link>
              <Link to="/bookings">My Bookings</Link>
              {(user.role === 'admin' || user.role === 'staff') && (
                <Link to="/admin/facilities">Manage Amenities</Link>
              )}
              <span className="user-badge">
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}