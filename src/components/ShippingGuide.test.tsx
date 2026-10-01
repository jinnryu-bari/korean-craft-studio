import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShippingGuide } from "./ShippingGuide";

describe("ShippingGuide", () => {
  it("renders brand intro and a virtual shipping list marked as practice-only", () => {
    render(<ShippingGuide />);
    expect(screen.getByRole("heading", { level: 3, name: "브랜드 소개" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "가상 제작·배송 안내" })).toBeInTheDocument();
    expect(screen.getByText(/실습용 가상 안내/)).toBeInTheDocument();
    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByText("교환·환불")).toBeInTheDocument();
  });
});
