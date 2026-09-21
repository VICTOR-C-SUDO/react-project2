import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
    const [favorites, setFavorites] =
        useState([]);

    useEffect(() => {
        const saved =
            JSON.parse(
                localStorage.getItem(
                    "eventhubFavorites"
                )
            ) || [];

        setFavorites(saved);
    }, []);

    const removeFavorite = (uid) => {
        const updated =
            favorites.filter(
                (event) =>
                    event.uid !== uid
            );

        setFavorites(updated);

        localStorage.setItem(
            "eventhubFavorites",
            JSON.stringify(updated)
        );
    };

    return (
        <main className="favorites-page">

            <div className="page-container">

                <div className="page-heading">

                    <span className="section-label">
                        SAVED EVENTS
                    </span>

                    <h1>
                        Favorites
                    </h1>

                    <p>
                        Your saved events in one
                        place.
                    </p>

                </div>

                {favorites.length === 0 ? (
                    <div className="empty-state">

                        <span>♡</span>

                        <h2>
                            No favorites yet
                        </h2>

                        <p>
                            Save events you want to
                            remember.
                        </p>

                        <Link
                            to="/events"
                            className="primary-button"
                        >
                            Explore Events
                        </Link>

                    </div>
                ) : (
                    <div className="favorite-list">

                        {favorites.map(
                            (event) => (
                                <article
                                    className="favorite-card"
                                    key={event.uid}
                                >

                                    <div>

                                        <span className="event-category">
                                            {
                                                event.category
                                            }
                                        </span>

                                        <h2>
                                            {
                                                event.name
                                            }
                                        </h2>

                                        <p>
                                            📍{" "}
                                            {
                                                event.location
                                            }
                                        </p>

                                    </div>

                                    <div className="favorite-actions">

                                        <Link
                                            to={`/events/${event.uid}`}
                                            className="view-details-button"
                                        >
                                            View Event
                                        </Link>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                removeFavorite(
                                                    event.uid
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </article>
                            )
                        )}

                    </div>
                )}

            </div>

        </main>
    );
};

export default Favorites;