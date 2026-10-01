const INFO = [
  { label: "주소", value: "서울특별시 가상구 공예로 1" },
  { label: "운영시간", value: "화–일 10:00–18:00" },
  { label: "문의처", value: "02-0000-0000 / hello@example.invalid" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <p className="font-serif text-lg font-bold text-ink">온결 공방</p>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          {INFO.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="font-semibold text-ink">
                {item.label} <span className="font-normal text-clay">(실습용 가상 정보)</span>
              </dt>
              <dd className="leading-relaxed text-ink-muted">{item.value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm leading-relaxed text-ink-muted">
          이 사이트는 실습용 프로토타입으로, 실제 주문이나 클래스 신청은 접수되지 않습니다.
        </p>
      </div>
    </footer>
  );
}
