import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEvents } from "../components/EventContext";

const API_URL = "https://event-hub-olive-six.vercel.app/api/v1/events/";

function Register() {
    const { id } = useParams();
    const { events } = useEvents();

    const [event, setEvent] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                // First check events already loaded in context
                const existingEvent = events?.find(
                    (item) => item.uid === id
                );

                if (existingEvent) {
                    setEvent(existingEvent);
                    setLoading(false);
                    return;
                }

                // If not found, fetch directly from the API
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

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        Array.isArray(data.detail)
                            ? JSON.stringify(data.detail)
                            : data.detail || "Failed to load event"
                    );
                }

                setEvent(data);
            } catch (err) {
                console.error("FETCH EVENT ERROR:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, events]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim() || !email.trim()) {
            setError("Please enter your name and email.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(`${API_URL}${id}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                }),
            });

            const data = await response.json();

            console.log("REGISTRATION RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.detail)
                        ? JSON.stringify(data.detail)
                        : data.detail || "Registration failed"
                );
            }

            setSuccess(
                "Registration successful! You are now registered for this event."
            );

            setName("");
            setEmail("");
        } catch (err) {
            console.error("REGISTRATION ERROR:", err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="register-loading">
                <p>Loading event...</p>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="register-page">
                <Link to="/events" className="register-back">
                    ← Back to Events
                </Link>

                <div className="register-error">
                    {error}
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="register-page">
                <Link to="/events" className="register-back">
                    ← Back to Events
                </Link>

                <div className="register-error">
                    Event not found.
                </div>
            </div>
        );
    }

    const availableSeats =
        Number(event.capacity || 0) - Number(event.registered || 0);

    return (
        <main className="register-page">

            <Link to={`/events/${event.uid}`} className="register-back">
                ← Back to Event
            </Link>

            <div className="register-container">

                {/* LEFT SIDE */}
                <section className="register-intro">

                    <div className="register-label">
                        Event Registration
                    </div>

                    <h1>
                        {event.name}
                    </h1>

                    <p>
                        Secure your place at this event by completing
                        the registration form. Enter your details below
                        to reserve your spot.
                    </p>

                    <div className="event-summary">

                        <h2>
                            Event Details
                        </h2>

                        <div className="event-detail">
                            <span>Date</span>
                            <span>
                                {event.date
                                    ? new Date(event.date).toLocaleDateString(
                                          "en-US",
                                          {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          }
                                      )
                                    : "Not specified"}
                            </span>
                        </div>

                        <div className="event-detail">
                            <span>Time</span>
                            <span>
                                {event.event_time || "Not specified"}
                            </span>
                        </div>

                        <div className="event-detail">
                            <span>Location</span>
                            <span>
                                {event.location || "Not specified"}
                            </span>
                        </div>

                        <div className="event-detail">
                            <span>Organizer</span>
                            <span>
                                {event.organizer || "Not specified"}
                            </span>
                        </div>

                    </div>

                </section>

                {/* RIGHT SIDE */}
                <section className="register-form-wrapper">

                    <h2>
                        Reserve Your Spot
                    </h2>

                    <p>
                        Fill in your details below to register
                        for this event.
                    </p>

                    {success && (
                        <div className="register-success">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Registering..."
                                : "Complete Registration"}
                        </button>

                    </form>

                    <div className="ticket-info">

                        <span>
                            Ticket Price
                        </span>

                        <span className="ticket-price">
                            {Number(event.price || 0) === 0
                                ? "Free"
                                : `₦${Number(event.price).toLocaleString()}`}
                        </span>

                    </div>

                    <div className="ticket-info">

                        <span>
                            Available Seats
                        </span>

                        <span className="ticket-price">
                            {availableSeats > 0
                                ? availableSeats
                                : "Full"}
                        </span>

                    </div>

                </section>

            </div>

        </main>
    );
}

export default Register;