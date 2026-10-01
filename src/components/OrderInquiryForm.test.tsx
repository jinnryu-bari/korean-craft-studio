import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { crafts } from "@/mocks/crafts";
import { submitOrderInquiry } from "@/lib/mock-api";
import type { MockApiResult } from "@/types";
import { OrderInquiryForm } from "./OrderInquiryForm";

vi.mock("@/lib/mock-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock-api")>();
  return { ...actual, submitOrderInquiry: vi.fn() };
});

function deferred() {
  let resolve: (value: MockApiResult) => void = () => undefined;
  const promise = new Promise<MockApiResult>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const product = crafts[2];

async function fillValidForm(user: ReturnType<typeof userEvent.setup>, phone = "010-1234-5678") {
  await user.type(screen.getByRole("textbox", { name: "이름" }), "홍길동");
  await user.type(screen.getByRole("textbox", { name: "연락처" }), phone);
  await user.type(screen.getByRole("textbox", { name: /요청사항/ }), "선물 포장이 가능한가요?");
  const quantity = screen.getByRole("spinbutton", { name: "수량" });
  await user.clear(quantity);
  await user.type(quantity, "2");
}

describe("OrderInquiryForm", () => {
  beforeEach(() => {
    vi.mocked(submitOrderInquiry).mockReset();
  });

  it("shows a loading state, then the receipt number in a status region", async () => {
    const user = userEvent.setup();
    const pending = deferred();
    vi.mocked(submitOrderInquiry).mockReturnValue(pending.promise);
    render(<OrderInquiryForm product={product} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).toHaveBeenCalledWith({
      productId: product.id,
      name: "홍길동",
      phone: "010-1234-5678",
      message: "선물 포장이 가능한가요?",
      quantity: 2,
    });
    const submitButton = screen.getByRole("button", { name: "접수 중..." });
    expect(submitButton).toBeDisabled();
    expect(submitButton.closest("form")).toHaveAttribute("aria-busy", "true");

    pending.resolve({ success: true, receiptNumber: "OG-20260930-AB12", message: "주문 문의가 접수되었습니다." });

    const status = await screen.findByText("OG-20260930-AB12");
    expect(status.closest("[role='status']")).toHaveTextContent("주문 문의가 접수되었습니다.");
    expect(screen.queryByRole("button", { name: "문의 보내기" })).not.toBeInTheDocument();
  });

  it("shows an alert on mock failure, keeps values, and allows a retry that succeeds", async () => {
    const user = userEvent.setup();
    const first = deferred();
    const second = deferred();
    vi.mocked(submitOrderInquiry).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    render(<OrderInquiryForm product={product} />);

    await fillValidForm(user, "010-0000-0000");
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));
    first.resolve({ success: false, message: "일시적인 오류로 접수하지 못했습니다." });

    expect(await screen.findByRole("alert")).toHaveTextContent("일시적인 오류로 접수하지 못했습니다.");
    expect(screen.getByRole("textbox", { name: "이름" })).toHaveValue("홍길동");
    expect(screen.getByRole("textbox", { name: /요청사항/ })).toHaveValue("선물 포장이 가능한가요?");
    expect(screen.getByRole("spinbutton", { name: "수량" })).toHaveValue(2);

    const phone = screen.getByRole("textbox", { name: "연락처" });
    expect(phone).toHaveValue("010-0000-0000");
    await user.clear(phone);
    await user.type(phone, "010-2222-3333");
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(submitOrderInquiry).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    second.resolve({ success: true, receiptNumber: "OG-20260930-ZZ99", message: "주문 문의가 접수되었습니다." });

    expect(await screen.findByText("OG-20260930-ZZ99")).toBeInTheDocument();
  });

  it("does not call the API for invalid input", async () => {
    const user = userEvent.setup();
    render(<OrderInquiryForm product={product} />);

    await fillValidForm(user, "02-123-4567");
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).not.toHaveBeenCalled();
    const phone = screen.getByRole("textbox", { name: "연락처" });
    expect(phone).toHaveAttribute("aria-invalid", "true");
    expect(phone).toHaveFocus();
  });

  it("submits successfully with an empty optional 요청사항", async () => {
    const user = userEvent.setup();
    vi.mocked(submitOrderInquiry).mockResolvedValue({ success: true, receiptNumber: "OG-20260930-EM01", message: "주문 문의가 접수되었습니다." });
    render(<OrderInquiryForm product={product} />);

    await user.type(screen.getByRole("textbox", { name: "이름" }), "홍길동");
    await user.type(screen.getByRole("textbox", { name: "연락처" }), "010-1234-5678");
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).toHaveBeenCalledWith(expect.objectContaining({ message: "", quantity: 1 }));
    expect(await screen.findByText("OG-20260930-EM01")).toBeInTheDocument();
  });

  it("shows the selected product in a read-only labelled field", () => {
    render(<OrderInquiryForm product={product} />);
    const field = screen.getByRole("textbox", { name: "상품" });
    expect(field).toHaveAttribute("readonly");
    expect((field as HTMLInputElement).value).toContain(product.name);
  });

  it("rejects a 요청사항 over 500 characters with an accessible error", async () => {
    const user = userEvent.setup();
    render(<OrderInquiryForm product={product} />);

    await fillValidForm(user);
    const message = screen.getByRole("textbox", { name: /요청사항/ });
    fireEvent.change(message, { target: { value: "가".repeat(501) } });
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).not.toHaveBeenCalled();
    expect(message).toHaveAttribute("aria-invalid", "true");
    expect(message).toHaveAccessibleDescription(expect.stringContaining("요청사항은 500자 이내로 입력해 주세요."));
    expect(message).toHaveFocus();
  });

  it("rejects quantity outside 1-99", async () => {
    const user = userEvent.setup();
    render(<OrderInquiryForm product={product} />);

    await fillValidForm(user);
    const quantity = screen.getByRole("spinbutton", { name: "수량" });
    await user.clear(quantity);
    await user.type(quantity, "100");
    await user.click(screen.getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).not.toHaveBeenCalled();
    expect(quantity).toHaveAccessibleDescription(expect.stringContaining("1~99 사이의 정수"));
  });
});
