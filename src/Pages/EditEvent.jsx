import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../components/EventContext";

const API_URL =
    "https://event-hub-olive-six.vercel.app/api/v1/events/";

function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateEvent } = useEvents();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        date: "",
        event_time: "",
        location: "",
        organizer: "",
        capacity: "",
        price: "",
        status: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // GET ONE EVENT
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                console.log("LOADING EVENT:", id);

                const response = await fetch(
                    `${API_URL}${id}?refresh=${Date.now()}`
                );

                console.log(
                    "GET EVENT STATUS:",
                    response.status
                );

                const data = await response.json();

                console.log("EVENT DATA:", data);

                if (!response.ok) {
                    throw new Error(
                        Array.isArray(data.detail)
                            ? JSON.stringify(data.detail)
                            : data.detail ||
                              "Failed to load event"
                    );
                }

                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    category: data.category || "",
                    date: data.date
                        ? data.date.split("T")[0]
                        : "",
                    event_time: data.event_time
                        ? data.event_time.substring(0, 5)
                        : "",
                    location: data.location || "",
                    organizer: data.organizer || "",
                    capacity: data.capacity ?? "",
                    price: data.price ?? "",
                    status: data.status || "",
                });

                setLoading(false);
            } catch (err) {
                console.error(
                    "LOAD EVENT ERROR:",
                    err
                );

                setError(err.message);
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // HANDLE INPUT CHANGES
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // UPDATE EVENT
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("SAVE BUTTON CLICKED");

        setSaving(true);
        setError("");
        setSuccess("");

        const updatedData = {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            date: formData.date,
            event_time: formData.event_time,
            location: formData.location,
            organizer: formData.organizer,
            capacity: Number(formData.capacity),
            price: Number(formData.price),
            status: formData.status,
        };

        console.log(
            "SENDING UPDATE:",
            updatedData
        );

        try {
            const updatedEvent = await updateEvent(
                id,
                updatedData
            );

            console.log(
                "UPDATE COMPLETE:",
                updatedEvent
            );

            setSuccess(
                "Event updated successfully!"
            );

            setTimeout(() => {
                navigate(`/events/${id}`);
            }, 1000);
        } catch (err) {
            console.error(
                "UPDATE ERROR:",
                err
            );

            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div>
                <h2>Loading event...</h2>
            </div>
        );
    }

    return (
        <div className="edit-event-page">

            <h1>Edit Event</h1>

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}

            {success && (
                <p style={{ color: "green" }}>
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                {/* NAME */}
                <div>
                    <label>Event Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label>Description</label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* CATEGORY */}
                <div>
                    <label>Category</label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Category
                        </option>

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
                </div>

                {/* DATE */}
                <div>
                    <label>Date</label>

                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                {/* TIME */}
                <div>
                    <label>Event Time</label>

                    <input
                        type="time"
                        name="event_time"
                        value={formData.event_time}
                        onChange={handleChange}
                    />
                </div>

                {/* LOCATION */}
                <div>
                    <label>Location</label>

                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>

                {/* ORGANIZER */}
                <div>
                    <label>Organizer</label>

                    <input
                        type="text"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                    />
                </div>

                {/* CAPACITY */}
                <div>
                    <label>Capacity</label>

                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                    />
                </div>

                {/* PRICE */}
                <div>
                    <label>Price</label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                    />
                </div>

                {/* STATUS */}
                <div>
                    <label>Status</label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="">
                            Select Status
                        </option>

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
                </div>

                {/* UPDATE BUTTON */}
                <button
                    type="submit"
                    disabled={saving}
                >
                    {saving
                        ? "Updating..."
                        : "Update Event"}
                </button>

            </form>
        </div>
    );
}

export default EditEvent;