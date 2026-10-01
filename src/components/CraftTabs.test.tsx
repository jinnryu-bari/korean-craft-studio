import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CraftTabs, TABS } from "./CraftTabs";

function renderTabs() {
  return render(
    <CraftTabs
      panels={{
        products: <p>상품 패널 내용</p>,
        classes: <input aria-label="클래스 패널 입력" />,
      }}
    />,
  );
}

describe("CraftTabs", () => {
  it("defines exactly two tabs", () => {
    expect(TABS.map((tab) => tab.label)).toEqual(["공예품 전시·주문", "공방 클래스"]);
  });

  it("renders a labelled tablist with 2 tabs and the products tab selected", () => {
    renderTabs();
    expect(screen.getByRole("tablist", { name: "온결 공방 메뉴" })).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(2);

    const productsTab = screen.getByRole("tab", { name: "공예품 전시·주문" });
    const classesTab = screen.getByRole("tab", { name: "공방 클래스" });
    expect(productsTab).toHaveAttribute("aria-selected", "true");
    expect(productsTab).toHaveAttribute("tabindex", "0");
    expect(classesTab).toHaveAttribute("aria-selected", "false");
    expect(classesTab).toHaveAttribute("tabindex", "-1");

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby", productsTab.id);
    expect(productsTab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("상품 패널 내용");
  });

  it("switches panels on click and keeps the inactive panel mounted but hidden", async () => {
    const user = userEvent.setup();
    const { container } = renderTabs();

    await user.click(screen.getByRole("tab", { name: "공방 클래스" }));
    expect(screen.getByRole("tab", { name: "공방 클래스" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-classes");

    const productsPanel = container.querySelector("#panel-products");
    expect(productsPanel).toBeInTheDocument();
    expect(productsPanel).not.toBeVisible();
    expect(productsPanel).toHaveTextContent("상품 패널 내용");
  });

  it("preserves panel state while switching tabs", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "공방 클래스" }));
    await user.type(screen.getByRole("textbox", { name: "클래스 패널 입력" }), "입력 유지");
    await user.click(screen.getByRole("tab", { name: "공예품 전시·주문" }));
    await user.click(screen.getByRole("tab", { name: "공방 클래스" }));

    expect(screen.getByRole("textbox", { name: "클래스 패널 입력" })).toHaveValue("입력 유지");
  });

  it("supports arrow keys with wrapping plus Home/End, moving focus with selection", async () => {
    const user = userEvent.setup();
    renderTabs();
    const productsTab = screen.getByRole("tab", { name: "공예품 전시·주문" });
    const classesTab = screen.getByRole("tab", { name: "공방 클래스" });

    await user.tab();
    expect(productsTab).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(classesTab).toHaveFocus();
    expect(classesTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(productsTab).toHaveFocus();
    expect(productsTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}");
    expect(classesTab).toHaveFocus();

    await user.keyboard("{Home}");
    expect(productsTab).toHaveFocus();
    expect(productsTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(classesTab).toHaveFocus();
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", "panel-classes");
  });
});
