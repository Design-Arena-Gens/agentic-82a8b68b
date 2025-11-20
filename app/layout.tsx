import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "TikTok Agent Control Center",
  description:
    "Bring back the TikTok agent—an autonomous strategist that generates content blueprints, hooks, and daily action plans tailored to your brand."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-transparent antialiased">
        <div className="noise-layer" />
        {children}
      </body>
    </html>
  );
}
