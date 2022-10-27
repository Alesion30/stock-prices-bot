import { castBasePrice, castDayChange, fetchMufj, mufjBrands } from "../mufj";

describe("fetchMufj", () => {
  jest.setTimeout(10000);

  it("アライアンス・バーンスタイン・米国成長株投信Ｄコース", async () => {
    const result = await fetchMufj("allianceBernstein", { browser });
    expect(result.name).toBe(mufjBrands["allianceBernstein"].name);
    expect(typeof result.basePrice).toBe("number");
    expect(typeof result.dayChange).toBe("number");
  });

  it("castBasePrice", async () => {
    expect(castBasePrice("10,000")).toBe(10000);
    expect(castBasePrice(null)).toBeNull();
  });

  it("castDayChange", async () => {
    expect(castDayChange("+100円")).toBe(100);
    expect(castDayChange("-100円")).toBe(-100);
    expect(castDayChange(null)).toBeNull();
  });
});
