import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="not-found">

            <span className="not-found-number">
                404
            </span>

            <h1>
                Page Not Found
            </h1>

            <p>
                The page you are looking for
                doesn't exist.
            </p>

            <Link
                to="/"
                className="primary-button"
            >
                Back Home
            </Link>

        </main>
    );
};

export default NotFound;