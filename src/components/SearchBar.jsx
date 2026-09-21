import { useState } from "react";
import { useEvents } from "./EventContext";

const SearchBar = () => {
    const { fetchEvents } = useEvents();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();

        fetchEvents({
            name: search,
            category,
            status,
        });
    };

    const handleClear = () => {
        setSearch("");
        setCategory("");
        setStatus("");

        fetchEvents();
    };

    return (
        <form
            className="search-bar"
            onSubmit={handleSearch}
        >
            <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
            />

            <select
                value={category}
                onChange={(e) =>
                    setCategory(e.target.value)
                }
            >
                <option value="">
                    All Categories
                </option>

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

            <select
                value={status}
                onChange={(e) =>
                    setStatus(e.target.value)
                }
            >
                <option value="">
                    All Status
                </option>

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

            <button type="submit">
                Search
            </button>

            <button
                type="button"
                className="clear-button"
                onClick={handleClear}
            >
                Clear
            </button>
        </form>
    );
};

export default SearchBar;