import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { crafts } from "@/mocks/crafts";
import { submitOrderInquiry } from "@/lib/mock-api";
import { PRACTICE_NOTICE_TEXT } from "./PracticeNotice";
import { ProductCatalog } from "./ProductCatalog";

vi.mock("@/lib/mock-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mock-api")>();
  return { ...actual, submitOrderInquiry: vi.fn() };
});

const moonJar = crafts[0];
const teaTray = crafts[7];

describe("ProductCatalog", () => {
  beforeEach(() => {
    vi.mocked(submitOrderInquiry).mockReset();
  });

  it("renders 8 cards with image, name, craft type, description and price, 2 per craft type", () => {
    render(<ProductCatalog crafts={crafts} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(8);

    const card = screen.getByRole("article", { name: moonJar.name });
    expect(within(card).getByRole("img", { name: `${moonJar.name} 이미지` })).toBeInTheDocument();
    expect(within(card).getByText("도자기")).toBeInTheDocument();
    expect(within(card).getByText(moonJar.description)).toBeInTheDocument();
    expect(within(card).getByText("380,000원")).toBeInTheDocument();

    for (const type of ["도자기", "나전칠기", "보자기", "목공예"]) {
      expect(screen.getAllByText(type, { selector: "p" })).toHaveLength(2);
    }
  });

  it("opens a dialog that identifies the selected product and repeats the practice notice", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog crafts={crafts} />);

    await user.click(screen.getByRole("button", { name: `주문 문의하기 - ${teaTray.name}` }));

    const dialog = screen.getByRole("dialog", { name: `${teaTray.name} 주문 문의` });
    expect(within(dialog).getByText(PRACTICE_NOTICE_TEXT)).toBeInTheDocument();
    expect(within(dialog).getByRole("textbox", { name: "상품" })).toHaveValue(`${teaTray.name} · 76,000원`);
    expect(within(dialog).getByRole("textbox", { name: "이름" })).toHaveFocus();
  });

  it("renders the shipping guide with brand intro and virtual notice", () => {
    render(<ProductCatalog crafts={crafts} />);
    expect(screen.getByRole("heading", { name: "브랜드 소개" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "가상 제작·배송 안내" })).toBeInTheDocument();
  });

  it("closes with the 닫기 button and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog crafts={crafts} />);
    const trigger = screen.getByRole("button", { name: `주문 문의하기 - ${moonJar.name}` });

    await user.click(trigger);
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape (cancel event) and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog crafts={crafts} />);
    const trigger = screen.getByRole("button", { name: `주문 문의하기 - ${moonJar.name}` });

    await user.click(trigger);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("resets the form after closing and reopening", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog crafts={crafts} />);
    const trigger = screen.getByRole("button", { name: `주문 문의하기 - ${moonJar.name}` });

    await user.click(trigger);
    await user.type(screen.getByRole("textbox", { name: "이름" }), "테스트");
    await user.click(screen.getByRole("button", { name: "닫기" }));
    await user.click(trigger);

    expect(screen.getByRole("textbox", { name: "이름" })).toHaveValue("");
  });

  it("has labelled fields and blocks an empty submission with per-field errors", async () => {
    const user = userEvent.setup();
    render(<ProductCatalog crafts={crafts} />);
    await user.click(screen.getByRole("button", { name: `주문 문의하기 - ${moonJar.name}` }));
    const dialog = screen.getByRole("dialog");

    const name = within(dialog).getByRole("textbox", { name: "이름" });
    const phone = within(dialog).getByRole("textbox", { name: "연락처" });
    const message = within(dialog).getByRole("textbox", { name: /요청사항/ });
    const quantity = within(dialog).getByRole("spinbutton", { name: "수량" });

    await user.clear(quantity);
    await user.click(within(dialog).getByRole("button", { name: "문의 보내기" }));

    expect(submitOrderInquiry).not.toHaveBeenCalled();
    for (const field of [name, phone, quantity]) {
      expect(field).toHaveAttribute("aria-invalid", "true");
      expect(field).toBeRequired();
    }
    expect(name).toHaveAccessibleDescription("이름을 입력해 주세요.");
    expect(phone).toHaveAccessibleDescription(expect.stringContaining("연락처를 입력해 주세요."));
    expect(message).toHaveAttribute("aria-invalid", "false");
    expect(quantity).toHaveAccessibleDescription(expect.stringContaining("수량을 입력해 주세요."));
    expect(name).toHaveFocus();
  });
});
