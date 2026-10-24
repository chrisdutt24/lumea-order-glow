import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { unlockFachkreise } from "@/lib/gate.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/fachkreise-zugang")({
  head: () => ({
    meta: [
      { title: "Zugang für Fachkreise – Lumea" },
      { name: "description", content: "Geschützter Bereich mit Fachinformationen für Ärztinnen, Ärzte und Apotheken." },
      { property: "og:title", content: "Lumea für Fachkreise" },
      { property: "og:description", content: "Geschützter Bereich für medizinische Fachkreise." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Zugang,
});

function Zugang() {
  const router = useRouter();
  const unlock = useServerFn(unlockFachkreise);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <SiteFrame>
      <form
        className="mx-auto max-w-md space-y-4 px-6 pt-16"
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setError(null);
          setBusy(true);
          const password = new FormData(e.currentTarget).get("password") as string;
          try {
            const { ok } = await unlock({ data: { password } });
            if (!ok) {
              setError("Das Passwort ist leider falsch.");
              return;
            }
            // A denied visit may have cached a redirect. Re-read the protected
            // page in a fresh request with the newly issued session cookie.
            await router.navigate({ to: "/fachkreise", reloadDocument: true });
          } catch {
            setError("Der Zugang konnte nicht geöffnet werden. Bitte versuche es erneut.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <h1 className="text-4xl">Für Fachkreise</h1>
        <p className="text-sm text-muted-foreground">Dieser Bereich richtet sich gemäß § 2 HWG ausschließlich an Ärztinnen, Ärzte und Apothekerinnen und Apotheker.</p>
        <input name="password" type="password" aria-label="Passwort" autoComplete="current-password" required className="field" placeholder="Passwort" />
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={busy} className="h-auto w-full rounded-full bg-ink py-3.5 font-medium text-ink-foreground hover:bg-ink hover:opacity-90">{busy ? "Wird geöffnet …" : "Bereich öffnen"}</Button>
      </form>
    </SiteFrame>
  );
}
