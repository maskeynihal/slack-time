/**
 * Regular expression for parsing time command in format "<@USER_ID|username> HH:MM"
 * Validates:
 * - User ID in Slack mention format <@U...>
 * - Optional username after vertical bar
 * - Time in 24-hour format (00:00 to 23:59)
 */
export const TIME_COMMAND_REGEX =
  /<@([A-Z0-9]+)\|[^>]+>\s+([0-9]|[0][0-9]|[1][0-9]|2[0-3]):([0-5]\d)(?![aApP][mM])\s*/;
