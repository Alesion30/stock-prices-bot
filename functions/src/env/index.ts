import { MufjBrand } from "../utils/mufj";

export type Workspace = "qdaip2p";

type Env = {
  slackWebhookUrl: string;
  name: string;
  brands: MufjBrand[];
};

export const env: Record<Workspace, Env> = {
  qdaip2p: {
    name: "九大P2Pエンジニア",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL_QDAIP2P!,
    brands: ["allianceBernstein", "emaxis"],
  },
};
