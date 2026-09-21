import { Link } from "react-router-dom";
import { useEvents } from "../components/EventContext";
import EventCard from "../components/EventCard";
import eventImage from "../assets/eventImage.jpeg";
const Home = () => {
    const { events, loading } = useEvents();

    const featuredEvents = events.slice(0, 3);

    return (
        <main>
           
    
<section
    className="home-hero"
    style={{ backgroundImage: `url(${eventImage})` }}
>
    <div className="hero-overlay"></div>

    <div className="hero-content">
        <span className="hero-label">
            EVENTHUB
        </span>

        <h1>
            Discover Amazing Events
        </h1>

        <p>
            Find exciting events, workshops,
            conferences and experiences happening
            around you.
        </p>

        <a
            href="/events"
            className="hero-button"
        >
            Explore Events
        </a>
    </div>


           

            </section>
            

            <section className="home-section">

                <div className="section-heading">

                    <div>
                        <span className="section-label">
                            EXPLORE
                        </span>

                        <h2>
                            Featured Events
                        </h2>
                    </div>

                    <Link
                        to="/events"
                        className="view-all"
                    >
                        View All →
                    </Link>

                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : featuredEvents.length === 0 ? (
                    <div className="empty-state">
                        <span>✦</span>
                        <h2>No events available</h2>
                        <p>
                            Check back later for upcoming
                            events.
                        </p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {featuredEvents.map((event) => (
                            <EventCard
                                key={event.uid}
                                event={event}
                            />
                        ))}
                    </div>
                )}

            </section>

            <section className="home-cta">

                <div>
                    <span className="section-label">
                        HAVE AN EVENT?
                    </span>

                    <h2>
                        Bring Your Event
                        <br />
                        To EventHub.
                    </h2>

                    <p>
                        Create and share your event
                        with people looking for their
                        next experience.
                    </p>
                </div>

                <Link
                    to="/add-event"
                    className="primary-button"
                >
                    Create Event →
                </Link>

            </section>

        </main>
    );
};

export default Home;