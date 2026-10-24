import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/SiteFrame";

export const Route = createFileRoute("/danke")({
  head: () => ({
    meta: [
      { title: "Danke für deine Bestellung – Lumea" },
      { name: "description", content: "Deine Lumea-Bestellung ist eingegangen." },
      { property: "og:title", content: "Danke – Lumea" },
      { property: "og:description", content: "Deine Bestellung ist eingegangen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-6 pt-20 text-center">
        <h1 className="text-5xl">Danke! <em className="text-primary">Schön, dass du dabei bist.</em></h1>
        <p className="mt-6 text-muted-foreground">Deine erste Packung ist in 2–3 Werktagen bei dir. Eine Bestätigung kommt per E-Mail. Tipp: Nimm Lumea täglich zur gleichen Zeit, am besten zum Frühstück.</p>
        <Link to="/" className="mt-10 inline-block rounded-full border px-6 py-3 hover:bg-muted">Zur Startseite</Link>
      </div>
    </SiteFrame>
  ),
});
