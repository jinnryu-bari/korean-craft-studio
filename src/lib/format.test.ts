import { describe, expect, it } from "vitest";
import { addDays, formatDuration, formatPrice, toLocalDateString } from "./format";

describe("formatPrice", () => {
  it("adds thousands separators and 원", () => {
    expect(formatPrice(380000)).toBe("380,000원");
    expect(formatPrice(42000)).toBe("42,000원");
    expect(formatPrice(900)).toBe("900원");
  });
});

describe("formatDuration", () => {
  it("formats hours and minutes", () => {
    expect(formatDuration(150)).toBe("2시간 30분");
    expect(formatDuration(120)).toBe("2시간");
    expect(formatDuration(90)).toBe("1시간 30분");
    expect(formatDuration(45)).toBe("45분");
  });
});

describe("date helpers", () => {
  it("formats local dates as YYYY-MM-DD", () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(toLocalDateString(new Date(2026, 11, 31, 23, 59))).toBe("2026-12-31");
  });

  it("adds calendar days across month and year boundaries", () => {
    expect(toLocalDateString(addDays(new Date(2026, 11, 31), 1))).toBe("2027-01-01");
    expect(toLocalDateString(addDays(new Date(2026, 8, 30), 90))).toBe("2026-12-29");
  });
});
