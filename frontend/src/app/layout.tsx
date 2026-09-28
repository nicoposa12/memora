import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memora — the photobooth that lives in your guests' phones",
  description: "Scan, snap, download. A browser photobooth for weddings, parties and brand events.",
  keywords: ["photobooth", "web photobooth", "event photobooth", "browser photobooth", "wedding photobooth", "qr code photobooth", "memora"],
  authors: [{ name: "Memora" }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'Memora',
  },
  openGraph: {
    title: "Memora — the photobooth that lives in your guests' phones",
    description: "Scan, snap, download. A browser photobooth for weddings, parties and brand events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memora — the photobooth that lives in your guests' phones",
    description: "Scan, snap, download. A browser photobooth for weddings, parties and brand events.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2b211c",
};

import { RealtimeClientProvider } from "@/components/providers/RealtimeClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
        <RealtimeClientProvider>
          {children}
        </RealtimeClientProvider>
      </body>
    </html>
  );
}
