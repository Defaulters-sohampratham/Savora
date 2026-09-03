import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
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
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#f8faf9] text-slate-950 font-sans antialiased selection:bg-teal-100 selection:text-teal-900"
      >
        <WorkerProvider>
          <Navbar />
          {children}
        </WorkerProvider>
      </body>
    </html>
  );
}

