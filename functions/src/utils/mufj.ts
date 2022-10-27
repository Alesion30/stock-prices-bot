import { Dayjs } from "dayjs";
import { Browser } from "puppeteer";
import { getNow } from "../services/dayjs";
import { castSafetyNumber } from "./castSafetyNumber";

export type MufjBrand = "allianceBernstein" | "emaxis";
export const mufjBrands: Record<MufjBrand, { id: string; name: string }> = {
  allianceBernstein: {
    id: "m03920420",
    name: "アライアンス・バーンスタイン・米国成長株投信Ｄコース",
  },
  emaxis: {
    id: "m00342620",
    name: "ｅＭＡＸＩＳ 日経225インデックス",
  },
} as const;

type MufjData = {
  name: string;
  url: string;
  basePrice: number | null;
  dayChange: number | null;
  time: Dayjs;
};

type FetchMufjOptions = {
  browser: Browser;
};

// 三菱UFJ銀行
// https://fs.bk.mufg.jp
export const fetchMufj = async (
  type: MufjBrand,
  { browser }: FetchMufjOptions,
): Promise<MufjData> => {
  const page = await browser.newPage();

  const { id, name } = mufjBrands[type];
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
    time: getNow(),
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
