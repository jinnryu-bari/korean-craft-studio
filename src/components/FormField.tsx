import type { ReactNode } from "react";

export interface FieldControlProps {
  id: string;
  name: string;
  required: true;
  "aria-required": true;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: (controlProps: FieldControlProps) => ReactNode;
}

export const inputClassName =
  "min-h-11 w-full rounded-lg border bg-paper px-3 py-2 text-base text-ink placeholder:text-ink-muted/70 aria-[invalid=true]:border-danger border-line focus-visible:border-indigo";

export function FormField({ id, name, label, hint, error, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        <span aria-hidden="true" className="ml-0.5 text-danger">
          *
        </span>
      </label>
      {children({
        id,
        name,
        required: true,
        "aria-required": true,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
      })}
      {hint ? (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
