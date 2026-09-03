import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/theme-context";
import { WorkerProvider } from "@/lib/context/worker-context";
import { Navbar } from "./_components/navbar";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Savora | Adaptive Financial Resilience for Gig Workers",
  description:
    "An adaptive financial resilience engine that dynamically recalculates safe saving targets and safeguards essential cashflow for informal and gig workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var saved = localStorage.getItem('savora-theme');
                if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f9fafb] text-slate-900 dark:bg-[#0b0f12] dark:text-slate-100 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:selection:bg-emerald-950 dark:selection:text-emerald-300 transition-colors duration-150"
      >
        <ThemeProvider>
          <WorkerProvider>
            <Navbar />
            {children}
          </WorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

