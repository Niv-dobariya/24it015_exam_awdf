import React from 'react';

/**
 * Task 1: Reusable EventCard Component
 * Accepts props: title, category, date, venue, ticketsAvailable.
 * Displays all 5 values.
 * If ticketsAvailable is 0, renders a "Sold Out" badge instead of a "Book" button.
 */
const EventCard = ({ title, category, date, venue, ticketsAvailable, onSelect }) => {
  // Hint: keep the sold-out check as a simple conditional at the top of the component
  const isSoldOut = ticketsAvailable === 0;

  const formattedDate = date ? new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'TBA';

  return (
    <div className="event-card">
      <div className="event-card-header">
        <h3 className="event-card-title">{title}</h3>
        <span className="badge category-badge">{category || 'General'}</span>
      </div>

      <div className="event-card-body">
        <p><strong>📅 Date:</strong> {formattedDate}</p>
        <p><strong>📍 Venue:</strong> {venue}</p>
        <p><strong>🎟️ Tickets Available:</strong> {ticketsAvailable}</p>
      </div>

      <div className="event-card-footer">
        {isSoldOut ? (
          <span className="badge sold-out-badge">Sold Out</span>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onSelect && onSelect()}
          >
            Book
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
