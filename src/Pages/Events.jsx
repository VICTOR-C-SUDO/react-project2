import { useEvents } from "../components/EventContext";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";

const Events = () => {
    const { events, loading, error } = useEvents();

    if (loading) {
        return (
            <main className="loading-container page-loading">
                <div className="spinner"></div>
                <p>Loading events...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="error-container">
                <h2>Unable to Load Events</h2>
                <p>{error}</p>
            </main>
        );
    }

    return (
        <main className="events-page">

            <section className="page-header">
                <div className="page-header-container">
                    <span className="section-label">
                        EXPLORE
                    </span>

                    <h1>
                        Discover Events
                    </h1>

                    <p>
                        Find exciting events, workshops,
                        conferences and experiences happening
                        around you.
                    </p>
                </div>
            </section>

            <section className="events-section">

                <div className="events-container">

                    <SearchBar />

                    {events.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                ✦
                            </div>

                            <h2>
                                No Events Found
                            </h2>

                            <p>
                                There are currently no events
                                matching your search.
                            </p>
                        </div>
                    ) : (
                        <div className="events-grid">

                            {events.map((event) => (
                                <EventCard
                                    key={event.uid}
                                    event={event}
                                />
                            ))}

                        </div>
                    )}

                </div>

            </section>

        </main>
    );
};

export default Events;