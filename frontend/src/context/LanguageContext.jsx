import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);
const STORAGE_KEY = "pl_language";

const translations = {
  en: {
    nav: {
      home: "Home",
      teams: "Teams",
      analytics: "Analytics",
      compare: "Compare",
      favorites: "Favorites",
      login: "Login",
      register: "Register",
      logout: "Logout",
      language: "Language",
    },
    home: {
      eyebrow: "Premier League Analytics Platform",
      title: "Premier League analytics for fans who want more.",
      description:
        "Explore live data, compare clubs, save favorites, and track team performance over time.",
      explore: "Explore Teams",
      createAccount: "Create Account",
      features: [
        {
          title: "Live League Tracking",
          description:
            "Follow current Premier League standings, team records, and match performance in one place.",
        },
        {
          title: "Personalized Workspace",
          description:
            "Save favorite teams, write notes, and build your own football analysis flow around the clubs you follow most.",
        },
        {
          title: "Historical Insights",
          description:
            "Store snapshots over time and compare how teams develop through charts and trend-focused analytics.",
        },
      ],
      footer: "Copyright 2026 Premier League Dashboard | Built with React and FastAPI",
      aboutUs: "About Us",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },
    login: {
      eyebrow: "Welcome Back",
      title: "Log in to continue",
      description:
        "Use your username or email to unlock analytics, teams, and favorites.",
      identifier: "Username or Email",
      identifierPlaceholder: "svens or svens@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      submit: "Log In",
      submitting: "Logging in...",
      failed: "Login failed.",
      needAccount: "Need an account?",
      createOne: "Create one",
    },
    register: {
      eyebrow: "New Account",
      title: "Create your login",
      description:
        "Register once, then your favorites and analytics stay tied to your account.",
      username: "Username",
      email: "Email",
      password: "Password",
      submit: "Register",
      submitting: "Creating account...",
      failed: "Registration failed.",
      haveAccount: "Already have an account?",
      login: "Log in",
    },
    static: {
      about: {
        eyebrow: "About Us",
        title: "A modern analytics dashboard for Premier League followers.",
        sections: [
          {
            heading: "Who We Are",
            body:
              "Premier League Analytics Dashboard was created to bring live football data, personal insights, and historical analysis together in one platform. The goal is to give users a cleaner and more professional way to follow clubs, compare records, and save their own observations over time.",
          },
          {
            heading: "What We Offer",
            body:
              "The platform combines standings, favorites, notes, team comparison, charts, and historical snapshots so fans can move beyond a simple table view and build a more complete understanding of team performance.",
          },
        ],
      },
      contact: {
        eyebrow: "Contact",
        title: "Need support or want to collaborate?",
        sections: [
          {
            heading: "Contact Details",
            body:
              "For project questions, feedback, or collaboration opportunities, you can reach the Premier League Analytics team at support@premierleagueanalytics.dev. The platform is based in Stockholm, Sweden, and the expected response time is within 1 to 2 business days.",
          },
          {
            heading: "Project Use",
            body:
              "This project is designed as a portfolio-ready fullstack application and can also be discussed as a case study for analytics, user personalization, and dashboard design.",
          },
        ],
      },
      privacy: {
        eyebrow: "Privacy Policy",
        title: "How user information is handled in the platform.",
        sections: [
          {
            heading: "Data Usage",
            body:
              "User data is stored only to support account access, favorites, notes, and historical tracking. Authentication is handled with protected tokens, and passwords are stored as hashed values instead of plain text.",
          },
          {
            heading: "Project Scope",
            body:
              "This platform is intended for educational and portfolio purposes. It demonstrates authentication, protected routes, persistence, and user-specific analytics data in a fullstack environment.",
          },
        ],
      },
      terms: {
        eyebrow: "Terms of Use",
        title: "Guidelines for using the Premier League Analytics Dashboard.",
        sections: [
          {
            heading: "Service Terms",
            body:
              "The platform provides Premier League analytics for informational use. Users are responsible for the content they save in notes and for using the application in a respectful way.",
          },
          {
            heading: "External Data",
            body:
              "External football data is sourced through a third-party API, so availability and freshness depend on that provider. Cached responses may also be used to improve stability and reduce rate-limit issues.",
          },
        ],
      },
    },
  },
  sv: {
    nav: {
      home: "Hem",
      teams: "Lag",
      analytics: "Analys",
      compare: "Jämför",
      favorites: "Favoriter",
      login: "Logga in",
      register: "Registrera",
      logout: "Logga ut",
      language: "Språk",
    },
    home: {
      eyebrow: "Premier League Analytics Plattform",
      title: "Premier League-analys för supportrar som vill ha mer.",
      description:
        "Utforska live-data, jämför klubbar, spara favoriter och följ lagens prestation över tid.",
      explore: "Utforska lag",
      createAccount: "Skapa konto",
      features: [
        {
          title: "Live-tabell",
          description:
            "Följ aktuella Premier League-tabellen, lagens statistik och prestationer på ett ställe.",
        },
        {
          title: "Personlig arbetsyta",
          description:
            "Spara favoritlag, skriv anteckningar och bygg din egen analysyta kring klubbarna du följer mest.",
        },
        {
          title: "Historiska insikter",
          description:
            "Spara snapshots över tid och jämför hur lagen utvecklas med diagram och trendanalys.",
        },
      ],
      footer: "Copyright 2026 Premier League Dashboard | Byggd med React och FastAPI",
      aboutUs: "Om oss",
      contact: "Kontakt",
      privacy: "Integritetspolicy",
      terms: "Användarvillkor",
    },
    login: {
      eyebrow: "Välkommen tillbaka",
      title: "Logga in för att fortsätta",
      description:
        "Använd ditt användarnamn eller din e-post för att öppna analys, lag och favoriter.",
      identifier: "Användarnamn eller e-post",
      identifierPlaceholder: "svens eller svens@example.com",
      password: "Lösenord",
      passwordPlaceholder: "Ange ditt lösenord",
      submit: "Logga in",
      submitting: "Loggar in...",
      failed: "Inloggningen misslyckades.",
      needAccount: "Behöver du ett konto?",
      createOne: "Skapa ett",
    },
    register: {
      eyebrow: "Nytt konto",
      title: "Skapa din inloggning",
      description:
        "Registrera dig en gång, sedan kopplas dina favoriter och analyser till ditt konto.",
      username: "Användarnamn",
      email: "E-post",
      password: "Lösenord",
      submit: "Registrera",
      submitting: "Skapar konto...",
      failed: "Registreringen misslyckades.",
      haveAccount: "Har du redan ett konto?",
      login: "Logga in",
    },
    static: {
      about: {
        eyebrow: "Om oss",
        title: "En modern analysdashboard för Premier League-följare.",
        sections: [
          {
            heading: "Vilka vi är",
            body:
              "Premier League Analytics Dashboard skapades för att samla live fotbollsdata, personliga insikter och historisk analys i en och samma plattform. Målet är att ge användare ett renare och mer professionellt sätt att följa klubbar, jämföra statistik och spara egna observationer över tid.",
          },
          {
            heading: "Vad vi erbjuder",
            body:
              "Plattformen kombinerar tabell, favoriter, anteckningar, lagjämförelser, diagram och historiska snapshots så att supportrar kan gå längre än en enkel tabellvy och få en djupare förståelse för lagens prestationer.",
          },
        ],
      },
      contact: {
        eyebrow: "Kontakt",
        title: "Behöver du hjälp eller vill du samarbeta?",
        sections: [
          {
            heading: "Kontaktuppgifter",
            body:
              "För frågor om projektet, feedback eller samarbetsmöjligheter kan du kontakta Premier League Analytics-teamet via support@premierleagueanalytics.dev. Plattformen är baserad i Stockholm, Sverige, och svarstiden är vanligtvis 1 till 2 arbetsdagar.",
          },
          {
            heading: "Projektets användning",
            body:
              "Detta projekt är utformat som en portfolioanpassad fullstack-applikation och kan även användas som ett case för analys, personalisering och dashboarddesign.",
          },
        ],
      },
      privacy: {
        eyebrow: "Integritetspolicy",
        title: "Hur användarinformation hanteras i plattformen.",
        sections: [
          {
            heading: "Datahantering",
            body:
              "Användardata lagras endast för att stödja konton, favoriter, anteckningar och historisk spårning. Autentisering hanteras med skyddade tokens och lösenord lagras som hashade värden istället för klartext.",
          },
          {
            heading: "Projektets omfattning",
            body:
              "Plattformen är avsedd för utbildnings- och portfolioändamål. Den demonstrerar autentisering, skyddade rutter, persistens och användarspecifik analysdata i en fullstackmiljö.",
          },
        ],
      },
      terms: {
        eyebrow: "Användarvillkor",
        title: "Riktlinjer för användning av Premier League Analytics Dashboard.",
        sections: [
          {
            heading: "Tjänstevillkor",
            body:
              "Plattformen erbjuder Premier League-analys i informationssyfte. Användare ansvarar själva för innehållet de sparar i anteckningar och för att använda applikationen på ett respektfullt sätt.",
          },
          {
            heading: "Extern data",
            body:
              "Extern fotbollsdata hämtas från en tredjeparts-API, så tillgänglighet och aktualitet beror på den leverantören. Cachade svar kan också användas för att förbättra stabiliteten och minska problem med rate limiting.",
          },
        ],
      },
    },
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "en"
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        localStorage.setItem(STORAGE_KEY, nextLanguage);
        setLanguage(nextLanguage);
      },
      t: translations[language],
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
