import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { craftClasses } from "@/mocks/classes";
import { submitClassApplication } from "@/lib/mock-api";
import type { MockApiResult } from "@/types";
import { ClassApplicationForm } from "./ClassApplicationForm";

vi.mock("@/lib/mock-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock-api")>();
  return { ...actual, submitClassApplication: vi.fn() };
});

function deferred() {
  let resolve: (value: MockApiResult) => void = () => undefined;
  const promise = new Promise<MockApiResult>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const pottery = craftClasses[0];

async function fillValidForm(
  user: ReturnType<typeof userEvent.setup>,
  { phone = "010-1234-5678", date = "2026-10-10" }: { phone?: string; date?: string } = {},
) {
  await user.type(screen.getByRole("textbox", { name: "이름" }), "홍길동");
  await user.type(screen.getByRole("textbox", { name: "연락처" }), phone);
  const headcount = screen.getByRole("spinbutton", { name: "인원" });
  await user.clear(headcount);
  await user.type(headcount, "3");
  fireEvent.change(screen.getByLabelText(/^희망 날짜/), { target: { value: date } });
  await user.type(screen.getByRole("textbox", { name: /^요청사항/ }), "조용한 자리 부탁드려요");
}

describe("ClassApplicationForm", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 8, 30, 10, 0));
    vi.mocked(submitClassApplication).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("limits the date input from tomorrow to 90 days ahead", () => {
    render(<ClassApplicationForm craftClass={pottery} />);
    const date = screen.getByLabelText(/^희망 날짜/);
    expect(date).toHaveAttribute("min", "2026-10-01");
    expect(date).toHaveAttribute("max", "2026-12-29");
    expect(screen.getByRole("spinbutton", { name: "인원" })).toHaveAttribute("max", String(pottery.capacity));
  });

  it("rejects today as the preferred date", async () => {
    const user = userEvent.setup();
    render(<ClassApplicationForm craftClass={pottery} />);

    await fillValidForm(user, { date: "2026-09-30" });
    await user.click(screen.getByRole("button", { name: "신청하기" }));

    expect(submitClassApplication).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/^희망 날짜/)).toHaveAccessibleDescription(
      expect.stringContaining("희망일은 내일부터 90일 이내로 선택해 주세요."),
    );
  });

  it("rejects a request message over 500 characters", async () => {
    const user = userEvent.setup();
    render(<ClassApplicationForm craftClass={pottery} />);

    await fillValidForm(user);
    fireEvent.change(screen.getByRole("textbox", { name: /^요청사항/ }), { target: { value: "가".repeat(501) } });
    await user.click(screen.getByRole("button", { name: "신청하기" }));

    expect(submitClassApplication).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: /^요청사항/ })).toHaveAccessibleDescription(
      expect.stringContaining("요청사항은 500자 이내로 입력해 주세요."),
    );
  });

  it("shows loading, then the receipt, for a valid application", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    vi.mocked(submitClassApplication).mockReturnValue(pending.promise);
    render(<ClassApplicationForm craftClass={pottery} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "신청하기" }));

    expect(submitClassApplication).toHaveBeenCalledWith({
      classId: pottery.id,
      name: "홍길동",
      phone: "010-1234-5678",
      headcount: 3,
      preferredDate: "2026-10-10",
      message: "조용한 자리 부탁드려요",
    });
    expect(screen.getByRole("button", { name: "접수 중..." })).toBeDisabled();

    pending.resolve({ success: true, receiptNumber: "OG-20260930-QW12", message: "클래스 신청이 접수되었습니다." });

    const receipt = await screen.findByText("OG-20260930-QW12");
    expect(receipt.closest("[role='status']")).toHaveTextContent("클래스 신청이 접수되었습니다.");
  });

  it("shows an alert on mock failure and succeeds on retry", async () => {
    const user = userEvent.setup();
    const first = deferred();
    const second = deferred();
    vi.mocked(submitClassApplication).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(<ClassApplicationForm craftClass={pottery} />);

    await fillValidForm(user, { phone: "01000000000" });
    await user.click(screen.getByRole("button", { name: "신청하기" }));
    first.resolve({ success: false, message: "일시적인 오류로 접수하지 못했습니다." });

    expect(await screen.findByRole("alert")).toHaveTextContent("일시적인 오류로 접수하지 못했습니다.");
    expect(screen.getByRole("spinbutton", { name: "인원" })).toHaveValue(3);
    expect(screen.getByLabelText(/^희망 날짜/)).toHaveValue("2026-10-10");

    const phone = screen.getByRole("textbox", { name: "연락처" });
    await user.clear(phone);
    await user.type(phone, "010-5555-6666");
    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    second.resolve({ success: true, receiptNumber: "OG-20260930-RT01", message: "클래스 신청이 접수되었습니다." });

    expect(await screen.findByText("OG-20260930-RT01")).toBeInTheDocument();
    expect(submitClassApplication).toHaveBeenCalledTimes(2);
  });
});
