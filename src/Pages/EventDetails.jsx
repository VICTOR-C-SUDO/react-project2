import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API_URL =
    "https://event-hub-olive-six.vercel.app/api/v1/events/";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    // GET ONE EVENT
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                console.log("EVENT UID FROM URL:", id);

                const response = await fetch(
                    `${API_URL}${id}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Event not found (${response.status})`
                    );
                }

                const data = await response.json();

                console.log("SINGLE EVENT:", data);

                setEvent(data);
            } catch (err) {
                console.error(
                    "FETCH EVENT ERROR:",
                    err
                );

                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        } else {
            setError("No event ID was provided.");
            setLoading(false);
        }
    }, [id]);

    // ADD / REMOVE FAVORITE
    const handleFavorite = () => {
        if (!event) return;

        const favorites =
            JSON.parse(
                localStorage.getItem(
                    "eventhubFavorites"
                )
            ) || [];

        const alreadyFavorite =
            favorites.some(
                (favorite) =>
                    favorite.uid === event.uid
            );

        if (alreadyFavorite) {
            const updatedFavorites =
                favorites.filter(
                    (favorite) =>
                        favorite.uid !== event.uid
                );

            localStorage.setItem(
                "eventhubFavorites",
                JSON.stringify(
                    updatedFavorites
                )
            );

            alert(
                "Event removed from favorites."
            );
        } else {
            const updatedFavorites = [
                ...favorites,
                event,
            ];

            localStorage.setItem(
                "eventhubFavorites",
                JSON.stringify(
                    updatedFavorites
                )
            );

            alert(
                "Event added to favorites."
            );
        }
    };

   
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            const response = await fetch(
                `${API_URL}${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Failed to delete event (${response.status})`
                );
            }

            alert(
                "Event deleted successfully."
            );

            navigate("/events");
        } catch (err) {
            console.error(
                "DELETE EVENT ERROR:",
                err
            );

            alert(err.message);
        } finally {
            setDeleting(false);
        }
    };

    // LOADING
    if (loading) {
        return (
            <main className="loading-container page-loading">
                <div className="spinner"></div>

                <p>
                    Loading event...
                </p>
            </main>
        );
    }

    // ERROR
    if (error) {
        return (
            <main className="error-container">
                <h2>
                    Event Not Found
                </h2>

                <p>{error}</p>

                <Link
                    to="/events"
                    className="back-button"
                >
                    ← Back to Events
                </Link>
            </main>
        );
    }


    if (!event) {
        return (
            <main className="error-container">
                <h2>
                    Event Not Found
                </h2>

                <Link
                    to="/events"
                    className="back-button"
                >
                    ← Back to Events
                </Link>
            </main>
        );
    }

    return (
        <main className="event-details-page">

            <div className="event-details-container">

                {/* EVENT IMAGE */}

                {event.images &&
                event.images.length > 0 ? (
                    <img
                        src={event.images[0]}
                        alt={event.name}
                        className="event-details-image"
                    />
                ) : (
                    <div className="event-details-placeholder">
                        ✦
                    </div>
                )}

                {/* EVENT CONTENT */}

                <div className="event-details-content">

                    <div className="event-details-heading">

                        <span className="event-category">
                            {event.category}
                        </span>

                        <span
                            className={`event-status ${event.status}`}
                        >
                            {event.status}
                        </span>

                    </div>

                    <h1>
                        {event.name}
                    </h1>

                    <p className="event-description">
                        {event.description ||
                            "No description available for this event."}
                    </p>

                    {/* EVENT INFORMATION */}

                    <div className="event-info">

                        <p>
                            📅{" "}
                            <strong>
                                Date:
                            </strong>{" "}
                            {event.date
                                ? new Date(
                                      event.date
                                  ).toLocaleDateString(
                                      undefined,
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : "Date TBA"}
                        </p>

                        <p>
                            ⏰{" "}
                            <strong>
                                Time:
                            </strong>{" "}
                            {event.event_time ||
                                "Time TBA"}
                        </p>

                        <p>
                            📍{" "}
                            <strong>
                                Location:
                            </strong>{" "}
                            {event.location ||
                                "Location TBA"}
                        </p>

                        <p>
                            👤{" "}
                            <strong>
                                Organizer:
                            </strong>{" "}
                            {event.organizer ||
                                "Organizer TBA"}
                        </p>

                        <p>
                            🎟️{" "}
                            <strong>
                                Capacity:
                            </strong>{" "}
                            {event.capacity ??
                                "N/A"}
                        </p>

                        <p>
                            👥{" "}
                            <strong>
                                Registered:
                            </strong>{" "}
                            {event.registered ??
                                0}
                        </p>

                        <p>
                            💰{" "}
                            <strong>
                                Price:
                            </strong>{" "}
                            {event.price === 0
                                ? "Free"
                                : `₦${event.price}`}
                        </p>

                        <p>
                            🔖{" "}
                            <strong>
                                Status:
                            </strong>{" "}
                            {event.status ||
                                "N/A"}
                        </p>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="event-details-actions">

                        <Link
                            to="/events"
                            className="back-button"
                        >
                            ← Back to Events
                        </Link>

                        <Link
                            to={`/register/${event.uid}`}
                            className="register-button"
                        >
                            Register for Event
                        </Link>

                        <button
                            type="button"
                            className="favorite-button"
                            onClick={
                                handleFavorite
                            }
                        >
                            ♡ Favorite
                        </button>

                        <Link
                            to={`/events/${event.uid}/edit`}
                            className="edit-button"
                        >
                            Edit Event
                        </Link>

                        <button
                            type="button"
                            className="delete-button"
                            onClick={
                                handleDelete
                            }
                            disabled={deleting}
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Event"}
                        </button>

                    </div>

                </div>
            </div>

        </main>
    );
};

export default EventDetails;