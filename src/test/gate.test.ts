import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({
  data: { unlocked: false },
  update: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator() { return this; },
    handler: (handler: (...args: any[]) => any) => handler,
  }),
}));
vi.mock("@tanstack/react-start/server", () => ({ useSession: async () => session }));

import { getFachinfo, lockFachkreise, unlockFachkreise } from "@/lib/gate.functions";

describe("Fachkreise password access", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_PASSWORD", "test-only-password");
    vi.stubEnv("SESSION_SECRET", "test-only-session-key-with-at-least-32-characters");
    session.data.unlocked = false;
    session.update.mockImplementation(async (data) => Object.assign(session.data, data));
    session.clear.mockImplementation(async () => { session.data.unlocked = false; });
  });
  afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });

  // The mocked builder exposes the actual server handler for isolated checks.
  const unlock = unlockFachkreise as unknown as (input: { data: { password: string } }) => Promise<{ ok: boolean }>;

  it("does not expose articles without an unlocked session", async () => {
    await expect(getFachinfo()).rejects.toMatchObject({ options: { to: "/fachkreise-zugang" } });
  });

  it("rejects an incorrect password without creating access", async () => {
    expect(await unlock({ data: { password: "incorrect" } })).toEqual({ ok: false });
    expect(session.update).not.toHaveBeenCalled();
    expect(session.data.unlocked).toBe(false);
  });

  it("allows reading articles after the correct password", async () => {
    expect(await unlock({ data: { password: "test-only-password" } })).toEqual({ ok: true });
    const info = await getFachinfo();
    expect(info.evidence.length).toBeGreaterThan(0);
    expect(info.safety.length).toBeGreaterThan(0);
  });

  it("revokes article access when locking the session", async () => {
    await unlock({ data: { password: "test-only-password" } });
    await lockFachkreise();
    await expect(getFachinfo()).rejects.toMatchObject({ options: { to: "/fachkreise-zugang" } });
  });
});