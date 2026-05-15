import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FirstStep Korea",
  description: "Your personal guide for your first weeks in Korea",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <div className="mx-auto min-h-dvh w-full max-w-mobile shadow-[0_0_0_1px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </body>
    </html>
  );
}
