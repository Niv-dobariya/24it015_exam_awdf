import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_BASE } from '../api';

/**
 * Task 2 & Task 3: MyTicketsPage (Protected Route)
 * Fetches attendee's own booked tickets via GET /api/v1/tickets/my
 * Demonstrates populated attendee and event fields
 * Allows updating status via PATCH /api/v1/tickets/:id/status
 */
const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  const { token, attendee } = useContext(AuthContext);

  const fetchMyTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/tickets/my`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to load tickets (Status ${response.status})`);
      }

      const json = await response.json();
      setTickets(json.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching your tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [token]);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      setActionMessage(null);
      const response = await fetch(`${API_BASE}/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update ticket status');
      }

      setActionMessage(`Ticket updated to '${newStatus}'`);
      fetchMyTickets();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>My Booked Tickets</h2>
        <p className="subtitle">
          Tickets booked by <strong>{attendee ? attendee.name : 'You'}</strong> ({attendee?.email})
        </p>
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your tickets...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          <p>⚠️ {error}</p>
          <button className="btn btn-sm btn-secondary" onClick={fetchMyTickets} style={{ marginTop: '8px' }}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {tickets.length === 0 ? (
            <div className="empty-state">
              <p>You have not booked any tickets yet.</p>
              <a href="/events" className="btn btn-primary" style={{ marginTop: '12px' }}>
                Browse Events to Book
              </a>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((t) => (
                <div key={t._id} className="ticket-item-card">
                  <div className="ticket-item-header">
                    <h4>{t.eventId?.title || 'Unknown Event'}</h4>
                    <span className={`badge status-badge status-${t.status}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="ticket-item-body">
                    <p><strong>📍 Venue:</strong> {t.eventId?.venue || 'N/A'}</p>
                    <p>
                      <strong>📅 Event Date:</strong>{' '}
                      {t.eventId?.date ? new Date(t.eventId.date).toLocaleString() : 'N/A'}
                    </p>
                    <p><strong>🎟️ Quantity Booked:</strong> {t.quantity}</p>
                    <p>
                      <strong>🕒 Booked On:</strong>{' '}
                      {t.bookingDate ? new Date(t.bookingDate).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="small-text">
                      <strong>👤 Booked By:</strong> {t.attendeeId?.name} ({t.attendeeId?.email})
                    </p>
                    <p className="small-text">
                      <strong>🆔 Ticket ID:</strong> <code>{t._id}</code>
                    </p>
                  </div>

                  <div className="ticket-item-actions">
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>Update Status:</span>
                    {t.status !== 'cancelled' && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleStatusChange(t._id, 'cancelled')}
                      >
                        Cancel Ticket
                      </button>
                    )}
                    {t.status !== 'used' && (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleStatusChange(t._id, 'used')}
                      >
                        Mark as Used
                      </button>
                    )}
                    {t.status !== 'booked' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleStatusChange(t._id, 'booked')}
                      >
                        Reactivate (Booked)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTicketsPage;
