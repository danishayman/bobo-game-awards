import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald, Inter, Montserrat, Baskervville, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/auth-context";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LoadingWrapper } from "@/components/ui/loading-wrapper";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

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
  title: "the Bobo Game Awards",
  description: "Veli Nai Veli Premium",
  metadataBase: new URL('https://bobo-game-awards.vercel.app'),
  openGraph: {
    title: "the Bobo Game Awards",
    description: "Veli Nai Veli Premium",
    url: 'https://bobo-game-awards.vercel.app',
    siteName: "the Bobo Game Awards",
    images: [
      {
        url: '/preview.png',
        width: 1200,
        height: 630,
        alt: 'the Bobo Game Awards',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "the Bobo Game Awards",
    description: "Veli Nai Veli Premium",
    images: ['/preview.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Bobo" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} ${inter.variable} ${montserrat.variable} ${baskervville.variable} ${dmSerifText.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning={true}
      >
        <QueryProvider>
          <AuthProvider>
            <LoadingWrapper>
              <ServiceWorkerRegister />
              <Header />
              <main className="flex-1 justify-items-center">
                {children}
              </main>
              <Footer />
            </LoadingWrapper>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
