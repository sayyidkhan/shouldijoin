import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Should I Join — Company health checks",
  description: "Understand the company behind your next career move. Evidence-led company checks and a personal watchlist.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
