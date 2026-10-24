import { describe, expect, it } from "vitest";
import { priceForMonth } from "@/lib/pricing";

describe("Abo-Preis", () => {
  it("erster Monat kostet 14,50 €", () => expect(priceForMonth(1)).toBe(14.5));
  it("ab dem zweiten Monat 29 €", () => {
    expect(priceForMonth(2)).toBe(29);
    expect(priceForMonth(7)).toBe(29);
  });
});
