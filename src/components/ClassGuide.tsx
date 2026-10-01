export function ClassGuide() {
  return (
    <section aria-labelledby="class-guide-heading" className="mt-12 rounded-xl border border-line bg-surface p-6">
      <h3 id="class-guide-heading" className="font-serif text-xl font-bold text-ink">
        클래스 안내
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        아래 내용은 실습용 가상 안내입니다. 실제로 운영되는 클래스는 없습니다.
      </p>
      <div className="mt-5 grid gap-6 md:grid-cols-3">
        <div>
          <h4 className="font-semibold text-ink">클래스 소개</h4>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            전통 공예를 처음 접하는 분도 따라 할 수 있는 소규모 원데이 클래스를 가정한 예시입니다. 재료와 도구는
            모두 준비되어 있다고 가정합니다.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-ink">준비물 (가상 안내)</h4>
          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-ink-muted">
            <li>편한 복장</li>
            <li>앞치마 (공방 대여 가능, 가상)</li>
            <li>긴 머리는 묶을 끈</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-ink">취소·변경 안내 (가상 안내)</h4>
          <ul className="mt-2 list-disc pl-5 text-sm leading-relaxed text-ink-muted">
            <li>수업 3일 전까지 무료 취소·일정 변경</li>
            <li>2일 전부터 당일까지는 취소·변경이 어렵다고 가정합니다</li>
            <li>실습용이므로 실제 결제나 환불은 없습니다</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
