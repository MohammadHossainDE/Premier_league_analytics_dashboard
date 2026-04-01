
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Favorites from "./pages/Favorites";
import Analytics from "./pages/Analytics";
import TeamDetails from "./pages/TeamDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompareTeams from "./pages/CompareTeams";
import StaticPage from "./pages/StaticPage";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const [dark, setDark] = useState(true);
  const { t } = useLanguage();

  return (
    <Router>
      <div className={dark ? "bg-[#1E1B4B] text-white min-h-screen" : "bg-gray-100 text-black min-h-screen"}>
        
        {/* Pass theme to Navbar */}
        <Navbar dark={dark} setDark={setDark} />

        <Routes>
          {/* Home full width */}
          <Route path="/" element={<Home />} />

          <Route
            path="/about"
            element={
              <StaticPage
                eyebrow={t.static.about.eyebrow}
                title={t.static.about.title}
                sections={t.static.about.sections}
              />
            }
          />

          <Route
            path="/contact"
            element={
              <StaticPage
                eyebrow={t.static.contact.eyebrow}
                title={t.static.contact.title}
                sections={t.static.contact.sections}
              />
            }
          />

          <Route
            path="/privacy"
            element={
              <StaticPage
                eyebrow={t.static.privacy.eyebrow}
                title={t.static.privacy.title}
                sections={t.static.privacy.sections}
              />
            }
          />

          <Route
            path="/terms"
            element={
              <StaticPage
                eyebrow={t.static.terms.eyebrow}
                title={t.static.terms.title}
                sections={t.static.terms.sections}
              />
            }
          />

          <Route
            path="/login"
            element={
              <div className="max-w-6xl mx-auto p-6">
                <Login />
              </div>
            }
          />

          <Route
            path="/register"
            element={
              <div className="max-w-6xl mx-auto p-6">
                <Register />
              </div>
            }
          />

          {/* Other pages with container */}
          <Route
            path="/teams"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-6">
                  <Teams />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-6">
                  <Favorites />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-6">
                  <Analytics />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-6">
                  <CompareTeams />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams/:teamId"
            element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-6">
                  <TeamDetails />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
