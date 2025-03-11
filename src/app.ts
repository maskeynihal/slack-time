import { App } from '@slack/bolt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize your slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Listen for a message containing "hello"
app.message('hello', async ({ message, say }) => {
  await say(`Hey there <@${message.user}>! 👋`);
});

// Start the app
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
  } catch (error) {
    console.error('Error starting app:', error);
  }
})();