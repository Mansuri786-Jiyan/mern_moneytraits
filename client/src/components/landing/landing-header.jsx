import { Moon, Sun, Sparkles } from "lucide-react";

export default function LandingHeader({ effectiveTheme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          MoneyTrails JS
        </div>
        <button
          onClick={onToggleTheme}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-accent"
          aria-label="Toggle theme"
        >
          {effectiveTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {effectiveTheme === "dark" ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
