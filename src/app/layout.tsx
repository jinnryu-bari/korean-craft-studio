import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "온결 공방",
  description: "도자기·나전칠기·보자기·목공예를 소개하는 온결 공방 실습용 프로토타입입니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-paper font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          본문으로 건너뛰기
        </a>
        {children}
      </body>
    </html>
  );
}
