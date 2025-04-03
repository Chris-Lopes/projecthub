import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProjectHub",
  description: "Share and discover amazing projects",
};

export const viewport: Viewport = {
  themeColor: "#121827",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} bg-gray-900 text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
