import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Retirement Calculator - FIRE & Die with Zero",
  description: "Plan your financial future with comprehensive retirement calculations using FIRE (Financial Independence, Retire Early) and Die with Zero strategies. Calculate your retirement needs with inflation, investment returns, and partial income projections.",
  keywords: "retirement calculator, FIRE, die with zero, financial independence, retirement planning, investment calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
