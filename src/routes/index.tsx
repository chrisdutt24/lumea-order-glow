import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { SiteFrame } from "@/components/SiteFrame";
import { FIRST_MONTH_PRICE, MONTHLY_PRICE, formatEuro } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumea – eine Kapsel am Tag für die Jahre um die Wechseljahre" },
      { name: "description", content: "Lumea: vegan, ohne Hormone, hergestellt in Deutschland. Mit Vitamin B6, das zur Regulierung der Hormontätigkeit beiträgt. Erster Monat 14,50 €." },
      { property: "og:title", content: "Lumea – eine Kapsel am Tag" },
      { property: "og:description", content: "Vegan, ohne Hormone, von einer Ärztin mitentwickelt. Monatlich kündbar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ingredients = [
  { name: "Vitamin B6", amount: "1,4 mg", claim: "trägt zur Regulierung der Hormontätigkeit bei und zur Verringerung von Müdigkeit." },
  { name: "Magnesium", amount: "150 mg", claim: "trägt zu einer normalen psychischen Funktion und normalen Muskelfunktion bei." },
  { name: "Vitamin D3", amount: "20 µg", claim: "trägt zur Erhaltung normaler Knochen und Muskelfunktion bei." },
  { name: "Traubensilberkerze", amount: "6,5 mg Extrakt", claim: "eine traditionell genutzte Pflanze, sorgfältig dosiert." },
];

function Index() {
  return (
    <SiteFrame>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-8 md:grid-cols-2">
        <div>
          <p className="mb-5 inline-block rounded-full bg-sage px-3 py-1 text-xs font-medium text-sage-foreground">Vegan · ohne Hormone · Made in Germany</p>
          <h1 className="text-5xl leading-[1.05] md:text-6xl">Mitten im Leben.<br /><em className="text-primary">Und gut versorgt.</em></h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">Eine Kapsel am Tag für die Jahre um die Wechseljahre – mitentwickelt von einer Ärztin. Mit Vitamin B6, das zur Regulierung der Hormontätigkeit beiträgt.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/bestellen" className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-foreground hover:opacity-90">Ersten Monat für {formatEuro(FIRST_MONTH_PRICE)}</Link>
            <span className="text-sm text-muted-foreground">danach {formatEuro(MONTHLY_PRICE)}/Monat · jederzeit kündbar</span>
          </div>
        </div>
        <img src={hero} alt="Frau um die 50 entspannt am Fenster" width={1280} height={1440} className="aspect-[8/9] w-full rounded-2xl object-cover" />
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-6">
        <h2 className="max-w-xl text-4xl">Vier Inhaltsstoffe. Nichts Überflüssiges.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ingredients.map((i) => (
            <div key={i.name} className="rounded-xl border bg-card p-6">
              <p className="font-display text-xl">{i.name}</p>
              <p className="text-sm text-primary">{i.amount}</p>
              <p className="mt-3 text-sm text-muted-foreground">{i.name} {i.claim}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-6">
        <div className="grid gap-10 rounded-2xl bg-ink p-10 text-ink-foreground md:grid-cols-3 md:p-14">
          <div className="md:col-span-2">
            <h2 className="text-4xl">Von zwei Frauen, die es selbst wissen wollten.</h2>
            <p className="mt-5 max-w-xl opacity-80">Lumea wurde 2025 in Berlin von einer Ärztin und einer Produktmanagerin gegründet. Kein Hormonpräparat, kein Heilversprechen – sondern eine ehrliche, gut dosierte Ergänzung für den Alltag. 300 Frauen sind schon dabei.</p>
          </div>
          <ul className="space-y-3 text-sm">
            <li>✓ Monatlich kündbar, mit einem Klick</li>
            <li>✓ Versand in Deutschland inklusive</li>
            <li>✓ Kreditkarte oder PayPal</li>
            <li>✓ Hergestellt in Deutschland</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-3xl px-6 text-center">
        <h2 className="text-4xl">Probier es einen Monat lang.</h2>
        <p className="mt-4 text-muted-foreground">Erster Monat {formatEuro(FIRST_MONTH_PRICE)}, danach {formatEuro(MONTHLY_PRICE)} im Monat. Kündbar, wann immer du willst.</p>
        <Link to="/bestellen" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground hover:opacity-90">Jetzt starten</Link>
      </section>
    </SiteFrame>
  );
}
