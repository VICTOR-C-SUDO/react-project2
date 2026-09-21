import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EventContext = createContext();

const API_URL =
  "https://event-hub-olive-six.vercel.app/api/v1/events/";

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL EVENTS
  // ==========================================

  const fetchEvents = async (filters = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.organizer) {
        params.append("organizer", filters.organizer);
      }

      if (filters.location) {
        params.append("location", filters.location);
      }

      if (filters.category) {
        params.append("category", filters.category);
      }

      const queryString = params.toString();

      const url = queryString
        ? `${API_URL}?${queryString}`
        : API_URL;

      console.log("FETCHING:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      console.log("GET STATUS:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await response.json();

      console.log("RAW API DATA:", data);

      const eventList = Array.isArray(data)
        ? data
        : data.events || data.data || [];

      console.log("EVENT LIST:", eventList);

      setEvents(eventList);
    } catch (err) {
      console.error("GET ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // POST - CREATE EVENT
  // API expects multipart/form-data
  // ==========================================

  const createEvent = async (eventData) => {
    try {
      setError("");

      console.log("CREATING EVENT:", eventData);

      // Create FormData because the API
      // expects multipart/form-data
      const formData = new FormData();

      formData.append("name", eventData.name);
      formData.append(
        "description",
        eventData.description
      );
      formData.append(
        "category",
        eventData.category
      );
      formData.append("date", eventData.date);
      formData.append(
        "event_time",
        eventData.event_time
      );
      formData.append(
        "location",
        eventData.location
      );
      formData.append(
        "organizer",
        eventData.organizer
      );

      // Price is optional in the API
      formData.append(
        "price",
        String(eventData.price || 0)
      );

      console.log("FORM DATA BEING SENT:");

      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(API_URL, {
        method: "POST",

        // IMPORTANT:
        // Do NOT manually add Content-Type here.
        // The browser adds multipart/form-data
        // with the correct boundary automatically.
        headers: {
          Accept: "application/json",
        },

        body: formData,
      });

      console.log(
        "POST STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "POST RESPONSE:",
        data
      );

      // ==========================================
      // HANDLE POST ERROR
      // ==========================================

      if (!response.ok) {
        let errorMessage =
          "Failed to create event.";

        if (
          data &&
          Array.isArray(data.detail)
        ) {
          errorMessage = data.detail
            .map((item) => {
              const location =
                Array.isArray(item.loc)
                  ? item.loc.join(" → ")
                  : "Unknown field";

              const message =
                item.msg ||
                item.message ||
                item.detail ||
                "Validation error";

              return `${location}: ${message}`;
            })
            .join(" | ");
        } else if (
          data &&
          typeof data === "object"
        ) {
          errorMessage =
            data.message ||
            data.detail ||
            JSON.stringify(data);
        } else {
          errorMessage = String(data);
        }

        throw new Error(errorMessage);
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      console.log(
        "EVENT CREATED SUCCESSFULLY:",
        data
      );

      setEvents((previousEvents) => [
        ...previousEvents,
        data,
      ]);

      return data;
    } catch (err) {
      console.error(
        "POST ERROR:",
        err
      );

      setError(err.message);

      throw err;
    }
  };

  // ==========================================
  // PATCH - UPDATE EVENT
  // ==========================================

  const updateEvent = async (
    event_uid,
    updateData
  ) => {
    try {
      setError("");

      console.log(
        "UPDATING EVENT:",
        event_uid
      );

      console.log(
        "UPDATE DATA:",
        updateData
      );

      const response = await fetch(
        `${API_URL}${event_uid}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(
            updateData
          ),
        }
      );

      console.log(
        "PATCH STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "PATCH RESPONSE:",
        data
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to update event.";

        if (
          data &&
          Array.isArray(data.detail)
        ) {
          errorMessage = data.detail
            .map((item) => {
              const location =
                Array.isArray(item.loc)
                  ? item.loc.join(" → ")
                  : "Unknown field";

              const message =
                item.msg ||
                item.message ||
                item.detail ||
                "Validation error";

              return `${location}: ${message}`;
            })
            .join(" | ");
        } else if (
          data &&
          typeof data === "object"
        ) {
          errorMessage =
            data.message ||
            data.detail ||
            JSON.stringify(data);
        } else {
          errorMessage = String(data);
        }

        throw new Error(errorMessage);
      }

      // Replace updated event
      setEvents((previousEvents) =>
        previousEvents.map((event) =>
          event.uid === event_uid
            ? data
            : event
        )
      );

      return data;
    } catch (err) {
      console.error(
        "PATCH ERROR:",
        err
      );

      setError(err.message);

      throw err;
    }
  };

  // ==========================================
  // DELETE - DELETE EVENT
  // ==========================================

  const deleteEvent = async (
    event_uid
  ) => {
    try {
      setError("");

      console.log(
        "DELETING EVENT:",
        event_uid
      );

      const response = await fetch(
        `${API_URL}${event_uid}`,
        {
          method: "DELETE",

          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log(
        "DELETE STATUS:",
        response.status
      );

      if (!response.ok) {
        let data = {};

        try {
          data = await response.json();
        } catch {
          // DELETE may return an empty response
        }

        let errorMessage =
          "Failed to delete event.";

        if (
          data &&
          Array.isArray(data.detail)
        ) {
          errorMessage = data.detail
            .map((item) => {
              const location =
                Array.isArray(item.loc)
                  ? item.loc.join(" → ")
                  : "Unknown field";

              const message =
                item.msg ||
                item.message ||
                item.detail ||
                "Validation error";

              return `${location}: ${message}`;
            })
            .join(" | ");
        } else if (
          data &&
          typeof data === "object"
        ) {
          errorMessage =
            data.message ||
            data.detail ||
            JSON.stringify(data);
        }

        throw new Error(errorMessage);
      }

      // Remove deleted event
      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) =>
            event.uid !== event_uid
        )
      );

      console.log(
        "EVENT DELETED:",
        event_uid
      );

      return true;
    } catch (err) {
      console.error(
        "DELETE ERROR:",
        err
      );

      setError(err.message);

      throw err;
    }
  };

  // ==========================================
  // FETCH EVENTS WHEN APP STARTS
  // ==========================================

  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================================
  // PROVIDER
  // ==========================================

  return (
    <EventContext.Provider
      value={{
        events,
        loading,
        error,
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useEvents = () => {
  return useContext(EventContext);
};