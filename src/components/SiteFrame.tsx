import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl font-semibold text-primary">lumea</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/fachkreise" className="text-muted-foreground hover:text-foreground">Für Fachkreise</Link>
          <Link to="/bestellen" className="rounded-full bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">Jetzt starten</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-24">
        <div className="mx-auto max-w-6xl px-6 py-10 text-xs leading-relaxed text-muted-foreground space-y-2">
          <p>Lumea Health GmbH, Berlin · Nahrungsergänzungsmittel. Die angegebene empfohlene tägliche Verzehrmenge darf nicht überschritten werden. Nahrungsergänzungsmittel sind kein Ersatz für eine ausgewogene und abwechslungsreiche Ernährung und eine gesunde Lebensweise. Außerhalb der Reichweite von kleinen Kindern lagern.</p>
          <p>Bei anhaltenden oder starken Beschwerden sprich bitte mit deiner Ärztin oder deinem Arzt.</p>
        </div>
      </footer>
    </div>
  );
}
