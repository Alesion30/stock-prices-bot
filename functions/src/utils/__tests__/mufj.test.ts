import {
  castBasePrice,
  castDayChange,
  fetchMufj,
  MufjBrand,
  mufjBrands,
} from "../mufj";

describe("fetchMufj", () => {
  jest.setTimeout(10000);

  const brands = Object.keys(mufjBrands) as MufjBrand[];
  for (const brand of brands) {
    const brandName = mufjBrands[brand].name;
    it(brandName, async () => {
      const result = await fetchMufj(brand, { browser });
      expect(result.name).toBe(mufjBrands[brand].name);
      expect(typeof result.basePrice).toBe("number");
      expect(typeof result.dayChange).toBe("number");
    });
  }

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
