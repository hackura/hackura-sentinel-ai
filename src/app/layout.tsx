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
      <body className="min-h-full bg-black text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
