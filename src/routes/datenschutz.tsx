import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({ meta: [
    { title: "Datenschutz und Cookie-Einstellungen – Lumea" },
    { name: "description", content: "Informationen zu lokalen Tracking-Tests und freiwilligen Cookie-Einstellungen bei Lumea." },
    { property: "og:title", content: "Datenschutz – Lumea" },
    { property: "og:description", content: "Lokale Tracking-Tests, Einwilligung und Widerruf bei Lumea." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Privacy,
});

function Privacy() {
  return <SiteFrame><article className="mx-auto max-w-3xl space-y-6 px-6 pt-8 text-sm leading-relaxed">
    <h1 className="text-4xl">Datenschutz</h1>
    <h2 className="text-2xl">Lokale Tracking-Tests</h2>
    <p>Meta Pixel (Platzhalter 1234567890) und Google Analytics 4 (Platzhalter G-LUMEA0000) werden ausschließlich lokal simuliert. Es werden keine Skripte dieser Anbieter geladen und keine Daten an Meta Platforms oder Google übermittelt. Die Testereignisse bleiben im Arbeitsspeicher dieses Browserfensters und verschwinden beim Neuladen.</p>
    <p>Nach freiwilliger Zustimmung werden Seitenaufrufe getrennt für Marketing (Meta: Messung und gegebenenfalls Werbeoptimierung) und Analyse (Google Analytics: Nutzungsmessung) lokal simuliert. Die Tests enthalten nur den Seitenpfad, keine Formulardaten, URL-Suchparameter oder Kundenkennungen.</p>
    <h2 className="text-2xl">Einwilligung und Widerruf</h2>
    <p>Deine Auswahl wird im Browser gespeichert, zusammen mit einer zufälligen lokalen Besucherkennung, Zeitpunkten, dem angezeigten Hinweis und der Auswahlhistorie. Die Region wird nicht ermittelt; ohne ausdrückliche Zustimmung bleibt jeder optionale Zweck ausgeschaltet. Frühere Zustimmungen bleiben bei einem Widerruf in der lokalen Historie erhalten. Du kannst beide Zwecke einzeln ablehnen oder jederzeit ändern. Eine Änderung gilt auch für andere geöffnete Fenster derselben Website. Abgelehnte Seitenaufrufe werden nicht nachträglich nachgeholt.</p>
    <Button variant="outline" onClick={() => window.dispatchEvent(new Event("lumea-cookie-settings"))}>Cookie-Einstellungen</Button>
    <h2 className="text-2xl">Vor einer echten Aktivierung</h2>
    <p>Der Austausch der Platzhalter allein aktiviert keine Übermittlung. Vor einer echten Integration müssen die zulässigen Daten und Seiten, die Einschränkungen der jeweiligen Datenquelle, die Empfänger und gegebenenfalls internationale Datenübermittlungen geprüft und diese Hinweise ergänzt werden. Gesundheitsdaten und daraus abgeleitete Informationen dürfen nicht an Meta gesendet werden, auch nicht mit Einwilligung. Bestell- und Fachinformationen erfordern besondere Prüfung.</p>
  </article></SiteFrame>;
}