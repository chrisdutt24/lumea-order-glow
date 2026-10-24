import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteFrame } from "@/components/SiteFrame";
import { getFachinfo, lockFachkreise } from "@/lib/gate.functions";

export const Route = createFileRoute("/fachkreise")({
  loader: () => getFachinfo(),
  head: () => ({
    meta: [
      { title: "Fachinformation Lumea – für Fachkreise" },
      { name: "description", content: "Zusammensetzung, Studienlage und Sicherheitshinweise zu Lumea für medizinische Fachkreise." },
      { property: "og:title", content: "Lumea Fachinformation" },
      { property: "og:description", content: "Geschützte Fachinformation für Ärztinnen und Apotheken." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Fachkreise,
});

function Fachkreise() {
  const info = Route.useLoaderData();
  const router = useRouter();
  const lock = useServerFn(lockFachkreise);
  return (
    <SiteFrame>
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Fachinformation</p>
            <h1 className="mt-2 text-4xl">Lumea – Nahrungsergänzungsmittel</h1>
            <p className="mt-2 text-muted-foreground">Verzehrempfehlung: 1 Kapsel täglich mit Flüssigkeit. Vegan, hormonfrei, hergestellt in Deutschland.</p>
          </div>
          <button
            onClick={async () => { await lock(); await router.navigate({ to: "/fachkreise-zugang" }); }}
            className="shrink-0 rounded-full border px-4 py-2 text-sm hover:bg-muted"
          >Abmelden</button>
        </div>

        <h2 className="mt-12 text-2xl">Zusammensetzung pro Kapsel</h2>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">Inhaltsstoff</th><th>Menge</th><th>% NRV</th></tr></thead>
          <tbody>
            {info.composition.map((c) => (
              <tr key={c.name} className="border-b"><td className="py-3 pr-4">{c.name}</td><td>{c.amount}</td><td>{c.nrv}</td></tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-12 text-2xl">Studienlage und Einordnung</h2>
        <ul className="mt-4 space-y-3">{info.evidence.map((t) => <li key={t} className="rounded-lg bg-card border p-4 text-sm leading-relaxed">{t}</li>)}</ul>

        <h2 className="mt-12 text-2xl">Sicherheit und Wechselwirkungen</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">{info.safety.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </SiteFrame>
  );
}
