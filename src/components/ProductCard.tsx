import type { MouseEvent } from "react";
import type { Craft } from "@/types";
import { formatPrice } from "@/lib/format";
import { CraftPlaceholder } from "./CraftPlaceholder";

interface ProductCardProps {
  craft: Craft;
  onInquire: (craft: Craft, trigger: HTMLButtonElement) => void;
}

export function ProductCard({ craft, onInquire }: ProductCardProps) {
  const titleId = `product-${craft.id}-name`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface"
    >
      <CraftPlaceholder craftType={craft.craftType} label={`${craft.name} 이미지`} className="aspect-[4/3]" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-medium tracking-wider text-clay">{craft.craftType}</p>
        <h3 id={titleId} className="font-serif text-lg font-bold leading-snug text-ink">
          {craft.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{craft.description}</p>
        <p className="text-base font-semibold text-ink">{formatPrice(craft.price)}</p>
        <button
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>) => onInquire(craft, event.currentTarget)}
          aria-label={`주문 문의하기 - ${craft.name}`}
          className="min-h-11 rounded-lg border border-ink px-4 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          주문 문의하기
        </button>
      </div>
    </article>
  );
}
