import { fetchForMufj, mufjType } from "../mufj";

describe("fetchForMufj", () => {
  jest.setTimeout(10000);

  it("アライアンス・バーンスタイン・米国成長株投信Ｄコース", async () => {
    const result = await fetchForMufj("allianceBernstein");
    expect(result.name).toBe(mufjType["allianceBernstein"].name);
    expect(result.basePrice).not.toBeNull();
    expect(result.dayChange).not.toBeNull();
  });
});
