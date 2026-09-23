import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../components/EventContext";

const AddEvent = () => {
  const { createEvent } = useEvents();
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      
     const eventData = {
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
  "EVENT DATA BEING SENT:",
  JSON.stringify(eventData, null, 2)
);
      // Send event to backend
      await createEvent(eventData);

      console.log("EVENT CREATED SUCCESSFULLY");

      setSuccess(true);

      
      setTimeout(() => {
        navigate("/events");
      }, 1200);
    } catch (err) {
      console.error("CREATE EVENT ERROR:", err);

    
      let errorMessage = "Failed to create event.";

      if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-event-page">
      <div className="create-event-container">

        <div className="create-event-heading">
          <span className="section-label">
            EVENT MANAGEMENT
          </span>

          <h1>Create Event</h1>

          <p>
            Add a new event to EventHub.
          </p>
        </div>

        {error && (
          <div className="form-error">
            <strong>Unable to create event:</strong>
            <p>{error}</p>
          </div>
        )}

       
        {success && (
          <div className="form-success">
            Event created successfully!
          </div>
        )}

        <form
          className="create-event-form"
          onSubmit={handleSubmit}
        >

        
          <div className="form-group">
            <label htmlFor="name">
              Event Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter event name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

       
          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe the event"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>

          
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
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
            </div>

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
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
            </div>

          </div>

          {/* Date and Time */}
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event_time">
                Event Time
              </label>

              <input
                id="event_time"
                name="event_time"
                type="time"
                value={formData.event_time}
                onChange={handleChange}
                required
              />
            </div>

          </div>

        
          <div className="form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              placeholder="e.g. Awka, Anambra"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

    
          <div className="form-group">
            <label htmlFor="organizer">
              Organizer
            </label>

            <input
              id="organizer"
              name="organizer"
              type="text"
              placeholder="Enter organizer name"
              value={formData.organizer}
              onChange={handleChange}
              required
            />
          </div>

        
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="capacity">
                Capacity
              </label>

              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                placeholder="100"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Price (₦)
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

          </div>

       
          <button
            type="submit"
            className="register-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Event..."
              : "Create Event"}
          </button>

        </form>
      </div>
    </main>
  );
};

export default AddEvent;