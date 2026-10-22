import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Task 2: Navigation Component
 * Contains React Router links to all routes (/ , /events , /my-tickets , /organizer)
 * Prevents full-page reload.
 */
const Navbar = () => {
  const { attendee, token, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-brand">
        <NavLink to="/events" className="brand-logo">
          🎟️ EventHub
        </NavLink>
        <span className="brand-subtitle">CHARUSAT ITUE301</span>
      </div>

      <nav className="navbar-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Login
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Events
        </NavLink>
        <NavLink to="/my-tickets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          My Tickets
        </NavLink>
        <NavLink to="/organizer" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Organizer Panel
        </NavLink>
      </nav>

      <div className="navbar-user">
        {token && attendee ? (
          <div className="user-info">
            <span className="user-name">👤 {attendee.name}</span>
            <span className={`badge role-badge role-${role}`}>{role}</span>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <span className="guest-badge">Not Logged In</span>
        )}
      </div>
    </header>
  );
};

export default Navbar;
