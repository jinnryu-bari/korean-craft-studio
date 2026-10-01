"use client";

import { useRef, useState, type FormEvent } from "react";
import type { CraftClass } from "@/types";
import { MOCK_FAILURE_PHONE, submitClassApplication } from "@/lib/mock-api";
import { useSubmitStatus } from "@/lib/use-submit-status";
import {
  PREFERRED_DATE_MAX_DAYS,
  getPreferredDateRange,
  hasErrors,
  validateClassApplication,
  type ClassFormValues,
  type FormErrors,
} from "@/lib/validation";
import { FormField, inputClassName } from "./FormField";

interface ClassApplicationFormProps {
  craftClass: CraftClass;
}

const FIELD_ORDER: (keyof ClassFormValues)[] = ["name", "phone", "preferredDate", "headcount", "message"];
const fieldId = (field: keyof ClassFormValues) => `class-${field}`;

export function ClassApplicationForm({ craftClass }: ClassApplicationFormProps) {
  // The form only mounts on the client after a click, so reading the clock here is hydration-safe.
  const [today] = useState(() => new Date());
  const [values, setValues] = useState<ClassFormValues>({ name: "", phone: "", headcount: "1", preferredDate: "", message: "" });
  const [errors, setErrors] = useState<FormErrors<ClassFormValues>>({});
  const { status, response, submit } = useSubmitStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const isSubmitting = status === "submitting";
  const dateRange = getPreferredDateRange(today);
  const validationOptions = { capacity: craftClass.capacity, today };

  function update(field: keyof ClassFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) {
      const nextErrors = validateClassApplication(next, validationOptions);
      setErrors((previous) => ({ ...previous, [field]: nextErrors[field] }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validateClassApplication(values, validationOptions);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`#${fieldId(firstInvalid)}`)?.focus();
      return;
    }
    void submit(() =>
      submitClassApplication({
        classId: craftClass.id,
        name: values.name.trim(),
        phone: values.phone.trim(),
        headcount: Number(values.headcount),
        preferredDate: values.preferredDate,
        message: values.message.trim(),
      }),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="status" aria-live="polite">
        {status === "submitting" ? (
          <p className="text-sm text-ink-muted">접수 중입니다. 잠시만 기다려 주세요.</p>
        ) : null}
        {status === "success" && response?.success ? (
          <div className="flex flex-col gap-2 rounded-lg border border-success/30 bg-success-soft p-4 text-ink">
            <p className="font-semibold text-success">{response.message}</p>
            <p className="text-sm">
              접수번호 <strong className="font-mono tracking-wide">{response.receiptNumber}</strong>
            </p>
            <p className="text-sm text-ink-muted">
              {craftClass.name} · {values.headcount}명 · {values.preferredDate}
            </p>
          </div>
        ) : null}
      </div>

      {status === "success" ? (
        <button
          type="button"
          onClick={(event) => event.currentTarget.closest("dialog")?.close()}
          className="min-h-11 rounded-lg bg-ink px-4 text-sm font-medium text-paper hover:bg-indigo"
        >
          확인
        </button>
      ) : (
        <form
          ref={formRef}
          noValidate
          aria-busy={isSubmitting}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <FormField id={fieldId("name")} name="name" label="이름" error={errors.name}>
            {(props) => (
              <input
                {...props}
                data-autofocus
                type="text"
                autoComplete="off"
                maxLength={40}
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <FormField
            id={fieldId("phone")}
            name="phone"
            label="연락처"
            hint={`예: 010-1234-5678 · ${MOCK_FAILURE_PHONE} 입력 시 Mock 오류 응답을 확인할 수 있습니다.`}
            error={errors.phone}
          >
            {(props) => (
              <input
                {...props}
                type="tel"
                inputMode="tel"
                autoComplete="off"
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="class-title" className="text-sm font-medium text-ink">
              클래스
            </label>
            <input
              id="class-title"
              name="classTitle"
              type="text"
              readOnly
              value={craftClass.name}
              className={`${inputClassName} bg-surface`}
            />
          </div>

          <FormField
            id={fieldId("preferredDate")}
            name="preferredDate"
            label="희망 날짜"
            hint={`내일부터 ${PREFERRED_DATE_MAX_DAYS}일 이내`}
            error={errors.preferredDate}
          >
            {(props) => (
              <input
                {...props}
                type="date"
                min={dateRange.min}
                max={dateRange.max}
                value={values.preferredDate}
                onChange={(event) => update("preferredDate", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <FormField
            id={fieldId("headcount")}
            name="headcount"
            label="인원"
            hint={`최대 ${craftClass.capacity}명`}
            error={errors.headcount}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                inputMode="numeric"
                min={1}
                max={craftClass.capacity}
                step={1}
                value={values.headcount}
                onChange={(event) => update("headcount", event.target.value)}
                className={inputClassName}
              />
            )}
          </FormField>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("message")} className="text-sm font-medium text-ink">
              요청사항 <span className="text-xs font-normal text-ink-muted">(선택)</span>
            </label>
            <textarea
              id={fieldId("message")}
              name="message"
              rows={3}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${fieldId("message")}-hint ${fieldId("message")}-error` : `${fieldId("message")}-hint`}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={inputClassName}
            />
            <p id={`${fieldId("message")}-hint`} className="text-xs text-ink-muted">
              500자 이내로 입력해 주세요.
            </p>
            {errors.message ? (
              <p id={`${fieldId("message")}-error`} className="text-sm text-danger">
                {errors.message}
              </p>
            ) : null}
          </div>

          {status === "error" && response && !response.success ? (
            <p role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
              {response.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 rounded-lg bg-ink px-4 text-sm font-medium text-paper hover:bg-indigo disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? "접수 중..." : status === "error" ? "다시 시도" : "신청하기"}
          </button>
        </form>
      )}
    </div>
  );
}
