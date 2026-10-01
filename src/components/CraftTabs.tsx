"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export const TABS = [
  { id: "products", label: "공예품 전시·주문" },
  { id: "classes", label: "공방 클래스" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface CraftTabsProps {
  panels: Record<TabId, ReactNode>;
}

export function CraftTabs({ panels }: CraftTabsProps) {
  const [selected, setSelected] = useState<TabId>("products");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  function selectByIndex(index: number) {
    const next = TABS[(index + TABS.length) % TABS.length];
    setSelected(next.id);
    tabRefs.current[next.id]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
        selectByIndex(index + 1);
        break;
      case "ArrowLeft":
        selectByIndex(index - 1);
        break;
      case "Home":
        selectByIndex(0);
        break;
      case "End":
        selectByIndex(TABS.length - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
        <div
          role="tablist"
          aria-label="온결 공방 메뉴"
          className="mx-auto flex max-w-6xl gap-1 px-4 sm:gap-6 sm:px-6 lg:px-8"
        >
          {TABS.map((tab, index) => {
            const isSelected = tab.id === selected;
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[tab.id] = element;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(tab.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`relative min-h-12 flex-1 px-2 text-[15px] font-medium transition-colors sm:flex-none sm:px-1 ${
                  isSelected ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {tab.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-px h-0.5 transition-colors ${
                    isSelected ? "bg-clay" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
          hidden={tab.id !== selected}
          className="focus-visible:outline-offset-[-2px]"
        >
          {panels[tab.id]}
        </div>
      ))}
    </div>
  );
}
