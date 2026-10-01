"use client";

import { useEffect, useId, useRef, type ReactNode, type SyntheticEvent } from "react";
import { PracticeNotice } from "./PracticeNotice";

interface FormDialogProps {
  /** Short label shown above the title, e.g. "주문 문의". */
  eyebrow: string;
  title: string;
  /** Called after the dialog has closed (Esc, 닫기 button or programmatic close). */
  onClose: () => void;
  children: ReactNode;
}

/**
 * Native modal <dialog>. It opens on mount and is removed by the parent via `onClose`,
 * so every opening starts with a fresh form.
 */
export function FormDialog({ eyebrow, title, onClose, children }: FormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClose={onClose}
      className="fixed inset-0 m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-surface p-0 text-ink shadow-xl backdrop:bg-ink/45 sm:m-auto sm:max-h-[calc(100dvh-4rem)] sm:w-[min(36rem,calc(100%-2rem))] sm:rounded-2xl"
    >
      <div className="flex flex-col gap-4 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium tracking-wider text-clay">{eyebrow}</p>
            <h2 id={titleId} className="font-serif text-xl font-bold leading-snug text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="min-h-11 min-w-11 shrink-0 rounded-lg border border-line px-3 text-sm text-ink-muted hover:border-ink hover:text-ink"
          >
            닫기
          </button>
        </div>
        <PracticeNotice />
        {children}
      </div>
    </dialog>
  );
}
