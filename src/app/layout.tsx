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
  description: "Share and discover amazing student projects",
  keywords: [
    "projects",
    "student projects",
    "academic showcase",
    "portfolio",
    "SDG goals",
  ],
  authors: [{ name: "ProjectHub Team" }],
  creator: "ProjectHub",
};

export const viewport: Viewport = {
  themeColor: "#0D0D14", // Updated to match the dark purple theme
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} bg-[#0D0D14] text-gray-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
