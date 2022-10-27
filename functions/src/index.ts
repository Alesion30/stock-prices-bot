import * as functions from "firebase-functions";
import { fetchMufj } from "./utils/mufj";
import { getNow } from "./services/dayjs";
import { postMessage } from "./services/slack";
import { launch } from "./services/puppeteer";

const postToSlack = async () => {
  const browser = await launch();
  const page = await browser.newPage();

  const { name, url, basePrice, dayChange } = await fetchMufj(
    "allianceBernstein",
    { page },
  );
  const now = getNow();

  await postMessage({
    message: [
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
            text: `*基準価額:*\n${basePrice ?? "-"}円`,
          },
          {
            type: "mrkdwn",
            text: `*前日比:*\n${
              dayChange !== null && dayChange > 0 ? "+" : ""
            }${dayChange ?? "-"}円`,
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
          text: `<${url}|View more>`,
        },
      },
    ],
  });

  await browser.close();
};

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 60,
  memory: "512MB",
};

export const scheduledPostToSlack = functions
  .region("asia-northeast1")
  .runWith(runtimeOpts)
  .pubsub.schedule("0 1-13/3 * * *") // 9時-21時で3時間おきに実行
  .onRun(postToSlack);

export const postToSlackFunction = functions
  .region("asia-northeast1")
  .runWith(runtimeOpts)
  .https.onRequest(async (_, response) => {
    await postToSlack();
    response.send("Hello from Firebase!");
  });
