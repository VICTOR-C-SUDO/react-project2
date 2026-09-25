import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../components/EventContext";

const API_URL = "https://event-hub-olive-six.vercel.app/api/v1/events/";

function EventContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteEvent } = useEvents();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}${id}`);

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();
        setEvent(data);

        const savedFavorites =
          JSON.parse(localStorage.getItem("favoriteEvents")) || [];

        setFavorite(savedFavorites.includes(data.uid));
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const toggleFavorite = () => {
    if (!event) return;

    const savedFavorites =
      JSON.parse(localStorage.getItem("favoriteEvents")) || [];

    let updatedFavorites;

    if (savedFavorites.includes(event.uid)) {
      updatedFavorites = savedFavorites.filter(
        (uid) => uid !== event.uid
      );
      setFavorite(false);
    } else {
      updatedFavorites = [...savedFavorites, event.uid];
      setFavorite(true);
    }

    localStorage.setItem(
      "favoriteEvents",
      JSON.stringify(updatedFavorites)
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteEvent(event.uid);

      alert("Event deleted successfully.");
      navigate("/events");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="event-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-not-found">
        <div className="not-found-icon">!</div>
        <h2>Event Not Found</h2>
        <p>
          This event may have been deleted or is no longer available.
        </p>

        <Link to="/events" className="back-events-btn">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";

  return (
    <main className="event-details-page">

      {/* Top navigation */}
      <div className="event-details-top">
        <Link to="/events" className="back-link">
          ← Back to Events
        </Link>

        <button
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={toggleFavorite}
        >
          {favorite ? "♥" : "♡"}{" "}
          {favorite ? "Saved" : "Save Event"}
        </button>
      </div>

      {/* Main event card */}
      <section className="event-details-card">

        {/* Event image */}
        <div className="event-details-image">
          {event.images && event.images.length > 0 ? (
            <img
              src={event.images[0]}
              alt={event.name}
            />
          ) : (
            <div className="event-image-placeholder">
              <span>EVENT</span>
            </div>
          )}

          <div className="event-image-overlay"></div>

          <div className="event-category-badge">
            {event.category}
          </div>
        </div>

        {/* Event information */}
        <div className="event-details-content">

          <div className="event-heading">
            <div>
              <span
                className={`event-status ${event.status}`}
              >
                {event.status}
              </span>

              <h1>{event.name}</h1>
            </div>
          </div>

          <p className="event-description">
            {event.description || "No description available for this event."}
          </p>

          {/* Event information grid */}
          <div className="event-info-grid">

            <div className="event-info-item">
              <span className="info-icon">📅</span>
              <div>
                <small>Date</small>
                <strong>{eventDate}</strong>
              </div>
            </div>

            <div className="event-info-item">
              <span className="info-icon">⏰</span>
              <div>
                <small>Time</small>
                <strong>{event.event_time || "Not specified"}</strong>
              </div>
            </div>

            <div className="event-info-item">
              <span className="info-icon">📍</span>
              <div>
                <small>Location</small>
                <strong>{event.location}</strong>
              </div>
            </div>

            <div className="event-info-item">
              <span className="info-icon">👤</span>
              <div>
                <small>Organizer</small>
                <strong>{event.organizer}</strong>
              </div>
            </div>

            <div className="event-info-item">
              <span className="info-icon">👥</span>
              <div>
                <small>Capacity</small>
                <strong>
                  {event.registered || 0} / {event.capacity}
                </strong>
              </div>
            </div>

            <div className="event-info-item">
              <span className="info-icon">💳</span>
              <div>
                <small>Price</small>
                <strong>
                  {Number(event.price) === 0
                    ? "Free"
                    : `₦${Number(event.price).toLocaleString()}`}
                </strong>
              </div>
            </div>

          </div>

          {/* Bottom actions */}
          <div className="event-actions">

            <Link
              to={`/register/${event.uid}`}
              className="register-event-btn"
            >
              Register for Event
              <span>→</span>
            </Link>

            <Link
              to={`/events/${event.uid}/edit`}
              className="edit-event-btn"
            >
              Edit Event
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="delete-event-btn"
            >
              {deleting ? "Deleting..." : "Delete Event"}
            </button>

          </div>

        </div>
      </section>

    </main>
  );
}

export default EventContent;