import type { Metadata } from "next";
import "./globals.css";

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
