import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
  const [dark, setDark] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav
      className={`${
        dark ? "bg-[#1E1B4B] text-white" : "bg-gray-100 text-black"
      } p-4 shadow-lg transition duration-300`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-bold text-transparent">
          Premier League
        </h1>

        <div className="space-x-6 font-medium">
          <Link to="/" className="hover:text-purple-400 transition">
            {t.nav.home}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/teams" className="hover:text-purple-400 transition">
                {t.nav.teams}
              </Link>
              <Link to="/analytics" className="hover:text-purple-400 transition">
                {t.nav.analytics}
              </Link>
              <Link to="/compare" className="hover:text-purple-400 transition">
                {t.nav.compare}
              </Link>
              <Link to="/favorites" className="hover:text-purple-400 transition">
                {t.nav.favorites}
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-400 transition">
                {t.nav.login}
              </Link>
              <Link to="/register" className="hover:text-purple-400 transition">
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
            <span className="text-slate-300">{t.nav.language}</span>
            <button
              onClick={() => setLanguage("en")}
              className={`rounded-full px-2 py-1 transition ${
                language === "en" ? "bg-white/20 text-white" : "text-slate-300"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("sv")}
              className={`rounded-full px-2 py-1 transition ${
                language === "sv" ? "bg-white/20 text-white" : "text-slate-300"
              }`}
            >
              SV
            </button>
          </div>

          {isAuthenticated ? (
            <div className="text-right">
              <p className="text-sm text-slate-200">{user?.username}</p>
              <button
                onClick={logout}
                className="text-xs text-pink-300 transition hover:text-pink-200"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : null}

          <button
            onClick={() => setDark(!dark)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
