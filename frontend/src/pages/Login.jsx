import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

function Login() {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/teams";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || t.login.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <p className="text-sm uppercase tracking-[0.3em] text-purple-200/80">
        {t.login.eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-black text-white">{t.login.title}</h1>
      <p className="mt-3 text-slate-300">
        {t.login.description}
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">{t.login.identifier}</span>
          <input
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            placeholder={t.login.identifierPlaceholder}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-200">{t.login.password}</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-400"
            placeholder={t.login.passwordPlaceholder}
            required
          />
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.login.submitting : t.login.submit}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-300">
        {t.login.needAccount}{" "}
        <Link to="/register" className="text-purple-300 hover:text-purple-200">
          {t.login.createOne}
        </Link>
      </p>
    </section>
  );
}

export default Login;
