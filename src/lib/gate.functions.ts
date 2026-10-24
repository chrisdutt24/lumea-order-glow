import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "lumea-fachkreise",
    maxAge: 60 * 60 * 24 * 7,
    cookie: { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" },
  };
}

function passwordMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const unlockFachkreise = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => ({ password: String(data.password ?? "") }))
  .handler(async ({ data }) => {
    const expected = process.env["SITE_PASSWORD"];
    if (!expected) throw new Error("SITE_PASSWORD is not set");
    if (!passwordMatches(data.password, expected)) return { ok: false as const };
    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockFachkreise = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const getFachinfo = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  if (!session.data.unlocked) throw redirect({ to: "/fachkreise-zugang" });
  return {
    composition: [
      { name: "Traubensilberkerzen-Trockenextrakt (Cimicifuga racemosa, Wurzelstock)", amount: "6,5 mg", nrv: "–" },
      { name: "Vitamin B6 (Pyridoxinhydrochlorid)", amount: "1,4 mg", nrv: "100 %" },
      { name: "Vitamin D3 (Cholecalciferol, vegan aus Flechten)", amount: "20 µg (800 I.E.)", nrv: "400 %" },
      { name: "Magnesium (Magnesiumcitrat)", amount: "150 mg", nrv: "40 %" },
    ],
    evidence: [
      "Für Cimicifuga-Extrakte liegen klinische Daten zu klimakterischen Beschwerden vor, überwiegend für standardisierte Arzneimittel-Extrakte in Tagesdosen von ca. 20–40 mg. Die Ergebnisse sind heterogen (Cochrane-Review 2012: keine gesicherte Überlegenheit gegenüber Placebo bei Hitzewallungen).",
      "Die Tagesdosis in Lumea (6,5 mg) liegt unter den in Arzneimittelstudien verwendeten Dosen. Studienergebnisse zu Arzneimitteln – etwa eine Reduktion von Hitzewallungen um einen bestimmten Prozentsatz – sind daher nicht auf Lumea übertragbar. Lumea ist ein Nahrungsergänzungsmittel, kein Arzneimittel.",
      "Zugelassene Health Claims (VO 1924/2006) betreffen ausschließlich die Vitamine und Magnesium, z. B.: Vitamin B6 trägt zur Regulierung der Hormontätigkeit bei; Vitamin B6 und Magnesium tragen zur Verringerung von Müdigkeit und Ermüdung bei; Vitamin D trägt zur Erhaltung normaler Knochen bei.",
    ],
    safety: [
      "Seltene Berichte über Leberschäden im Zusammenhang mit Cimicifuga (EMA/HMPC). Nicht bei bekannter Lebererkrankung; bei Symptomen wie Gelbsucht, dunklem Urin oder Oberbauchschmerzen absetzen.",
      "Nicht empfohlen in Schwangerschaft und Stillzeit sowie bei Östrogen-abhängigen Tumoren in der Anamnese ohne ärztliche Rücksprache.",
      "Vitamin D: bei gleichzeitiger Einnahme weiterer Vitamin-D-Präparate Gesamtdosis beachten.",
      "Magnesium: Abstand von 2–3 Stunden zu Tetrazyklinen, Chinolonen und Bisphosphonaten.",
    ],
  };
});
