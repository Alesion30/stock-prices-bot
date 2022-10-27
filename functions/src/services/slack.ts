import { instance } from "./gaxios";

type PostMessageProps = {
  url: string;
  message: Message;
};

export type Message = Block[];

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

export const postMessage = async ({ url, message }: PostMessageProps) => {
  await instance.request({
    method: "POST",
    url,
    data: {
      blocks: message,
    },
  });
};
