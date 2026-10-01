import { describe, expect, it } from "vitest";
import {
  getPreferredDateRange,
  hasErrors,
  validateClassApplication,
  validateHeadcount,
  validateMessage,
  validateName,
  validateOrderInquiry,
  validatePhone,
  validatePreferredDate,
  validateQuantity,
} from "./validation";

const TODAY = new Date(2026, 8, 30, 15, 0);

describe("validateName", () => {
  it("requires a non-blank value", () => {
    expect(validateName("")).toBeDefined();
    expect(validateName("   ")).toBeDefined();
  });

  it("accepts 1 to 20 trimmed characters", () => {
    expect(validateName("김")).toBeUndefined();
    expect(validateName(`  ${"가".repeat(20)}  `)).toBeUndefined();
    expect(validateName("가".repeat(21))).toBeDefined();
  });
});

describe("validatePhone", () => {
  it("requires a value", () => {
    expect(validatePhone("")).toBe("연락처를 입력해 주세요.");
  });

  it("accepts Korean mobile numbers with or without hyphens", () => {
    expect(validatePhone("010-1234-5678")).toBeUndefined();
    expect(validatePhone("01012345678")).toBeUndefined();
    expect(validatePhone("011-123-4567")).toBeUndefined();
    expect(validatePhone(" 010-1234-5678 ")).toBeUndefined();
  });

  it("lets the mock failure number pass format validation", () => {
    expect(validatePhone("010-0000-0000")).toBeUndefined();
  });

  it("rejects invalid formats", () => {
    expect(validatePhone("02-123-4567")).toBeDefined();
    expect(validatePhone("012-1234-5678")).toBeDefined();
    expect(validatePhone("010-12-5678")).toBeDefined();
    expect(validatePhone("010-1234-56789")).toBeDefined();
    expect(validatePhone("abc")).toBeDefined();
  });
});

describe("validateMessage", () => {
  it("is optional and allows up to 500 trimmed characters", () => {
    expect(validateMessage("")).toBeUndefined();
    expect(validateMessage("   ")).toBeUndefined();
    expect(validateMessage("가".repeat(500))).toBeUndefined();
    expect(validateMessage("가".repeat(501))).toBe("요청사항은 500자 이내로 입력해 주세요.");
  });
});

describe("validateQuantity", () => {
  it("accepts integers from 1 to 99", () => {
    expect(validateQuantity("1")).toBeUndefined();
    expect(validateQuantity("99")).toBeUndefined();
  });

  it("rejects empty, out-of-range and non-integer values", () => {
    expect(validateQuantity("")).toBe("수량을 입력해 주세요.");
    expect(validateQuantity("0")).toBeDefined();
    expect(validateQuantity("100")).toBeDefined();
    expect(validateQuantity("-1")).toBeDefined();
    expect(validateQuantity("1.5")).toBeDefined();
    expect(validateQuantity("abc")).toBeDefined();
  });
});

describe("validateHeadcount", () => {
  it("accepts 1 up to capacity", () => {
    expect(validateHeadcount("1", 6)).toBeUndefined();
    expect(validateHeadcount("6", 6)).toBeUndefined();
  });

  it("blocks headcount above capacity with a capacity message", () => {
    expect(validateHeadcount("7", 6)).toBe("정원(6명)을 초과할 수 없습니다.");
  });

  it("rejects empty, zero and non-integer values", () => {
    expect(validateHeadcount("", 6)).toBe("인원을 입력해 주세요.");
    expect(validateHeadcount("0", 6)).toBeDefined();
    expect(validateHeadcount("2.5", 6)).toBeDefined();
  });
});

describe("validatePreferredDate", () => {
  it("computes the range from tomorrow to today + 90 days", () => {
    expect(getPreferredDateRange(TODAY)).toEqual({ min: "2026-10-01", max: "2026-12-29" });
  });

  it("requires a value", () => {
    expect(validatePreferredDate("", TODAY)).toBe("희망일을 선택해 주세요.");
  });

  it("rejects today and past dates", () => {
    expect(validatePreferredDate("2026-09-30", TODAY)).toBeDefined();
    expect(validatePreferredDate("2026-09-01", TODAY)).toBeDefined();
  });

  it("accepts tomorrow and today + 90 days", () => {
    expect(validatePreferredDate("2026-10-01", TODAY)).toBeUndefined();
    expect(validatePreferredDate("2026-12-29", TODAY)).toBeUndefined();
  });

  it("rejects dates beyond 90 days and malformed dates", () => {
    expect(validatePreferredDate("2026-12-30", TODAY)).toBeDefined();
    expect(validatePreferredDate("2026-02-30", TODAY)).toBeDefined();
    expect(validatePreferredDate("2026/10/01", TODAY)).toBeDefined();
  });
});

describe("form validators", () => {
  it("returns an error for every empty order field", () => {
    const errors = validateOrderInquiry({ name: "", phone: "", message: "", quantity: "" });
    expect(Object.keys(errors).sort()).toEqual(["name", "phone", "quantity"]);
    expect(hasErrors(errors)).toBe(true);
  });

  it("returns no errors for a valid order", () => {
    const errors = validateOrderInquiry({
      name: "홍길동",
      phone: "010-1234-5678",
      message: "선물 포장이 가능한지 궁금합니다.",
      quantity: "2",
    });
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it("validates class applications against capacity and today", () => {
    const valid = { name: "홍길동", phone: "010-1234-5678", headcount: "2", preferredDate: "2026-10-10", message: "" };
    expect(validateClassApplication(valid, { capacity: 6, today: TODAY })).toEqual({});
    expect(validateClassApplication({ ...valid, headcount: "7" }, { capacity: 6, today: TODAY })).toEqual({
      headcount: "정원(6명)을 초과할 수 없습니다.",
    });
  });
});
