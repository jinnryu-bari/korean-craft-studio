export type CraftType = "도자기" | "나전칠기" | "보자기" | "목공예";

export interface Craft {
  id: string;
  name: string;
  craftType: CraftType;
  description: string;
  price: number;
}

export interface CraftClass {
  id: string;
  name: string;
  craftType: CraftType;
  description: string;
  price: number;
  durationMinutes: number;
  capacity: number;
}

export interface OrderInquiry {
  productId: string;
  name: string;
  phone: string;
  /** Optional free-text request (may be empty). */
  message: string;
  quantity: number;
}

export interface ClassApplication {
  classId: string;
  name: string;
  phone: string;
  headcount: number;
  /** Local date in YYYY-MM-DD format. */
  preferredDate: string;
  /** Optional free-text request (may be empty). */
  message: string;
}

export type MockApiResult =
  | { success: true; receiptNumber: string; message: string }
  | { success: false; message: string };

export type SubmitStatus = "idle" | "submitting" | "success" | "error";
