import type { MouseEvent } from "react";
import type { CraftClass } from "@/types";
import { formatDuration, formatPrice } from "@/lib/format";
import { CraftPlaceholder } from "./CraftPlaceholder";

interface ClassCardProps {
  craftClass: CraftClass;
  onApply: (craftClass: CraftClass, trigger: HTMLButtonElement) => void;
}

export function ClassCard({ craftClass, onApply }: ClassCardProps) {
  const titleId = `class-${craftClass.id}-name`;

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full flex-col overflow-hidden rounded-xl border border-line bg-surface"
    >
      <CraftPlaceholder
        craftType={craftClass.craftType}
        label={`${craftClass.name} 클래스 대표 이미지`}
        className="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 id={titleId} className="font-serif text-lg font-bold leading-snug text-ink">
          {craftClass.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-ink-muted">{craftClass.description}</p>
        <dl className="grid grid-cols-3 gap-2 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-ink-muted">가격</dt>
            <dd className="font-semibold text-ink">{formatPrice(craftClass.price)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">소요 시간</dt>
            <dd className="font-semibold text-ink">{formatDuration(craftClass.durationMinutes)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">인원</dt>
            <dd className="font-semibold text-ink">최대 {craftClass.capacity}명</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={(event: MouseEvent<HTMLButtonElement>) => onApply(craftClass, event.currentTarget)}
          aria-label={`${craftClass.name} 신청하기`}
          className="min-h-11 rounded-lg bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-indigo"
        >
          신청하기
        </button>
      </div>
    </article>
  );
}
