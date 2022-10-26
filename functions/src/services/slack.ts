import { instance } from "./gaxios";

type PostMessageProps = {
  message: Block[];
};

type Block =
  | {
      type: "header";
      text: Text;
    }
  | {
      type: "section";
      fields?: Field[];
      text?: Text;
    };

type Field = {
  type: "plain_text" | "mrkdwn";
  text: Text;
};

type Text =
  | string
  | {
      type: "plain_text" | "mrkdwn";
      text: Text;
      emoji?: boolean;
    };

export const postMessage = async ({ message }: PostMessageProps) => {
  await instance.request({
    method: "POST",
    url: process.env.SLACK_WEBHOOK_URL,
    data: {
      blocks: message,
    },
  });
};
