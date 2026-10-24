import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY, CONSENT_NOTICE, createTrackingController, readConsent, saveConsent, type Choices } from "@/lib/tracking";

const denied: Choices = { marketing: false, analytics: false };

export function TrackingConsent() {
  const location = useRouterState({ select: (state) => state.resolvedLocation ?? state.location });
  const [open, setOpen] = useState(false);
  const [choices, setChoices] = useState<Choices>(denied);
  const [error, setError] = useState("");

  useEffect(() => {
    const synchronize = () => {
      let record = null;
      try { record = readConsent(window.localStorage); } catch { /* Fail closed. */ }
      setChoices(record ?? denied);
      setOpen(record === null);
      const controller = window.__lumeaTracking ?? createTrackingController();
      window.__lumeaTracking = controller;
      controller.update(record ?? denied, String(location.state.__TSR_key ?? location.href), location.pathname);
    };
    synchronize();
    const storageChanged = (event: StorageEvent) => { if (event.key === CONSENT_KEY || event.key === null) synchronize(); };
    const settings = () => { setOpen(true); setError(""); };
    window.addEventListener("storage", storageChanged);
    window.addEventListener("lumea-cookie-settings", settings);
    return () => {
      window.removeEventListener("storage", storageChanged);
      window.removeEventListener("lumea-cookie-settings", settings);
    };
  }, [location]);

  function commit(next: Choices) {
    try {
      saveConsent(window.localStorage, next);
      setChoices(next);
      window.__lumeaTracking?.update(next, String(location.state.__TSR_key ?? location.href), location.pathname);
      setOpen(false);
    } catch {
      window.__lumeaTracking?.update(denied, String(location.state.__TSR_key ?? location.href), location.pathname);
      setError("Die Auswahl konnte nicht gespeichert werden. Die Messung bleibt ausgeschaltet.");
    }
  }

  if (!open) return null;
  return (
    <section role="dialog" aria-modal="false" aria-labelledby="consent-heading" className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-5">
        <h2 id="consent-heading" className="text-xl">Deine Cookie-Einstellungen</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">{CONSENT_NOTICE} <Link to="/datenschutz" className="text-primary underline">Datenschutz</Link></p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={choices.marketing} onChange={(event) => setChoices({ ...choices, marketing: event.target.checked })} />Marketing (Meta)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={choices.analytics} onChange={(event) => setChoices({ ...choices, analytics: event.target.checked })} />Analyse (Google Analytics)</label>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => commit(denied)}>Alle ablehnen</Button>
          <Button variant="outline" onClick={() => commit(choices)}>Auswahl speichern</Button>
          <Button variant="outline" onClick={() => commit({ marketing: true, analytics: true })}>Alle akzeptieren</Button>
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      </div>
    </section>
  );
}