import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../components/EventContext";
import "./EventContent.css";

const API_URL =
    "https://event-hub-olive-six.vercel.app/api/v1/events/";

function EventContent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { deleteEvent } = useEvents();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // GET SINGLE EVENT
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                console.log(
                    "EVENT UID FROM URL:",
                    id
                );

                const response = await fetch(
                    `${API_URL}${id}?refresh=${Date.now()}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                        },
                        cache: "no-store",
                    }
                );

                console.log(
                    "EVENT RESPONSE STATUS:",
                    response.status
                );

                const data = await response.json();

                console.log(
                    "FRESH EVENT FROM API:",
                    data
                );

                if (!response.ok) {
                    throw new Error(
                        Array.isArray(data.detail)
                            ? JSON.stringify(data.detail)
                            : data.detail ||
                              "Event not found"
                    );
                }

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
        }
    }, [id]);

    // DELETE
    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteEvent(id);

            // Go back to all events immediately
            navigate("/events", {
                replace: true,
            });
        } catch (err) {
            console.error(
                "DELETE ERROR:",
                err
            );
        }
    };

    if (loading) {
        return (
            <div className="event-loading">
                Loading event...
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="event-error">
                <h2>Event Not Found</h2>

                <p>
                    This event may have been
                    deleted or no longer exists.
                </p>

                <Link to="/events">
                    ← Back to Events
                </Link>
            </div>
        );
    }

    const availableSeats =
        Number(event.capacity || 0) -
        Number(event.registered || 0);

    return (
        <main className="event-content-page">

            {/* BACK */}
            <Link
                to="/events"
                className="event-back"
            >
                ← Back to Events
            </Link>

            {/* HERO */}
            <section className="event-hero">

                <div className="event-badges">

                    <span className="event-category">
                        {event.category}
                    </span>

                    <span className="event-status">
                        {event.status}
                    </span>

                </div>

                <h1>
                    {event.name}
                </h1>

                <p>
                    {event.description}
                </p>

            </section>

            {/* MAIN CONTENT */}
            <div className="event-details-layout">

                {/* LEFT */}
                <section className="event-main-info">

                    <h2>
                        Event Information
                    </h2>

                    <div className="event-info-grid">

                        <div className="event-info-item">
                            <span>Date</span>

                            <strong>
                                {event.date
                                    ? new Date(
                                          event.date
                                      ).toLocaleDateString(
                                          "en-US",
                                          {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          }
                                      )
                                    : "Not specified"}
                            </strong>
                        </div>

                        <div className="event-info-item">
                            <span>Time</span>

                            <strong>
                                {event.event_time ||
                                    "Not specified"}
                            </strong>
                        </div>

                        <div className="event-info-item">
                            <span>Location</span>

                            <strong>
                                {event.location ||
                                    "Not specified"}
                            </strong>
                        </div>

                        <div className="event-info-item">
                            <span>Organizer</span>

                            <strong>
                                {event.organizer ||
                                    "Not specified"}
                            </strong>
                        </div>

                    </div>

                    <div className="event-about">

                        <h2>
                            About This Event
                        </h2>

                        <p>
                            {event.description}
                        </p>

                    </div>

                </section>

                {/* RIGHT */}
                <aside className="event-sidebar">

                    <div className="ticket-card">

                        <span>
                            Ticket Price
                        </span>

                        <h2>
                            {Number(event.price || 0) ===
                            0
                                ? "Free"
                                : `₦${Number(
                                      event.price
                                  ).toLocaleString()}`}
                        </h2>

                        <Link
                            to={`/register/${event.uid}`}
                            className="register-btn"
                        >
                            Register
                        </Link>

                    </div>

                    <div className="event-stats">

                        <div>
                            <span>
                                Capacity
                            </span>

                            <strong>
                                {event.capacity || 0}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Registered
                            </span>

                            <strong>
                                {event.registered || 0}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Available
                            </span>

                            <strong>
                                {availableSeats}
                            </strong>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="event-actions">

                        <Link
                            to={`/events/${event.uid}/edit`}
                            className="edit-event-btn"
                        >
                            Edit Event
                        </Link>

                        <button
                            type="button"
                            className="delete-event-btn"
                            onClick={handleDelete}
                        >
                            Delete Event
                        </button>

                    </div>

                </aside>

            </div>

        </main>
    );
}

export default EventContent;