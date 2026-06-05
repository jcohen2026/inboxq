export interface SlackConnectionStatus {
  enabled: boolean;
  workspaceName?: string;
  message: string;
}

export function getSlackConnectionStatus(): SlackConnectionStatus {
  if (!process.env.SLACK_CLIENT_ID || !process.env.SLACK_CLIENT_SECRET) {
    return {
      enabled: false,
      workspaceName: "Demo workspace",
      message: "Slack is stubbed in this proof of concept."
    };
  }

  return {
    enabled: true,
    message: "Slack credentials are present. Event ingestion can be wired through this adapter."
  };
}
