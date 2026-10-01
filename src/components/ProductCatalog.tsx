"use client";

import { useRef, useState } from "react";
import type { Craft } from "@/types";
import { FormDialog } from "./FormDialog";
import { OrderInquiryForm } from "./OrderInquiryForm";
import { ProductCard } from "./ProductCard";
import { ShippingGuide } from "./ShippingGuide";

interface ProductCatalogProps {
  crafts: readonly Craft[];
}

export function ProductCatalog({ crafts }: ProductCatalogProps) {
  const [selected, setSelected] = useState<Craft | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  function handleInquire(craft: Craft, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelected(craft);
  }

  function handleClose() {
    setSelected(null);
    triggerRef.current?.focus();
  }

  return (
    <section aria-labelledby="products-heading" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h2 id="products-heading" className="font-serif text-2xl font-bold text-ink">
          공예품 전시·주문
        </h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          장인이 한 점씩 만든 공예품입니다. 마음에 드는 작품이 있다면 주문 문의를 남겨 주세요.
        </p>
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {crafts.map((craft) => (
          <li key={craft.id} className="flex">
            <ProductCard craft={craft} onInquire={handleInquire} />
          </li>
        ))}
      </ul>

      <ShippingGuide />

      {selected ? (
        <FormDialog eyebrow="주문 문의" title={`${selected.name} 주문 문의`} onClose={handleClose}>
          <OrderInquiryForm product={selected} />
        </FormDialog>
      ) : null}
    </section>
  );
}
