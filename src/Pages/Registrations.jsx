import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Registrations = () => {
    const [registrations, setRegistrations] =
        useState([]);

    useEffect(() => {
        const saved =
            JSON.parse(
                localStorage.getItem(
                "eventhubRegistrations"
                )
            ) || [];

        setRegistrations(saved);
    }, []);

    const removeRegistration = (id) => {
        const updated =
            registrations.filter(
                (registration) =>
                    registration.id !== id
            );

        setRegistrations(updated);

        localStorage.setItem(
            "eventhubRegistrations",
            JSON.stringify(updated)
        );
    };

    const clearRegistrations = () => {
        const confirmed =
            window.confirm(
                "Clear all registrations?"
            );

        if (!confirmed) {
            return;
        }

        localStorage.removeItem(
            "eventhubRegistrations"
        );

        setRegistrations([]);
    };

    return (
        <main className="registrations-page">

            <div className="page-container">

                <div className="page-heading">

                    <span className="section-label">
                        MY EVENTS
                    </span>

                    <h1>
                        Registrations
                    </h1>

                    <p>
                        View the events you have
                        registered for.
                    </p>

                </div>

                {registrations.length === 0 ? (
                    <div className="empty-state">

                        <span>✦</span>

                        <h2>
                            No registrations yet
                        </h2>

                        <p>
                            Explore events and
                            register for one.
                        </p>

                        <Link
                            to="/events"
                            className="primary-button"
                        >
                            Explore Events
                        </Link>

                    </div>
                ) : (
                    <>
                        <div className="registration-list">

                            {registrations.map(
                                (registration) => (
                                    <article
                                        className="registration-card"
                                        key={
                                            registration.id
                                        }
                                    >

                                        <div>
                                            <span className="section-label">
                                                REGISTERED EVENT
                                            </span>

                                            <h2>
                                                {
                                                    registration.eventName
                                                }
                                            </h2>

                                            <p>
                                                👤{" "}
                                                {
                                                    registration.name
                                                }
                                            </p>

                                            <p>
                                                ✉️{" "}
                                                {
                                                    registration.email
                                                }
                                            </p>

                                            <p>
                                                📱{" "}
                                                {
                                                    registration.phone
                                                }
                                            </p>

                                        </div>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                removeRegistration(
                                                    registration.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </article>
                                )
                            )}

                        </div>

                        <button
                            className="clear-button large-clear"
                            onClick={
                                clearRegistrations
                            }
                        >
                            Clear All Registrations
                        </button>
                    </>
                )}

            </div>

        </main>
    );
};

export default Registrations;