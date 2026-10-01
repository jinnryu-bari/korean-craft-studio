import { describe, expect, it } from "vitest";
import { craftClasses } from "./classes";
import { crafts } from "./crafts";
import type { CraftType } from "@/types";

const CRAFT_TYPES: CraftType[] = ["도자기", "나전칠기", "보자기", "목공예"];

describe("mock data", () => {
  it("has 8 crafts, exactly 2 per craft type", () => {
    expect(crafts).toHaveLength(8);
    for (const type of CRAFT_TYPES) {
      expect(crafts.filter((craft) => craft.craftType === type)).toHaveLength(2);
    }
  });

  it("has unique craft ids and positive prices", () => {
    expect(new Set(crafts.map((craft) => craft.id)).size).toBe(crafts.length);
    for (const craft of crafts) {
      expect(craft.price).toBeGreaterThan(0);
      expect(craft.description.length).toBeGreaterThan(0);
    }
  });

  it("has 4 classes including 도자기 만들기 and 보자기 만들기", () => {
    expect(craftClasses).toHaveLength(4);
    const names = craftClasses.map((craftClass) => craftClass.name);
    expect(names).toContain("도자기 만들기");
    expect(names).toContain("보자기 만들기");
  });

  it("has classes with unique ids, positive price, duration and capacity", () => {
    expect(new Set(craftClasses.map((craftClass) => craftClass.id)).size).toBe(craftClasses.length);
    for (const craftClass of craftClasses) {
      expect(craftClass.price).toBeGreaterThan(0);
      expect(craftClass.durationMinutes).toBeGreaterThan(0);
      expect(Number.isInteger(craftClass.capacity)).toBe(true);
      expect(craftClass.capacity).toBeGreaterThan(0);
    }
  });
});
