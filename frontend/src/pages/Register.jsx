import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await register(form);
      navigate("/teams", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || t.register.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <p className="text-sm uppercase tracking-[0.3em] text-purple-200/80">
        {t.register.eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-black text-white">{t.register.title}</h1>
      <p className="mt-3 text-slate-300">
        {t.register.description}
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">{t.register.username}</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">{t.register.email}</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">{t.register.password}</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.register.submitting : t.register.submit}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        {t.register.haveAccount}{" "}
        <Link to="/login" className="text-purple-300 hover:text-purple-200">
          {t.register.login}
        </Link>
      </p>
    </section>
  );
}

export default Register;
