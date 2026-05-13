import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hackura Sentinel AI - Cybersecurity Intelligence",
  description: "AI-powered threat intelligence dashboard for detecting phishing, scams, and malicious infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Preconnect to the backend API to reduce latency during initial scans */}
        <link rel="preconnect" href="https://api.hackura.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.hackura.app" />
      </head>
      <body className="min-h-full bg-black text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
