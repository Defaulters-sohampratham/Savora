import type { Metadata } from "next";
import "./globals.css";
import { WorkerProvider } from "@/lib/context/worker-context";
import { Navbar } from "./_components/navbar";

export const metadata: Metadata = {
  title: "Savora | Financial Resilience for Gig Workers",
  description:
    "Adaptive saving recommendations and income-risk insights for gig and informal workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[#f7f9f8] text-slate-950 antialiased">
        <WorkerProvider>
          <Navbar />
          {children}
        </WorkerProvider>
      </body>
    </html>
  );
}

