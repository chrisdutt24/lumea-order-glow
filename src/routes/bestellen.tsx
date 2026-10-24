import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFrame } from "@/components/SiteFrame";
import { FIRST_MONTH_PRICE, MONTHLY_PRICE, formatEuro } from "@/lib/pricing";

export const Route = createFileRoute("/bestellen")({
  head: () => ({
    meta: [
      { title: "Lumea bestellen – erster Monat 14,50 €" },
      { name: "description", content: "Starte dein Lumea-Abo: erster Monat 14,50 €, danach 29 € pro Monat, jederzeit kündbar." },
      { property: "og:title", content: "Lumea bestellen" },
      { property: "og:description", content: "Erster Monat 14,50 €, danach 29 €/Monat, jederzeit kündbar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Bestellen,
});

function Bestellen() {
  const navigate = useNavigate();
  const [pay, setPay] = useState<"card" | "paypal">("card");
  return (
    <SiteFrame>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 pt-6 md:grid-cols-[1fr_320px]">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/danke" });
          }}
        >
          <h1 className="text-4xl">Dein Lumea-Abo</h1>
          <div className="grid gap-4 sm:grid-cols-2">
            <input required className="field" placeholder="Vorname" />
            <input required className="field" placeholder="Nachname" />
          </div>
          <input required type="email" className="field" placeholder="E-Mail" />
          <input required className="field" placeholder="Straße und Hausnummer" />
          <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
            <input required className="field" placeholder="PLZ" pattern="\d{5}" />
            <input required className="field" placeholder="Ort" />
          </div>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-medium">Zahlungsart</legend>
            {(["card", "paypal"] as const).map((p) => (
              <label key={p} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${pay === p ? "border-primary bg-accent" : "bg-card"}`}>
                <input type="radio" name="pay" checked={pay === p} onChange={() => setPay(p)} />
                {p === "card" ? "Kreditkarte" : "PayPal"}
              </label>
            ))}
          </fieldset>
          <label className="flex gap-3 text-sm text-muted-foreground">
            <input required type="checkbox" className="mt-1" />
            Ich verstehe, dass mein Abo nach dem ersten Monat automatisch zu {formatEuro(MONTHLY_PRICE)} pro Monat weiterläuft und jederzeit kündbar ist.
          </label>
          <button type="submit" className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground hover:opacity-90">
            Zahlungspflichtig bestellen
          </button>
        </form>
        <aside className="h-fit rounded-xl border bg-card p-6 text-sm">
          <p className="font-display text-xl">Übersicht</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between"><span>Erster Monat (30 Kapseln)</span><span>{formatEuro(FIRST_MONTH_PRICE)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Versand</span><span>inklusive</span></div>
            <div className="flex justify-between border-t pt-2 font-medium"><span>Heute</span><span>{formatEuro(FIRST_MONTH_PRICE)}</span></div>
          </div>
          <p className="mt-4 text-muted-foreground">Danach {formatEuro(MONTHLY_PRICE)} pro Monat. Kündbar jederzeit.</p>
        </aside>
      </div>
    </SiteFrame>
  );
}
