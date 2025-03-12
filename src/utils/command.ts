import { TIME_COMMAND_REGEX } from "./constants";

interface TimeCommandResult {
  username: string;
  time: string;
}

/**
 * Parses a time command string and extracts username and time information (24-hour format)
 * @param commandText - The command text in format "@username HH:MM"
 * @returns Object containing username and time if valid, null if invalid
 */
export function parseTimeCommand(
  commandText: string
): TimeCommandResult | null {
  const match = commandText.trim().match(TIME_COMMAND_REGEX);

  if (!match) {
    return null;
  }

  const [, username, hours, minutes] = match;
  const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;

  return {
    username,
    time,
  };
}
