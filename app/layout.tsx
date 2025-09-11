import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Inter, Montserrat, Baskervville, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoadingWrapper } from "@/components/ui/loading-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display font for main headings - bold and impactful
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Clean modern font for body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Elegant font for year and special text
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Classic serif font for main title
const baskervville = Baskervville({
  variable: "--font-baskervville",
  subsets: ["latin"],
  weight: ["400"],
});

// DM Serif Text for elegant headings
const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Gaming Awards - Community Voting",
  description: "Vote for your favorite games of the year in our community-driven gaming awards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${inter.variable} ${montserrat.variable} ${baskervville.variable} ${dmSerifText.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <LoadingWrapper>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </LoadingWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
