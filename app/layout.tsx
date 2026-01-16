import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "하루 계획표 타임라인",
  description: "시간별 격자 기반 타임라인 스케줄러",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
