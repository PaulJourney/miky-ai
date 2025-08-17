import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Miky - AI That Makes a Real Difference",
  description: "Professional AI assistance with specialized expertise while helping clean our oceans.",
  keywords: "AI, artificial intelligence, ocean cleanup, environmental impact, chatbot, assistant, professional AI, specialized AI, ocean conservation",
  authors: [{ name: "Miky.ai" }],
  openGraph: {
    title: "Miky - AI That Makes a Real Difference",
    description: "Professional AI assistance with specialized expertise while helping clean our oceans.",
    url: "https://miky.ai",
    siteName: "Miky",
    type: "website",
    images: [
      {
        url: "https://miky.ai/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Miky - AI That Makes a Real Difference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Miky - AI That Makes a Real Difference",
    description: "Professional AI assistance with specialized expertise while helping clean our oceans.",
    images: ["https://miky.ai/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://miky.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body suppressHydrationWarning className="antialiased bg-gray-950 text-white font-inter">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
