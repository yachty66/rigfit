import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "rigfit · What do I need to run it locally?",
  description: "Pick an open-weight LLM and get the best hardware build to run it locally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}>{children}</body>
    </html>
  );
}
