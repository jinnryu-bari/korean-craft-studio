const GUIDE_ITEMS: readonly { term: string; detail: string }[] = [
  { term: "주문 제작 기간", detail: "주문 확인 후 약 2~4주가 걸리는 것으로 가정한 안내입니다." },
  { term: "배송 방법", detail: "택배 배송을 가정하며, 배송비는 무료로 표시한 가상 정보입니다." },
  { term: "교환·환불", detail: "수령 후 7일 이내 접수 가능하다고 가정한 안내입니다. 주문 제작품은 제외됩니다." },
];

export function ShippingGuide() {
  return (
    <section aria-labelledby="shipping-guide-heading" className="mt-12 rounded-xl border border-line bg-surface p-6">
      <h2 id="shipping-guide-heading" className="font-serif text-xl font-bold text-ink">
        브랜드 소개 및 제작·배송 안내
      </h2>
      <p className="mt-2 text-sm font-medium text-clay">
        실습용 가상 안내입니다. 실제로 제작되거나 배송되는 상품은 없습니다.
      </p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-base font-bold text-ink">브랜드 소개</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            온결 공방은 도자기, 나전칠기, 보자기, 목공예의 결을 오늘의 생활로 잇는다는 설정의 가상 공방입니다.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-base font-bold text-ink">가상 제작·배송 안내</h3>
          <ul className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-ink-muted">
            {GUIDE_ITEMS.map((item) => (
              <li key={item.term}>
                <strong className="font-semibold text-ink">{item.term}</strong> {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
