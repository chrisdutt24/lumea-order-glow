import { beforeEach, describe, expect, it } from "vitest";
import { CONSENT_KEY, CONSENT_NOTICE, TRACKING_CONFIG, createTrackingController, readConsent, saveConsent } from "@/lib/tracking";

describe("Placeholder tracking", () => {
  beforeEach(() => localStorage.clear());
  it("uses the requested placeholder IDs without live transport", () => {
    expect(TRACKING_CONFIG).toEqual({ metaPixelId: "1234567890", ga4MeasurementId: "G-LUMEA0000", mode: "local-test" });
  });
  it("does not initialize or record without explicit consent", () => {
    const tracker = createTrackingController();
    tracker.update({ marketing: false, analytics: false }, "a", "/");
    expect(tracker.events).toEqual([]);
    expect(tracker.commands).toEqual({ meta: [], ga4: [] });
  });
  it("initializes once and records each committed view exactly once", () => {
    const tracker = createTrackingController();
    const yes = { marketing: true, analytics: true };
    tracker.update(yes, "a", "/");
    tracker.update(yes, "a", "/");
    tracker.update(yes, "b", "/bestellen");
    tracker.update(yes, "c", "/");
    expect(tracker.events.filter(e => e.provider === "meta")).toHaveLength(3);
    expect(tracker.events.filter(e => e.provider === "ga4")).toHaveLength(3);
    expect(tracker.commands.meta.filter(c => c[0] === "init")).toEqual([["init", "1234567890", {}, { agent: "lovable" }]]);
    expect(tracker.commands.ga4.filter(c => c[0] === "config")).toHaveLength(1);
  });
  it("separates marketing from analytics consent", () => {
    const tracker = createTrackingController();
    tracker.update({ marketing: false, analytics: true }, "a", "/");
    expect(tracker.events.map(e => e.provider)).toEqual(["ga4"]);
    expect(tracker.commands.meta).toEqual([]);
  });
  it("stops on withdrawal and never replays blocked views", () => {
    const tracker = createTrackingController();
    tracker.update({ marketing: true, analytics: true }, "a", "/");
    tracker.update({ marketing: false, analytics: false }, "b", "/bestellen");
    tracker.update({ marketing: true, analytics: true }, "c", "/danke");
    expect(tracker.events.map(e => e.viewKey)).toEqual(["a", "a", "c", "c"]);
    expect(tracker.commands.meta).toContainEqual(["consent", "revoke"]);
  });
  it("preserves explicit acceptance evidence when consent is withdrawn", () => {
    const accepted = saveConsent(localStorage, { marketing: true, analytics: false });
    const withdrawn = saveConsent(localStorage, { marketing: false, analytics: false });
    expect(withdrawn.visitorId).toBe(accepted.visitorId);
    expect(withdrawn.notice).toBe(CONSENT_NOTICE);
    expect(withdrawn.history.map(h => h.marketing)).toEqual([true, false]);
    expect(readConsent(localStorage)?.marketing).toBe(false);
  });
  it("fails closed for absent or malformed evidence", () => {
    expect(readConsent(localStorage)).toBeNull();
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ marketing: true }));
    expect(readConsent(localStorage)).toBeNull();
  });
});