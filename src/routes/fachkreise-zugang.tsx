import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { unlockFachkreise } from "@/lib/gate.functions";

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
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <SiteFrame>
      <form
        className="mx-auto max-w-md space-y-4 px-6 pt-16"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const password = new FormData(e.currentTarget).get("password") as string;
          const { ok } = await unlock({ data: { password } });
          setBusy(false);
          if (ok) await router.navigate({ to: "/fachkreise" });
          else setError(true);
        }}
      >
        <h1 className="text-4xl">Für Fachkreise</h1>
        <p className="text-sm text-muted-foreground">Dieser Bereich richtet sich gemäß § 2 HWG ausschließlich an Ärztinnen, Ärzte und Apothekerinnen und Apotheker.</p>
        <input name="password" type="password" aria-label="Passwort" autoComplete="current-password" required className="field" placeholder="Passwort" />
        {error && <p className="text-sm text-destructive">Das Passwort ist leider falsch.</p>}
        <button disabled={busy} className="w-full rounded-full bg-ink py-3.5 font-medium text-ink-foreground hover:opacity-90">Bereich öffnen</button>
      </form>
    </SiteFrame>
  );
}
