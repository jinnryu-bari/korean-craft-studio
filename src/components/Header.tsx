import { PracticeNotice } from "./PracticeNotice";

export function Header() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-10 pt-12 sm:px-6 sm:pb-14 sm:pt-20 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-xs font-medium tracking-[0.3em] text-clay">ONGYEOL CRAFT STUDIO</p>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-ink sm:text-5xl">온결 공방</h1>
          <p className="text-lg leading-relaxed text-ink">흙과 옻, 천과 나무의 결을 오늘의 생활에 맞게 다듬습니다.</p>
          <p className="text-base leading-loose text-ink-muted">
            온결 공방은 도자기, 나전칠기, 보자기, 목공예처럼 오래된 손의 기술을 조용히 이어 가는 가상의 공방입니다.
            천천히 공예품을 둘러보고, 마음에 드는 작품은 주문 문의로 남겨 보세요. 직접 만들어 보고 싶다면 공방
            클래스에서 손끝으로 결을 익힐 수 있습니다.
          </p>
        </div>
        <PracticeNotice />
      </div>
    </header>
  );
}
