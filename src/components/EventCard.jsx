import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
    return (
        <article className="event-card">

            {event.images && event.images.length > 0 ? (
                <img
                    src={event.images[0]}
                    alt={event.name}
                    className="event-card-image"
                />
            ) : (
                <div className="event-card-image event-image-placeholder">
                    ✦
                </div>
            )}

            <div className="event-card-content">

                <div className="event-card-top">
                    <span className="event-category">
                        {event.category}
                    </span>

                    <span className={`event-status ${event.status}`}>
                        {event.status}
                    </span>
                </div>

                <h3>{event.name}</h3>

                <p className="event-card-description">
                    {event.description || "No description available."}
                </p>

                <div className="event-card-info">
                    <span>
                        📅{" "}
                        {event.date
                            ? new Date(event.date).toLocaleDateString()
                            : "Date TBA"}
                    </span>

                    <span>
                        📍 {event.location || "Location TBA"}
                    </span>
                </div>

                <div className="event-card-footer">

                    <span className="event-price">
                        {event.price === 0
                            ? "Free"
                            : `₦${event.price}`}
                    </span>

                    <Link
                        to={`/events/${event.uid}`}
                        className="view-details-button"
                    >
                        View Details →
                    </Link>

                </div>

            </div>

        </article>
    );
};

export default EventCard;