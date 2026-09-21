import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL =
    "https://event-hub-olive-six.vercel.app/api/v1/events/";

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "Technology",
        date: "",
        event_time: "",
        location: "",
        organizer: "",
        capacity: "",
        price: "",
        status: "upcoming",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await fetch(
                        `${API_URL}${id}`
                    );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load event"
                    );
                }

                const event =
                    await response.json();

                setFormData({
                    name: event.name || "",
                    description:
                        event.description || "",
                    category:
                        event.category ||
                        "Technology",
                    date: event.date
                        ? event.date.split("T")[0]
                        : "",
                    event_time:
                        event.event_time
                            ? event.event_time.substring(
                                  0,
                                  5
                              )
                            : "",
                    location:
                        event.location || "",
                    organizer:
                        event.organizer || "",
                    capacity:
                        event.capacity ?? "",
                    price:
                        event.price ?? "",
                    status:
                        event.status ||
                        "upcoming",
                });

            } catch (err) {
                console.error(
                    "LOAD EVENT ERROR:",
                    err
                );

                setError(err.message);

            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEvent();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updatedData = {
                name: formData.name,
                description:
                    formData.description,
                category:
                    formData.category,
                date: formData.date,
                event_time:
                    formData.event_time,
                location:
                    formData.location,
                organizer:
                    formData.organizer,
                capacity:
                    Number(
                        formData.capacity
                    ),
                price:
                    Number(
                        formData.price
                    ),
                status:
                    formData.status,
            };

            const response =
                await fetch(
                    `${API_URL}${id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type":
                                "application/json",
                            Accept:
                                "application/json",
                        },
                        body: JSON.stringify(
                            updatedData
                        ),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                        "Failed to update event"
                );
            }

            console.log(
                "UPDATED EVENT:",
                data
            );

            setSuccess(
                "Event updated successfully!"
            );

            setTimeout(() => {
                navigate(
                    `/events/${id}`
                );
            }, 1000);

        } catch (err) {
            console.error(
                "UPDATE EVENT ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="loading-container page-loading">
                <div className="spinner"></div>
                <p>Loading event...</p>
            </main>
        );
    }

    if (error && !formData.name) {
        return (
            <main className="error-container">

                <h2>
                    Unable to load event
                </h2>

                <p>{error}</p>

            </main>
        );
    }

    return (
        <main className="form-page">

            <div className="form-container">

                <span className="section-label">
                    UPDATE EVENT
                </span>

                <h1>
                    Edit Event
                </h1>

                <p className="form-intro">
                    Update the information for
                    this event.
                </p>

                <form
                    className="event-form"
                    onSubmit={handleSubmit}
                >

                    <label>
                        Event Name
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Category
                    </label>

                    <select
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={handleChange}
                    >
                        <option value="Technology">
                            Technology
                        </option>

                        <option value="Community">
                            Community
                        </option>

                        <option value="Music">
                            Music
                        </option>

                        <option value="Workshop">
                            Workshop
                        </option>

                        <option value="Business">
                            Business
                        </option>

                        <option value="Other">
                            Other
                        </option>
                    </select>

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Event Time
                    </label>

                    <input
                        type="time"
                        name="event_time"
                        value={
                            formData.event_time
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Location
                    </label>

                    <input
                        type="text"
                        name="location"
                        value={
                            formData.location
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Organizer
                    </label>

                    <input
                        type="text"
                        name="organizer"
                        value={
                            formData.organizer
                        }
                        onChange={handleChange}
                        required
                    />

                    <label>
                        Capacity
                    </label>

                    <input
                        type="number"
                        name="capacity"
                        value={
                            formData.capacity
                        }
                        onChange={handleChange}
                        min="1"
                        required
                    />

                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={handleChange}
                    >
                        <option value="upcoming">
                            Upcoming
                        </option>

                        <option value="ongoing">
                            Ongoing
                        </option>

                        <option value="completed">
                            Completed
                        </option>
                    </select>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </form>

                {success && (
                    <p className="success-message">
                        {success}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

            </div>

        </main>
    );
};

export default EditEvent;