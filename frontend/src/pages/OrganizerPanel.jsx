import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../api';

/**
 * Task 2: OrganizerPanel (Lazy Loaded Component)
 * Accessible only by users with role: 'organizer'
 * Allows creating new events via POST /api/v1/events
 */
const OrganizerPanel = () => {
  const { attendee, token, role } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [ticketsAvailable, setTicketsAvailable] = useState(100);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          date,
          venue,
          ticketsAvailable: Number(ticketsAvailable)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      setMessage(`🎉 Event "${data.data.title}" successfully created!`);
      // Reset form
      setTitle('');
      setDate('');
      setVenue('');
      setTicketsAvailable(100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>🎪 Organizer Management Panel</h2>
        <p className="subtitle">
          Welcome, <strong>{attendee?.name}</strong>. Role verified:{' '}
          <span className="badge role-badge role-organizer">{role}</span>
        </p>
      </div>

      <div className="card form-card">
        <h3>Create New Event</h3>
        <p className="subtitle">Fill out the details below to publish an event on EventHub.</p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleCreateEvent} className="form">
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              required
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CHARUSAT Hackathon 2026"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Technology">Technology</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Cultural">Cultural</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label>Event Date & Time *</label>
              <input
                type="datetime-local"
                required
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label>Venue *</label>
              <input
                type="text"
                required
                className="form-control"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. CSPIT Seminar Hall"
              />
            </div>

            <div className="form-group flex-1">
              <label>Total Tickets Available * (min: 0)</label>
              <input
                type="number"
                min="0"
                required
                className="form-control"
                value={ticketsAvailable}
                onChange={(e) => setTicketsAvailable(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing Event...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerPanel;
