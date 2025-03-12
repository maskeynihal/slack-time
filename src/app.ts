import { App, LogLevel, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
import { parseTimeCommand } from "./utils/command";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Load environment variables
dotenv.config();

// Initialize ExpressReceiver
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  processBeforeResponse: true,
});

// Initialize your slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: expressReceiver,
});

// Handle /time slash command
app.command("/time", async ({ command, ack, respond, client }) => {
  await ack();

  try {
    // Send initial "Converting the time" message
    await respond({
      text: "Converting the time...",
      response_type: "ephemeral",
    });

    const commandText = command.text.trim();
    const parseResult = parseTimeCommand(commandText);

    if (!parseResult) {
      await respond("Please use the format: /time @username HH:MM");
      return;
    }

    const { username: targetUserId, time } = parseResult;

    // Get sender's info
    const sender = await client.users.info({
      user: command.user_id,
    });

    // Get target user's info
    const targetUser = await client.users.info({
      user: targetUserId,
    });

    if (!targetUser.user?.tz) {
      await respond("Error: Could not determine the target user's timezone.");
      return;
    }

    // Convert time for the target user
    const [hours, minutes] = time.split(":");
    const senderTimezone = sender.user?.tz || "UTC";
    const targetTimezone = targetUser.user?.tz || "UTC";

    // Create a date in sender's timezone
    const senderDate = dayjs()
      .tz(senderTimezone)
      .hour(parseInt(hours))
      .minute(parseInt(minutes))
      .second(0)
      .millisecond(0);

    // Convert to target timezone
    const targetDate = senderDate.tz(targetTimezone);

    const senderDateTime = senderDate.format("MMM D YYYY, HH:mm");
    const targetDateTime = targetDate.format("MMM D YYYY, HH:mm");

    // Calculate timezone offset difference
    const senderOffset = senderDate.utcOffset();
    const targetOffset = targetDate.utcOffset();
    const offsetDiff = (targetOffset - senderOffset) / 60; // Convert minutes to hours

    const offsetText =
      offsetDiff === 0
        ? "(same timezone)"
        : offsetDiff > 0
        ? `(${Math.abs(offsetDiff)} hours ahead)`
        : `(${Math.abs(offsetDiff)} hours behind)`;

    const response = {
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Time Conversion*",
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Your time* (${sender.user?.tz})\n${senderDateTime}`,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*<@${targetUser.user.id}>'s time* (${targetUser.user.tz})\n${targetDateTime} ${offsetText}`,
          },
        },
      ],
    };
    await respond(response);
  } catch (error) {
    console.error("Error processing time command:", error);
    await respond("Sorry, there was an error processing your request.");
  }
});

// Start the app
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  } catch (error) {
    console.error("Error starting app:", error);
  }
})();
