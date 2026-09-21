import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <header className="navbar">
            <div className="navbar-container">

                <NavLink to="/" className="logo">
                    EVENT<span>HUB</span>
                </NavLink>

                <nav className="nav-links">
                    <NavLink to="/">
                        Home
                    </NavLink>

                    <NavLink to="/events">
                        Events
                    </NavLink>

                    <NavLink to="/favorites">
                        Favorites
                    </NavLink>

                    <NavLink to="/registrations">
                        Registrations
                    </NavLink>

                    <NavLink
                        to="/add-event"
                        className="nav-create"
                    >
                        Create Event
                    </NavLink>
                </nav>

            </div>
        </header>
    );
};

export default Navbar;