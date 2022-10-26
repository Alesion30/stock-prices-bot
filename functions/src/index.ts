import * as functions from "firebase-functions";
import { launch } from "puppeteer";

export const helloWorld = functions.https.onRequest(async (_, response) => {
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

    await browser.close();
    response.send("Hello from Firebase!");
  } catch (err) {
    functions.logger.error(`${err}`);
    response.status(500).send("Error from Firebase!");
  }
});
