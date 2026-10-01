"use client";

import { useRef, useState } from "react";
import type { CraftClass } from "@/types";
import { ClassApplicationForm } from "./ClassApplicationForm";
import { ClassCard } from "./ClassCard";
import { ClassGuide } from "./ClassGuide";
import { FormDialog } from "./FormDialog";

interface ClassCatalogProps {
  craftClasses: readonly CraftClass[];
}

export function ClassCatalog({ craftClasses }: ClassCatalogProps) {
  const [selected, setSelected] = useState<CraftClass | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleApply(craftClass: CraftClass, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelected(craftClass);
  }

  function handleClose() {
    setSelected(null);
    triggerRef.current?.focus();
  }

  return (
    <section aria-labelledby="classes-heading" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h2 id="classes-heading" className="font-serif text-2xl font-bold text-ink">
          공방 클래스
        </h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          소규모로 진행하는 원데이 클래스입니다. 재료와 도구는 공방에서 모두 준비합니다.
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {craftClasses.map((craftClass) => (
          <li key={craftClass.id} className="flex">
            <ClassCard craftClass={craftClass} onApply={handleApply} />
          </li>
        ))}
      </ul>

      <ClassGuide />

      {selected ? (
        <FormDialog eyebrow="클래스 신청" title={`${selected.name} 클래스 신청`} onClose={handleClose}>
          <ClassApplicationForm craftClass={selected} />
        </FormDialog>
      ) : null}
    </section>
  );
}
