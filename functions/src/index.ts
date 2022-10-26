import * as functions from "firebase-functions";
import { fetchForMufj } from "./utils/mufj";
import { getNow } from "./services/dayjs";
import { instance } from "./services/gaxios";

export const scheduledPostToSlack = functions
  .region("asia-northeast1")
  .pubsub.schedule("0 12 * * *")
  .onRun(async () => {
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
                {
                  type: "mrkdwn",
                  text: "*情報元:*\n<https://www.bk.mufg.jp/|三菱UFJ銀行>",
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
    } catch (err) {
      functions.logger.error(`${err}`);
    }
  });
