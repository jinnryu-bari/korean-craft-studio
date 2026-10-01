import { addDays, toLocalDateString } from "./format";

export interface OrderFormValues {
  name: string;
  phone: string;
  message: string;
  quantity: string;
}

export interface ClassFormValues {
  name: string;
  phone: string;
  headcount: string;
  preferredDate: string;
  message: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export const NAME_MAX_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 500;
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 99;
export const PREFERRED_DATE_MAX_DAYS = 90;

const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;
const INTEGER_PATTERN = /^\d+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "이름을 입력해 주세요.";
  if (trimmed.length > NAME_MAX_LENGTH) return `이름은 ${NAME_MAX_LENGTH}자 이내로 입력해 주세요.`;
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return "연락처를 입력해 주세요.";
  if (!PHONE_PATTERN.test(trimmed)) return "휴대전화 번호 형식으로 입력해 주세요. (예: 010-1234-5678)";
  return undefined;
}

/** 요청사항 is optional; only the upper length bound is enforced. */
export function validateMessage(value: string): string | undefined {
  if (value.trim().length > MESSAGE_MAX_LENGTH) return `요청사항은 ${MESSAGE_MAX_LENGTH}자 이내로 입력해 주세요.`;
  return undefined;
}

function parseInteger(value: string): number | undefined {
  const trimmed = value.trim();
  if (!INTEGER_PATTERN.test(trimmed)) return undefined;
  return Number(trimmed);
}

export function validateQuantity(value: string): string | undefined {
  if (value.trim().length === 0) return "수량을 입력해 주세요.";
  const quantity = parseInteger(value);
  if (quantity === undefined || quantity < QUANTITY_MIN || quantity > QUANTITY_MAX) {
    return `수량은 ${QUANTITY_MIN}~${QUANTITY_MAX} 사이의 정수로 입력해 주세요.`;
  }
  return undefined;
}

export function validateHeadcount(value: string, capacity: number): string | undefined {
  if (value.trim().length === 0) return "인원을 입력해 주세요.";
  const headcount = parseInteger(value);
  if (headcount === undefined || headcount < 1) return "인원은 1명 이상의 정수로 입력해 주세요.";
  if (headcount > capacity) return `정원(${capacity}명)을 초과할 수 없습니다.`;
  return undefined;
}

/** Earliest and latest selectable dates (local YYYY-MM-DD) relative to `today`. */
export function getPreferredDateRange(today: Date): { min: string; max: string } {
  return {
    min: toLocalDateString(addDays(today, 1)),
    max: toLocalDateString(addDays(today, PREFERRED_DATE_MAX_DAYS)),
  };
}

function isRealDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function validatePreferredDate(value: string, today: Date): string | undefined {
  if (value.trim().length === 0) return "희망일을 선택해 주세요.";
  if (!DATE_PATTERN.test(value) || !isRealDate(value)) return "올바른 날짜를 선택해 주세요.";
  const { min, max } = getPreferredDateRange(today);
  if (value < min || value > max) {
    return `희망일은 내일부터 ${PREFERRED_DATE_MAX_DAYS}일 이내로 선택해 주세요.`;
  }
  return undefined;
}

function compact<T>(errors: FormErrors<T>): FormErrors<T> {
  const result: FormErrors<T> = {};
  for (const key of Object.keys(errors) as (keyof T)[]) {
    const message = errors[key];
    if (message) result[key] = message;
  }
  return result;
}

export function validateOrderInquiry(values: OrderFormValues): FormErrors<OrderFormValues> {
  return compact<OrderFormValues>({
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    message: validateMessage(values.message),
    quantity: validateQuantity(values.quantity),
  });
}

export function validateClassApplication(
  values: ClassFormValues,
  options: { capacity: number; today: Date },
): FormErrors<ClassFormValues> {
  return compact<ClassFormValues>({
    name: validateName(values.name),
    phone: validatePhone(values.phone),
    headcount: validateHeadcount(values.headcount, options.capacity),
    preferredDate: validatePreferredDate(values.preferredDate, options.today),
    message: validateMessage(values.message),
  });
}

export function hasErrors<T>(errors: FormErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
