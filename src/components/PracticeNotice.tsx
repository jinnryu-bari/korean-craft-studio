interface PracticeNoticeProps {
  className?: string;
}

export const PRACTICE_NOTICE_TEXT = "이 사이트는 실습용 프로토타입입니다. 입력한 정보는 저장되거나 전송되지 않으므로 실제 개인정보를 입력하지 마세요.";

export function PracticeNotice({ className = "" }: PracticeNoticeProps) {
  return (
    <p
      className={`flex items-start gap-2 rounded-lg border border-line bg-clay-soft px-4 py-3 text-sm leading-relaxed text-ink ${className}`}
    >
      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
      <span>
        <strong className="font-semibold">안내</strong> {PRACTICE_NOTICE_TEXT}
      </span>
    </p>
  );
}
