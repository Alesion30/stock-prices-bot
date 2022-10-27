import { castSafetyNumber } from "../castSafetyNumber";

describe("castSafetyNumber", () => {
  it("正常系", async () => {
    expect(castSafetyNumber("10000")).toBe(10000);
    expect(castSafetyNumber("-10000")).toBe(-10000);
    expect(castSafetyNumber(null)).toBeNull();
  });

  it("異常系", async () => {
    expect(castSafetyNumber("10,000")).toBeNull();
    expect(castSafetyNumber("hoge")).toBeNull();
  });
});
