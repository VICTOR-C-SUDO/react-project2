const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div>
                    <h2>EVENT<span>HUB</span></h2>

                    <p>
                        Discover experiences, connect with people,
                        and create memorable moments.
                    </p>
                </div>

                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/events">Events</a>
                    <a href="/favorites">Favorites</a>
                    <a href="/registrations">Registrations</a>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} EventHub. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;