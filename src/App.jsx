import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import EventDetails from "./pages/EventDetails";
import Events from "./Pages/Events";
import Registration from "./Pages/Registration";
import Registrations from "./Pages/Registrations";
import Favorites from "./Pages/Favorites";
import AddEvent from "./Pages/AddEvent";
import EditEvent from "./Pages/EditEvent";
import NotFound from "./Pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { EventProvider } from "./components/EventContext";

function App() {
    return (
        <BrowserRouter>
            <EventProvider>

                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/events"
                        element={<Events />}
                    />

                    <Route
                        path="/events/:id"
                        element={<EventDetails />}
                    />

                    <Route
                        path="/events/:id/edit"
                        element={<EditEvent />}
                    />

                    <Route
                        path="/register/:id"
                        element={<Registration />}
                    />

                    <Route
                        path="/registrations"
                        element={<Registrations />}
                    />

                    <Route
                        path="/favorites"
                        element={<Favorites />}
                    />

                    <Route
                        path="/add-event"
                        element={<AddEvent />}
                    />

                    <Route
                        path="*"
                        element={<NotFound />}
                    />
                </Routes>

                <Footer />

            </EventProvider>
        </BrowserRouter>
    );
}

export default App;