import * as functions from "firebase-functions";
import { fetchMufj } from "./utils/mufj";
import { Message, postMessage } from "./services/slack";
import { launch } from "./services/puppeteer";
import { env, Workspace } from "./env";
import { Browser } from "puppeteer";
import { getNow } from "./services/dayjs";

const postToSlackAllWorkspaces = async (browser: Browser) => {
  const workspaces = Object.keys(env) as Workspace[];
  await Promise.all(workspaces.map((key) => postToSlack(key, browser)));
};

const postToSlack = async (workspace: Workspace, browser: Browser) => {
  const { slackWebhookUrl, brands } = env[workspace];
  const results = await Promise.all(
    brands.map((brand) => fetchMufj(brand, { browser })),
  );
  const message = results.reduce<Message>((message, result) => {
    const { name, url, basePrice, dayChange, time } = result;
    const m: Message = [
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
            text: `*日付:*\n${time.format("YYYY-MM-DD HH:mm:ss")}`,
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
    ];
    return message.concat(m);
  }, []);

  await postMessage({
    url: slackWebhookUrl,
    message: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `${getNow().format("YYYY-MM-DD HH:mm")}の株価をお知らせします`,
        },
      },
    ],
  });
  await postMessage({
    url: slackWebhookUrl,
    message,
  });
};

const runtimeOpts: functions.RuntimeOptions = {
  timeoutSeconds: 60,
  memory: "512MB",
};

export const scheduledPostToSlack = functions
  .region("asia-northeast1")
  .runWith(runtimeOpts)
  .pubsub.schedule("0 17-5/3 * * *") // 9時-21時で3時間おきに実行
  .onRun(async () => {
    const browser = await launch();
    await postToSlackAllWorkspaces(browser);
    await browser.close();
  });

export const postToSlackFunction = functions
  .region("asia-northeast1")
  .runWith(runtimeOpts)
  .https.onRequest(async (_, response) => {
    const browser = await launch();
    await postToSlack("qdaip2p", browser);
    await browser.close();
    response.send("Hello from Firebase!");
  });
