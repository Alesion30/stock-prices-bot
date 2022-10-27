import { Page } from "puppeteer";
import { castSafetyNumber } from "./castSafetyNumber";

export const mufjType: Record<string, { id: string; name: string }> = {
  allianceBernstein: {
    id: "m03920420",
    name: "アライアンス・バーンスタイン・米国成長株投信Ｄコース",
  },
} as const;
type MufjType = keyof typeof mufjType;

type MufjData = {
  name: string;
  url: string;
  basePrice: number | null;
  dayChange: number | null;
};

type FetchMufjOptions = {
  page: Page;
};

// 三菱UFJ銀行
// https://fs.bk.mufg.jp
export const fetchMufj = async (
  type: MufjType,
  { page }: FetchMufjOptions,
): Promise<MufjData> => {
  const { id, name } = mufjType[type];
  const targetUrl = `https://fs.bk.mufg.jp/webasp/mufg/fund/detail/${id}.html`;
  await page.goto(targetUrl);

  // 基準価額
  const basePriceSelector = "#kijyunKagaku";
  await page.waitForSelector(basePriceSelector);
  const basePrice =
    (await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.textContent;
    }, basePriceSelector)) ?? null;

  // 前日比
  const dayChangeSelector = "#dayChange";
  await page.waitForSelector(dayChangeSelector);
  const dayChange =
    (await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.textContent;
    }, dayChangeSelector)) ?? null;

  return {
    name,
    url: targetUrl,
    basePrice: castBasePrice(basePrice),
    dayChange: castDayChange(dayChange),
  };
};

export const castBasePrice = (textContent: string | null) => {
  return textContent !== null
    ? castSafetyNumber(textContent.replace(/,/, ""))
    : null;
};

export const castDayChange = (textContent: string | null) => {
  return textContent !== null
    ? castSafetyNumber(textContent.replace(/円/, ""))
    : null;
};
