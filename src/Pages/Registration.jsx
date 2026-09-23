 import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL =
    "https://event-hub-olive-six.vercel.app/api/v1/events/";

const Registration = () => {
    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}${id}`
                );

                if (!response.ok) {
                    throw new Error("Event not found");
                }

                const data = await response.json();

                console.log("REGISTRATION EVENT:", data);

                setEvent(data);
            } catch (err) {
                console.error(
                    "REGISTRATION ERROR:",
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
            setError("Event ID is missing");
            setLoading(false);
        }
    }, [id]);

    

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!event) {
            return;
        }

        const oldRegistrations =
            JSON.parse(
                localStorage.getItem(
                    "eventhubRegistrations"
                )
            ) || [];

        const newRegistration = {
            id: Date.now(),

            eventId: event.uid,

            eventName: event.name,

            name: formData.name,

            email: formData.email,

            phone: formData.phone,

            registeredAt:
                new Date().toISOString(),
        };

        localStorage.setItem(
            "eventhubRegistrations",
            JSON.stringify([
                ...oldRegistrations,
                newRegistration,
            ])
        );

        console.log(
            "REGISTRATION SAVED:",
            newRegistration
        );

        setSubmitted(true);
    };

   

    if (loading) {
        return (
            <main className="registration-loading">

                <div className="registration-spinner"></div>

                <p>
                    Loading event...
                </p>

            </main>
        );
    }

   
    if (error || !event) {
        return (
            <main className="registration-page">

                <div className="registration-error">

                    <div className="registration-error-icon">
                        !
                    </div>

                    <h2>
                        Event Not Found
                    </h2>

                    <p>
                        {error ||
                            "We could not find this event."}
                    </p>

                    <Link
                        to="/events"
                        className="registration-back-button"
                    >
                        ← Back to Events
                    </Link>

                </div>

            </main>
        );
    }

   

    if (submitted) {
        return (
            <main className="registration-page">

                <div className="registration-card success-card">

                    <div className="registration-success-icon">
                        ✓
                    </div>

                    <span className="registration-label">
                        SUCCESS
                    </span>

                    <h1>
                        Registration Complete
                    </h1>

                    <p className="registration-success-text">
                        You have successfully
                        registered for:
                    </p>

                    <h2 className="registration-success-event">
                        {event.name}
                    </h2>

                    <div className="registration-success-actions">

                        <Link
                            to="/registrations"
                            className="registration-primary-button"
                        >
                            View Registrations
                        </Link>

                        <Link
                            to="/events"
                            className="registration-secondary-button"
                        >
                            Explore More Events
                        </Link>

                    </div>

                </div>

            </main>
        );
    }


    return (
        <main className="registration-page">

            <div className="registration-card">

               

                <div className="registration-heading">

                    <span className="registration-label">
                        EVENT REGISTRATION
                    </span>

                    <h1>
                        Register for Event
                    </h1>

                    <p>
                        Fill in your details to
                        reserve your place.
                    </p>

                </div>


                

                <div className="registration-event-preview">

                    <span>
                        REGISTERING FOR
                    </span>

                    <h2>
                        {event.name}
                    </h2>

                    <div className="registration-event-info">

                        {event.date && (
                            <span>
                                📅 {event.date}
                            </span>
                        )}

                        {event.event_time && (
                            <span>
                                🕐 {event.event_time}
                            </span>
                        )}

                        {event.location && (
                            <span>
                                📍 {event.location}
                            </span>
                        )}

                        {event.organizer && (
                            <span>
                                👤 {event.organizer}
                            </span>
                        )}

                    </div>

                </div>


            

                <form
                    className="registration-form"
                    onSubmit={handleSubmit}
                >

                    

                    <div className="registration-input-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    

                    <div className="registration-input-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                

                    <div className="registration-input-group">

                        <label htmlFor="phone">
                            Phone Number
                        </label>

                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="08012345678"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    

                    <button
                        type="submit"
                        className="registration-submit-button"
                    >
                        Complete Registration
                    </button>

                </form>


            

                <Link
                    to={`/events/${event.uid}`}
                    className="registration-back-link"
                >
                    ← Back to Event
                </Link>

            </div>

        </main>
    );
};

export default Registration;