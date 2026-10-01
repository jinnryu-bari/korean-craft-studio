import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { PRACTICE_NOTICE_TEXT } from "./PracticeNotice";

describe("Home page (/)", () => {
  it("shows the brand heading and the practice notice", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "온결 공방" })).toBeInTheDocument();
    expect(screen.getByText(PRACTICE_NOTICE_TEXT)).toBeInTheDocument();
  });

  it("has exactly 2 tabs and shows 8 product cards by default", () => {
    render(<Home />);
    expect(screen.getAllByRole("tab")).toHaveLength(2);

    const panel = screen.getByRole("tabpanel", { name: "공예품 전시·주문" });
    const cards = within(panel).getAllByRole("article");
    expect(cards).toHaveLength(8);
    for (const card of cards) {
      expect(within(card).getByRole("img")).toBeInTheDocument();
      expect(within(card).getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(within(card).getByText(/^[\d,]+원$/)).toBeInTheDocument();
      expect(within(card).getByRole("button", { name: /^주문 문의하기/ })).toBeInTheDocument();
    }
  });

  it("switches to the classes panel without navigation", async () => {
    const user = userEvent.setup();
    const initialUrl = window.location.href;
    render(<Home />);

    await user.click(screen.getByRole("tab", { name: "공방 클래스" }));

    const panel = screen.getByRole("tabpanel", { name: "공방 클래스" });
    expect(within(panel).getAllByRole("article")).toHaveLength(4);
    expect(screen.queryByRole("tabpanel", { name: "공예품 전시·주문" })).not.toBeInTheDocument();
    expect(window.location.href).toBe(initialUrl);
  });
});
