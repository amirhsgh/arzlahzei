import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdTracker } from "@/components/ads/AdTracker";
import { CommandSearch } from "@/components/ui/CommandSearch";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ارزلحظه‌ای | قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال",
    template: "%s | ارزلحظه‌ای",
  },
  description:
    "مشاهده قیمت لحظه‌ای دلار، یورو، طلا، سکه و ارزهای دیجیتال. نمودار قیمت، تحلیل بازار و ابزارهای محاسباتی ارزی.",
  keywords: [
    "قیمت دلار",
    "قیمت طلا",
    "قیمت سکه",
    "ارز دیجیتال",
    "قیمت لحظه‌ای",
    "نرخ ارز",
    "بیت‌کوین",
    "تتر",
  ],
  metadataBase: new URL("https://nerkhe.ir"),
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://nerkhe.ir",
    siteName: "ارزلحظه‌ای",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <CommandSearch />
            <MobileBottomNav />
            <AdTracker />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
