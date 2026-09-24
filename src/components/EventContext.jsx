import { createContext, useContext, useEffect, useState } from "react";

const EventContext = createContext();

const API_URL = "https://event-hub-olive-six.vercel.app/api/v1/events/";

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // GET ALL EVENTS / SEARCH EVENTS
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

            if (filters.status) {
                params.append("status", filters.status);
            }

            const query = params.toString();

            const url = query
                ? `${API_URL}?${query}`
                : `${API_URL}?refresh=${Date.now()}`;

            console.log("FETCHING:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                cache: "no-store",
            });

            console.log("GET STATUS:", response.status);

            const data = await response.json();

            console.log("RAW API DATA:", data);

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.detail)
                        ? JSON.stringify(data.detail)
                        : data.detail || "Failed to fetch events"
                );
            }

            setEvents(data);

            console.log("EVENT LIST:", data);

            return data;
        } catch (err) {
            console.error("FETCH EVENTS ERROR:", err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // CREATE EVENT
    const createEvent = async (eventData) => {
        try {
            setError("");

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(eventData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.detail)
                        ? JSON.stringify(data.detail)
                        : data.detail || "Failed to create event"
                );
            }

            setEvents((previousEvents) => [
                ...previousEvents,
                data,
            ]);

            return data;
        } catch (err) {
            console.error("CREATE EVENT ERROR:", err);
            setError(err.message);
            throw err;
        }
    };

    // UPDATE EVENT
    const updateEvent = async (event_uid, updateData) => {
        try {
            setError("");

            console.log("UPDATING EVENT:", event_uid);
            console.log("DATA BEING SENT:", updateData);

            const formData = new FormData();

            formData.append("name", updateData.name);
            formData.append("description", updateData.description);
            formData.append("category", updateData.category);
            formData.append("date", updateData.date);
            formData.append("event_time", updateData.event_time);
            formData.append("location", updateData.location);
            formData.append("organizer", updateData.organizer);
            formData.append("capacity", String(updateData.capacity));
            formData.append("price", String(updateData.price));
            formData.append("status", updateData.status);

            const response = await fetch(
                `${API_URL}${event_uid}`,
                {
                    method: "PATCH",
                    headers: {
                        Accept: "application/json",
                    },
                    body: formData,
                }
            );

            console.log(
                "PATCH RESPONSE STATUS:",
                response.status
            );

            const data = await response.json();

            console.log("PATCH RESPONSE DATA:", data);

            if (!response.ok) {
                throw new Error(
                    Array.isArray(data.detail)
                        ? JSON.stringify(data.detail)
                        : data.detail || "Failed to update event"
                );
            }

            // Update the event immediately in React state
            setEvents((previousEvents) =>
                previousEvents.map((event) =>
                    event.uid === event_uid
                        ? data
                        : event
                )
            );

            console.log("UPDATE COMPLETE:", data);

            return data;
        } catch (err) {
            console.error("PATCH UPDATE ERROR:", err);
            setError(err.message);
            throw err;
        }
    };

    // DELETE EVENT
    const deleteEvent = async (event_uid) => {
        try {
            setError("");

            console.log("DELETING EVENT:", event_uid);

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
                const data = await response.json();

                throw new Error(
                    Array.isArray(data.detail)
                        ? JSON.stringify(data.detail)
                        : data.detail || "Failed to delete event"
                );
            }

            // Remove deleted event immediately
            setEvents((previousEvents) =>
                previousEvents.filter(
                    (event) => event.uid !== event_uid
                )
            );

            console.log(
                "EVENT DELETED:",
                event_uid
            );

            return true;
        } catch (err) {
            console.error(
                "DELETE EVENT ERROR:",
                err
            );

            setError(err.message);

            throw err;
        }
    };

    // LOAD EVENTS WHEN APP STARTS
    useEffect(() => {
        fetchEvents();
    }, []);

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

// CUSTOM HOOK
export const useEvents = () => {
    return useContext(EventContext);
};