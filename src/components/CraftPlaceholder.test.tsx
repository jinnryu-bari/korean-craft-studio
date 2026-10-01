import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CraftType } from "@/types";
import { CraftPlaceholder } from "./CraftPlaceholder";

describe("CraftPlaceholder", () => {
  it.each<[CraftType, string]>([
    ["도자기", "/images/pottery.svg"],
    ["나전칠기", "/images/najeon.svg"],
    ["보자기", "/images/bojagi.svg"],
    ["목공예", "/images/woodcraft.svg"],
  ])("renders a labelled local image for %s", (craftType, src) => {
    render(<CraftPlaceholder craftType={craftType} label={`${craftType} 이미지`} />);
    const img = screen.getByRole("img", { name: `${craftType} 이미지` });
    expect(img).toHaveAttribute("src", src);
  });
});
