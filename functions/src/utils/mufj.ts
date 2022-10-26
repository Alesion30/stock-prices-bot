import { launch } from "../services/puppeteer";

const mufjType: Record<string, { id: string; name: string }> = {
  allianceBernstein: {
    id: "m03920420",
    name: "アライアンス・バーンスタイン・米国成長株投信Ｄコース",
  },
} as const;
type MufjType = keyof typeof mufjType;

type MufjData = {
  name: string;
  url: string;
  basePrice: string | null;
  dayChange: string | null;
};

// 三菱UFJ銀行
// https://fs.bk.mufg.jp
export const fetchForMufj = async (type: MufjType): Promise<MufjData> => {
  const { id, name } = mufjType[type];

  const browser = await launch();
  const page = await browser.newPage();
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

  await browser.close();

  return {
    name,
    url: targetUrl,
    basePrice,
    dayChange,
  };
};
