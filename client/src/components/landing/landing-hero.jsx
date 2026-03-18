export default function LandingHero() {
  return (
    <section className="space-y-6">
      <p className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
        Fully working JavaScript frontend + backend
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Convert <span className="text-primary">USD to INR</span> in real time
      </h1>
      <p className="text-muted-foreground sm:text-lg">
        Modern, responsive landing page with light/dark mode and a live converter connected to your backend API.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Stack</p>
          <p className="font-semibold">React + Express</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Mode</p>
          <p className="font-semibold">Light / Dark</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Responsive</p>
          <p className="font-semibold">Mobile First</p>
        </div>
      </div>
    </section>
  );
}
