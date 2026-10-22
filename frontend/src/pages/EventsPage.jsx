import React, { useState, useEffect, useContext } from 'react';
import EventCard from '../components/EventCard';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../api';

/**
 * Task 1, 2, and 4: EventsPage
 * - Fetches events from GET /api/v1/events via useEffect on mount
 * - Maintains 3 states: events, loading, error
 * - Displays loading indicator while in progress, error message on failure
 * - Renders events using reusable EventCard component
 * - Client-side search box filtering events by title with .filter() on render (no new API call)
 * - Booking form managing state: selectedEvent and ticketQuantity (useState)
 * - Submits booking via POST /api/v1/tickets with Bearer token
 */
const EventsPage = () => {
  // Task 4: Maintain three states: events, loading, and error
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Task 2: State management for booking form (at least two states: selectedEvent, ticketQuantity)
  const [selectedEventId, setSelectedEventId] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Booking response states
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState(null);
  const [bookingError, setBookingError] = useState(null);

  const { token } = useContext(AuthContext);

  // Task 4: Retrieve events using GET /api/v1/events on mount with useEffect()
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/events`);
      if (!response.ok) {
        throw new Error(`Failed to fetch events (Status ${response.status})`);
      }
      const json = await response.json();
      setEvents(json.data || []);
      // If none selected yet, auto-select first available event
      if (json.data && json.data.length > 0 && !selectedEventId) {
        const availableFirst = json.data.find(ev => ev.ticketsAvailable > 0);
        if (availableFirst) {
          setSelectedEventId(availableFirst._id);
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading events from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Task 4 Hint: derive the filtered list with .filter() on render without new API call
  const filteredEvents = events.filter((ev) =>
    ev.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Booking Form Submission (Task 2 & Task 3 POST /api/v1/tickets)
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage(null);
    setBookingError(null);

    try {
      const response = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: selectedEventId,
          quantity: Number(ticketQuantity)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Structured JSON error handling from backend
        throw new Error(data.message || 'Failed to book tickets');
      }

      setBookingMessage(`🎉 Success! Booked ${ticketQuantity} ticket(s). Remaining: ${data.remainingTickets}`);
      // Refresh events to show updated ticketsAvailable count immediately
      fetchEvents();
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Available Events</h2>
        <p className="subtitle">Browse upcoming events and book your tickets instantly.</p>
      </div>

      {/* Task 4: Client-side search box */}
      <div className="search-bar-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search events by title (instant filter)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="btn btn-sm btn-outline" onClick={() => setSearchQuery('')}>
            Clear
          </button>
        )}
      </div>

      {/* Task 2: Ticket Booking Form */}
      <div className="card booking-card">
        <h3>🎟️ Book Event Tickets</h3>
        <p className="subtitle">Select an event and specify ticket quantity</p>

        {bookingMessage && <div className="alert alert-success">{bookingMessage}</div>}
        {bookingError && <div className="alert alert-error">{bookingError}</div>}

        <form onSubmit={handleBookingSubmit} className="booking-form-inline">
          <div className="form-group flex-2">
            <label>Select Event</label>
            <select
              className="form-control"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              required
            >
              <option value="">-- Choose an Event --</option>
              {events.map((ev) => (
                <option key={ev._id} value={ev._id} disabled={ev.ticketsAvailable === 0}>
                  {ev.title} ({ev.ticketsAvailable === 0 ? 'SOLD OUT' : `${ev.ticketsAvailable} left`})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label>Quantity</label>
            <input
              type="number"
              min="1"
              max="50"
              className="form-control"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(e.target.value)}
              required
            />
          </div>

          <div className="form-group button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={bookingLoading || !selectedEventId}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>

      {/* Task 4: Display loading indicator while request is in progress */}
      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading events from server...</p>
        </div>
      )}

      {/* Task 4: Display error message if request fails */}
      {error && !loading && (
        <div className="alert alert-error">
          <p>⚠️ Error: {error}</p>
          <button className="btn btn-sm btn-secondary" onClick={fetchEvents} style={{ marginTop: '8px' }}>
            Try Again
          </button>
        </div>
      )}

      {/* Task 4: Render events via EventCard after successful request */}
      {!loading && !error && (
        <>
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <p>No events found matching "{searchQuery}".</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((ev) => (
                <EventCard
                  key={ev._id}
                  title={ev.title}
                  category={ev.category}
                  date={ev.date}
                  venue={ev.venue}
                  ticketsAvailable={ev.ticketsAvailable}
                  onSelect={() => {
                    setSelectedEventId(ev._id);
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventsPage;
