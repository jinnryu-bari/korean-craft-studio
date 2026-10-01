import type { ClassApplication, MockApiResult, OrderInquiry } from "@/types";

export const MOCK_DELAY_MS = 700;
/** Entering this number (with or without hyphens) always produces a mock failure. */
export const MOCK_FAILURE_PHONE = "010-0000-0000";

export interface MockApiOptions {
  delayMs?: number;
  now?: Date;
}

const RECEIPT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function isMockFailurePhone(phone: string): boolean {
  return phone.trim().replace(/-/g, "") === MOCK_FAILURE_PHONE.replace(/-/g, "");
}

function createReceiptNumber(now: Date): string {
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += RECEIPT_CHARS[Math.floor(Math.random() * RECEIPT_CHARS.length)];
  }
  return `OG-${date}-${suffix}`;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function respond(phone: string, successMessage: string, options: MockApiOptions): Promise<MockApiResult> {
  await wait(options.delayMs ?? MOCK_DELAY_MS);
  if (isMockFailurePhone(phone)) {
    return {
      success: false,
      message: "일시적인 오류로 접수하지 못했습니다. 잠시 후 다시 시도해 주세요. (Mock 오류: 010-0000-0000)",
    };
  }
  return {
    success: true,
    receiptNumber: createReceiptNumber(options.now ?? new Date()),
    message: successMessage,
  };
}

/** Mock order inquiry endpoint. Always resolves; failure is returned as a value. */
export function submitOrderInquiry(data: OrderInquiry, options: MockApiOptions = {}): Promise<MockApiResult> {
  return respond(data.phone, "주문 문의가 접수되었습니다. 공방에서 확인 후 연락드립니다.", options);
}

/** Mock class application endpoint. Always resolves; failure is returned as a value. */
export function submitClassApplication(
  data: ClassApplication,
  options: MockApiOptions = {},
): Promise<MockApiResult> {
  return respond(data.phone, "클래스 신청이 접수되었습니다. 공방에서 일정 확인 후 연락드립니다.", options);
}
