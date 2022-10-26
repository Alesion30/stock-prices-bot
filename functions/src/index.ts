import * as dayjs from "dayjs";
import * as functions from "firebase-functions";
import { instance } from "gaxios";
import { launch } from "puppeteer";
import * as utc from "dayjs/plugin/utc";
import * as tz from "dayjs/plugin/timezone";

export const helloWorld = functions.https.onRequest(async (_, response) => {
  dayjs.extend(tz);
  dayjs.extend(utc);
  dayjs.tz.setDefault("Asia/Tokyo");
  const now = dayjs.tz(dayjs());

  try {
    const browser = await launch();
    const page = await browser.newPage();
    await page.goto(
      "https://fs.bk.mufg.jp/webasp/mufg/fund/detail/m03920420.html",
    );

    // 基準価額
    const basePriceSelector = "#kijyunKagaku";
    await page.waitForSelector(basePriceSelector);
    const basePrice = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.textContent;
    }, basePriceSelector);
    functions.logger.info(basePrice);

    // 前日比
    const dayChangeSelector = "#dayChange";
    await page.waitForSelector(dayChangeSelector);
    const dayChange = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      return el?.textContent;
    }, dayChangeSelector);
    functions.logger.info(dayChange);

    instance.defaults = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await instance.request({
      method: "POST",
      url: process.env.SLACK_WEBHOOK_URL,
      data: {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "アライアンス・バーンスタイン・米国成長株投信Ｄコース",
              emoji: true,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*基準価額:*\n${basePrice}円`,
              },
              {
                type: "mrkdwn",
                text: `*前日比:*\n${dayChange}`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*日付:*\n${now.format("YYYY-MM-DD HH:mm:ss")}`,
              },
            ],
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "<https://fs.bk.mufg.jp/webasp/mufg/fund/detail/m03920420.html|View more>",
            },
          },
        ],
      },
    });

    await browser.close();
    response.send("Hello from Firebase!");
  } catch (err) {
    functions.logger.error(`${err}`);
    response.status(500).send("Error from Firebase!");
  }
});
