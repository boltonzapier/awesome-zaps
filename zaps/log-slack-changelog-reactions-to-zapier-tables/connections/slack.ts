// The account this zap uses as "slack"; workflow.ts and triggers/ refer to it by that alias.
export default {
  app: "slack",
  description:
    "The Slack account in the workspace where people react with the changelog emoji. It must be able to read the reacted message and post thread replies in its channel.",
};
