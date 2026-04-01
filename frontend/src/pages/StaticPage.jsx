function StaticPage({ eyebrow, title, sections = [] }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-200/80">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">{title}</h1>

        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-white">{section.heading}</h2>
              <p className="mt-3 text-sm leading-8 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StaticPage;
