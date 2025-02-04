import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { TanstackQueryProvider } from "./_providers/TanstackQueryProvider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Toztoz",
  description: "Luxury homeware for people who love timeless design quality",
  keywords: [
    "e-commerce",
    "online shopping",
    "electronics",
    "fashion",
    "home goods",
    "Toztoz",
    "buy online",
    "secure payments",
    "fast delivery",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body>
          <TanstackQueryProvider>
            <main>{children}</main>
            <Analytics />
            <SpeedInsights />
            <Toaster />
          </TanstackQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
