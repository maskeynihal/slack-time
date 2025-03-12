import { parseTimeCommand } from "./command";

describe("parseTimeCommand", () => {
  it("should parse valid time command with username", () => {
    const result = parseTimeCommand("<@U12345678|username> 14:30");
    expect(result).toEqual({
      username: "U12345678",
      time: "14:30",
    });
  });

  it("should return null for invalid time format", () => {
    const result = parseTimeCommand("<@U12345678|username> 25:30");
    expect(result).toBeNull();
  });

  it("should return null for missing time", () => {
    const result = parseTimeCommand("<@U12345678|username>");
    expect(result).toBeNull();
  });

  it("should return null for invalid Slack mention", () => {
    const result = parseTimeCommand("<@U12345678 14:30");
    expect(result).toBeNull();
  });

  it("should handle username with special characters", () => {
    const result = parseTimeCommand("<@U12345678|user_name> 14:30");
    expect(result).toEqual({
      username: "U12345678",
      time: "14:30",
    });
  });

  it("should handle username with numbers", () => {
    const result = parseTimeCommand("<@U12345678|user123> 14:30");
    expect(result).toEqual({
      username: "U12345678",
      time: "14:30",
    });
  });

  it("should handle midnight time format", () => {
    const result = parseTimeCommand("<@U12345678|username> 00:00");
    expect(result).toEqual({
      username: "U12345678",
      time: "00:00",
    });
  });

  it("should handle time with single digit hour", () => {
    const result = parseTimeCommand("<@U12345678|username> 4:30");
    expect(result).toEqual({
      username: "U12345678",
      time: "04:30",
    });
  });

  it("should return null for time with minutes over 59", () => {
    const result = parseTimeCommand("<@U12345678|username> 14:60");
    expect(result).toBeNull();
  });

  it("should return null for time with hour over 23", () => {
    const result = parseTimeCommand("<@U12345678|username> 24:30");
    expect(result).toBeNull();
  });

  it("should return null for empty string", () => {
    const result = parseTimeCommand("");
    expect(result).toBeNull();
  });

  it("should return null for whitespace only", () => {
    const result = parseTimeCommand("   ");
    expect(result).toBeNull();
  });

  it("should return null for invalid time separator", () => {
    const result = parseTimeCommand("<@U12345678|username> 14-30");
    expect(result).toBeNull();
  });

  it("should return null for time without leading zero", () => {
    const result = parseTimeCommand("<@U12345678|username> 04:30");
    expect(result).toEqual({
      username: "U12345678",
      time: "04:30",
    });
  });

  it("should return null for time with am/pm suffix", () => {
    const result = parseTimeCommand("<@U12345678|username> 14:30pm");
    expect(result).toBeNull();
  });
});
