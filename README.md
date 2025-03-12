# Slack Time Converter

A Slack bot that helps team members convert time between different timezones. Perfect for distributed teams working across multiple time zones.

## Features

- Convert time between team members' timezones using a simple slash command
- Automatically detects users' configured timezones in Slack
- Shows time difference (hours ahead/behind) between users
- Clean, formatted responses with timezone information

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Slack workspace with permission to add apps

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/slack-time.git
   cd slack-time
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory based on the `.env.example` file:

   ```
   # Slack App Configuration
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_SIGNING_SECRET=your-signing-secret
   SLACK_APP_TOKEN=xapp-your-app-token

   # Application Configuration
   PORT=3000
   ```

4. Create a new Slack App in the [Slack API Console](https://api.slack.com/apps):

   - Create a new app from scratch
   - Add the following Bot Token Scopes under OAuth & Permissions:
     - `commands` - To create slash commands
     - `users:read` - To access user timezone information
     - `chat:write` - To send messages
   - Create a new slash command `/time` with the request URL pointing to your server: `https://your-server.com/slack/events`
   - Install the app to your workspace
   - Copy the Bot Token and Signing Secret to your `.env` file

5. Build and start the application:
   ```bash
   npm run build
   npm start
   ```

## Usage

Use the `/time` slash command followed by a mention of a team member and a time in 24-hour format:

```
/time @username HH:MM
```

For example:

```
/time @john 15:30
```

### Command Format

The command follows this pattern:

- `/time` - The slash command
- `<@USER_ID|username>` - A mention of the team member (Slack will format this automatically when you use @username)
- `HH:MM` - Time in 24-hour format (00:00 to 23:59)

### Response

The bot will respond with a formatted message showing:

1. Your time in your timezone
2. The mentioned user's time in their timezone
3. The time difference (hours ahead/behind)

Example response:

```
Time Conversion
--------------
Your time (America/New_York)
Jun 15 2023 15:30
--------------
@john's time (Europe/London)
Jun 15 2023 20:30 (5 hours ahead)
```

## Development

### Running in Development Mode

For development with hot reloading:

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
