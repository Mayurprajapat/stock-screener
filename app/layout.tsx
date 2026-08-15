import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Screener",
  description: "Advanced stock screener with real-time charts and filtering",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
