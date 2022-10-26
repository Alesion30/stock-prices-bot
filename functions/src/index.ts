import * as functions from "firebase-functions";
import { fetchForMufj } from "./utils/mufj";
import { getNow } from "./services/dayjs";
import { instance } from "./services/gaxios";

export const helloWorld = functions.https.onRequest(async (_, response) => {
  const now = getNow();

  try {
    const { name, basePrice, dayChange } = await fetchForMufj(
      "allianceBernstein",
    );

    await instance.request({
      method: "POST",
      url: process.env.SLACK_WEBHOOK_URL,
      data: {
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: name,
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

    response.send("Hello from Firebase!");
  } catch (err) {
    functions.logger.error(`${err}`);
    response.status(500).send("Error from Firebase!");
  }
});
