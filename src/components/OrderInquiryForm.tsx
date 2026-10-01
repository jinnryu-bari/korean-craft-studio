"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Craft } from "@/types";
import { formatPrice } from "@/lib/format";
import { MOCK_FAILURE_PHONE, submitOrderInquiry } from "@/lib/mock-api";
import { useSubmitStatus } from "@/lib/use-submit-status";
import {
  MESSAGE_MAX_LENGTH,
  QUANTITY_MAX,
  QUANTITY_MIN,
  hasErrors,
  validateOrderInquiry,
  type FormErrors,
  type OrderFormValues,
} from "@/lib/validation";
import { FormField, inputClassName } from "./FormField";

interface OrderInquiryFormProps {
  product: Craft;
}

const FIELD_ORDER: (keyof OrderFormValues)[] = ["name", "phone", "quantity", "message"];
const fieldId = (field: keyof OrderFormValues) => `order-${field}`;

export function OrderInquiryForm({ product }: OrderInquiryFormProps) {
  const [values, setValues] = useState<OrderFormValues>({ name: "", phone: "", message: "", quantity: "1" });
  const [errors, setErrors] = useState<FormErrors<OrderFormValues>>({});
  const { status, response, submit } = useSubmitStatus();
  const formRef = useRef<HTMLFormElement>(null);
  const messageDescribedBy = errors.message ? "order-message-hint order-message-error" : "order-message-hint";
  const isSubmitting = status === "submitting";

  function update(field: keyof OrderFormValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) {
      const nextErrors = validateOrderInquiry(next);
      setErrors((previous) => ({ ...previous, [field]: nextErrors[field] }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const nextErrors = validateOrderInquiry(values);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) formRef.current?.querySelector<HTMLElement>(`#${fieldId(firstInvalid)}`)?.focus();
      return;
    }
    void submit(() =>
      submitOrderInquiry({
        productId: product.id,
        name: values.name.trim(),
        phone: values.phone.trim(),
        message: values.message.trim(),
        quantity: Number(values.quantity),
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
              {product.name} · 수량 {values.quantity}개
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
            <label htmlFor="order-product" className="text-sm font-medium text-ink">
              상품
            </label>
            <input
              id="order-product"
              name="product"
              type="text"
              readOnly
              value={`${product.name} · ${formatPrice(product.price)}`}
              className={`${inputClassName} bg-surface`}
            />
          </div>

          <FormField
            id={fieldId("quantity")}
            name="quantity"
            label="수량"
            hint={`${QUANTITY_MIN}~${QUANTITY_MAX}개`}
            error={errors.quantity}
          >
            {(props) => (
              <input
                {...props}
                type="number"
                inputMode="numeric"
                min={QUANTITY_MIN}
                max={QUANTITY_MAX}
                step={1}
                value={values.quantity}
                onChange={(event) => update("quantity", event.target.value)}
                className={`${inputClassName} sm:max-w-40`}
              />
            )}
          </FormField>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId("message")} className="text-sm font-medium text-ink">
              요청사항 <span className="text-ink-muted">(선택)</span>
            </label>
            <textarea
              id={fieldId("message")}
              name="message"
              rows={4}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={messageDescribedBy}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className={`${inputClassName} resize-y`}
            />
            <p id="order-message-hint" className="text-xs text-ink-muted">
              {`선택 입력 · ${MESSAGE_MAX_LENGTH}자 이내`}
            </p>
            {errors.message ? (
              <p id="order-message-error" className="text-sm text-danger">
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
            {isSubmitting ? "접수 중..." : status === "error" ? "다시 시도" : "문의 보내기"}
          </button>
        </form>
      )}
    </div>
  );
}
