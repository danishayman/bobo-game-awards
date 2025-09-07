import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Community Gaming Awards",
  description: "Vote for your favorite games in the annual Community Gaming Awards",
  keywords: ["gaming", "awards", "voting", "community", "games"],
  authors: [{ name: "Community Gaming Awards" }],
  openGraph: {
    title: "Community Gaming Awards",
    description: "Vote for your favorite games in the annual Community Gaming Awards",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Gaming Awards",
    description: "Vote for your favorite games in the annual Community Gaming Awards",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
