import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isMockFailurePhone, submitClassApplication, submitOrderInquiry } from "./mock-api";
import type { ClassApplication, MockApiResult, OrderInquiry } from "@/types";

const order: OrderInquiry = {
  productId: "p-baekja-moon-jar",
  name: "홍길동",
  phone: "010-1234-5678",
  message: "배송 일정이 궁금합니다.",
  quantity: 1,
};

const application: ClassApplication = {
  classId: "c-pottery",
  name: "홍길동",
  phone: "010-1234-5678",
  headcount: 2,
  preferredDate: "2026-10-10",
  message: "",
};

const NOW = new Date(2026, 8, 30, 10, 0);

describe("mock-api", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("stays pending at 699ms and resolves after 700ms", async () => {
    let result: MockApiResult | undefined;
    void submitOrderInquiry(order, { now: NOW }).then((response) => {
      result = response;
    });

    await vi.advanceTimersByTimeAsync(699);
    expect(result).toBeUndefined();

    await vi.advanceTimersByTimeAsync(1);
    expect(result).toBeDefined();
  });

  it("returns a receipt number and message for a normal phone", async () => {
    const pending = submitOrderInquiry(order, { now: NOW });
    await vi.advanceTimersByTimeAsync(700);
    const response = await pending;

    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.receiptNumber).toMatch(/^OG-\d{8}-[A-Z0-9]{4}$/);
      expect(response.receiptNumber.startsWith("OG-20260930-")).toBe(true);
      expect(response.message.length).toBeGreaterThan(0);
    }
  });

  it("succeeds for class applications", async () => {
    const pending = submitClassApplication(application, { now: NOW });
    await vi.advanceTimersByTimeAsync(700);
    const response = await pending;

    expect(response.success).toBe(true);
    if (response.success) {
      expect(response.receiptNumber).toMatch(/^OG-\d{8}-[A-Z0-9]{4}$/);
    }
  });

  it.each(["010-0000-0000", "01000000000", " 010-0000-0000 "])(
    "resolves with a failure value for %s",
    async (phone) => {
      const orderPending = submitOrderInquiry({ ...order, phone });
      const classPending = submitClassApplication({ ...application, phone });
      await vi.advanceTimersByTimeAsync(700);

      const orderResponse = await orderPending;
      const classResponse = await classPending;
      expect(orderResponse.success).toBe(false);
      expect(classResponse.success).toBe(false);
      expect(orderResponse.message.length).toBeGreaterThan(0);
      expect("receiptNumber" in orderResponse).toBe(false);
    },
  );

  it("detects the failure phone regardless of hyphens", () => {
    expect(isMockFailurePhone("010-0000-0000")).toBe(true);
    expect(isMockFailurePhone("01000000000")).toBe(true);
    expect(isMockFailurePhone("010-0000-0001")).toBe(false);
  });

  it("does not use fetch or storage", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    const pending = submitOrderInquiry(order);
    await vi.advanceTimersByTimeAsync(700);
    await pending;

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });
});
