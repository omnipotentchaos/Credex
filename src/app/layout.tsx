import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BurnLens — AI Spend Audit for Startups | by Credex",
  description:
    "Find out if you're overspending on AI tools. Get a free, instant audit of your Cursor, Copilot, Claude, ChatGPT, and Gemini spend — with actionable savings recommendations.",
  keywords: [
    "AI spend audit",
    "AI tool costs",
    "Cursor pricing",
    "GitHub Copilot cost",
    "ChatGPT enterprise pricing",
    "Claude pricing",
    "AI infrastructure savings",
    "Credex",
  ],
  authors: [{ name: "Credex", url: "https://credex.rocks" }],
  openGraph: {
    title: "BurnLens — Stop Overspending on AI Tools",
    description:
      "Free AI spend audit. See exactly where your team is overpaying on Cursor, Copilot, Claude, ChatGPT & more.",
    type: "website",
    siteName: "BurnLens by Credex",
  },
  twitter: {
    card: "summary_large_image",
    title: "BurnLens — Stop Overspending on AI Tools",
    description:
      "Free AI spend audit. See exactly where your team is overpaying on Cursor, Copilot, Claude, ChatGPT & more.",
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
        <meta name="theme-color" content="#112F34" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
