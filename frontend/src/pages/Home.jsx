import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import stadium from "../assets/stadium.png";
import { useLanguage } from "../context/LanguageContext";

function Home() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#1E1B4B] text-white">
      <section
        className="relative flex min-h-[82vh] items-center justify-center px-6 text-center"
        style={{
          backgroundImage: `url(${stadium})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#090914]/60 via-[#090914]/30 to-[#090914]/60" />

        <motion.div
          className="relative z-10 max-w-3xl rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-md md:p-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.4em] text-pink-200/90">
            {t.home.eyebrow}
          </p>

          <h1 className="mb-5 bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-300 bg-clip-text text-4xl font-extrabold text-transparent drop-shadow-2xl md:text-5xl">
            {t.home.title}
          </h1>

          <p className="mx-auto mb-7 max-w-xl text-base leading-relaxed text-slate-200 md:text-lg">
            {t.home.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/teams"
              className="inline-flex rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-lg font-semibold shadow-2xl transition duration-300 hover:scale-105"
            >
              {t.home.explore}
            </Link>
            <Link
              to="/register"
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:bg-white/15"
            >
              {t.home.createAccount}
            </Link>
          </div>
        </motion.div>
      </section>

      <div className="relative -mt-1 w-full overflow-hidden leading-none">
        <svg
          className="relative block h-24 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22,103.59,29.05,158,17C230.78,47,284,13,339,1.05c54.79-11.84,111.64,7,165,29.05C611,58,666,81,720,76.29c55.61-4.79,109-34,164-47C939,16,994,24,1048,41.05c54.38,17,109.58,42,152,39V0Z"
            fill="#1E1B4B"
          />
        </svg>
      </div>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <section className="grid gap-6 md:grid-cols-3">
          {t.home.features.map((card, index) => (
            <motion.article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-xl"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
            >
              <h2 className="mb-3 text-xl font-semibold text-white">{card.title}</h2>
              <p className="text-sm leading-7 text-slate-300">{card.description}</p>
            </motion.article>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#111827] py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>{t.home.footer}</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/about" className="transition hover:text-white">{t.home.aboutUs}</Link>
            <Link to="/contact" className="transition hover:text-white">{t.home.contact}</Link>
            <Link to="/privacy" className="transition hover:text-white">{t.home.privacy}</Link>
            <Link to="/terms" className="transition hover:text-white">{t.home.terms}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
