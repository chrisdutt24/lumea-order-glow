// Deliberately local-only: placeholder IDs do not authorize health-context data sharing.
export const TRACKING_CONFIG = Object.freeze({ metaPixelId: "1234567890", ga4MeasurementId: "G-LUMEA0000", mode: "local-test" });
export const CONSENT_KEY = "lumea-consent-v1";
export const CONSENT_NOTICE = "Optionale Messung von Seitenaufrufen: Marketing mit Meta und Analyse mit Google Analytics. Aktuell ausschließlich lokale Tests ohne Übermittlung an Meta oder Google. Beide Zwecke sind freiwillig und jederzeit über Cookie-Einstellungen widerrufbar.";

export type Choices = { marketing: boolean; analytics: boolean };
export type ConsentRecord = Choices & { visitorId: string; recordedAt: string; notice: string; version: 1; region: "unknown"; history: Array<Choices & { recordedAt: string }> };
export type TrackingEvent = { provider: "meta" | "ga4"; event: "PageView" | "page_view"; viewKey: string; path: string; mode: "local-test" };
export type MetaQueue = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][]; push?: MetaQueue; loaded: boolean; version: string };
declare global {
  interface Window {
    fbq?: MetaQueue;
    _fbq?: MetaQueue;
    dataLayer?: unknown[][];
    __lumeaTracking?: ReturnType<typeof createTrackingController>;
  }
}

export function readConsent(storage: Pick<Storage, "getItem">): ConsentRecord | null {
  try {
    const value = JSON.parse(storage.getItem(CONSENT_KEY) ?? "null");
    if (value?.version !== 1 || value.notice !== CONSENT_NOTICE || typeof value.marketing !== "boolean" || typeof value.analytics !== "boolean" || typeof value.visitorId !== "string" || typeof value.recordedAt !== "string" || !Array.isArray(value.history)) return null;
    return value as ConsentRecord;
  } catch { return null; }
}

export function saveConsent(storage: Pick<Storage, "getItem" | "setItem">, choices: Choices): ConsentRecord {
  const prior = readConsent(storage);
  const recordedAt = new Date().toISOString();
  const record: ConsentRecord = { ...choices, version: 1, visitorId: prior?.visitorId ?? crypto.randomUUID(), recordedAt, notice: CONSENT_NOTICE, region: "unknown", history: [...(prior?.history ?? []), { ...choices, recordedAt }] };
  storage.setItem(CONSENT_KEY, JSON.stringify(record));
  return record;
}

export function createTrackingController() {
  const events: TrackingEvent[] = [];
  const commands: { meta: unknown[][]; ga4: unknown[][] } = { meta: [], ga4: [] };
  const seen = { meta: new Set<string>(), ga4: new Set<string>() };
  let metaInitialized = false;
  let ga4Initialized = false;
  let marketingAllowed = false;
  let analyticsAllowed = false;
  return {
    config: TRACKING_CONFIG, events, commands,
    update(choices: Choices, viewKey: string, path: string) {
      // No SDK, noscript beacon, cookie reads, fetch, or external script in placeholder mode.
      if (choices.marketing && !metaInitialized) {
        commands.meta.push(["init", TRACKING_CONFIG.metaPixelId, {}, { agent: "lovable" }]);
        metaInitialized = true;
      }
      if (metaInitialized && marketingAllowed !== choices.marketing) commands.meta.push(["consent", choices.marketing ? "grant" : "revoke"]);
      if (choices.analytics && !ga4Initialized) {
        commands.ga4.push(["set", "developer_id.dZjgwMW", true], ["config", TRACKING_CONFIG.ga4MeasurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false }]);
        ga4Initialized = true;
      }
      marketingAllowed = choices.marketing;
      analyticsAllowed = choices.analytics;
      for (const provider of ["meta", "ga4"] as const) {
        const allowed = provider === "meta" ? marketingAllowed : analyticsAllowed;
        if (!allowed || seen[provider].has(viewKey)) continue;
        seen[provider].add(viewKey);
        const event = provider === "meta" ? "PageView" : "page_view";
        // Store only pathname locally; never query strings, form data, titles or identifiers.
        events.push({ provider, event, viewKey, path, mode: "local-test" });
        commands[provider].push(provider === "meta" ? ["track", event] : ["event", event, { page_path: path }]);
      }
    },
  };
}