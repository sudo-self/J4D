import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jesse 3D",
  description: "Jesse 3D with Three JS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192-maskable.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512-maskable.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {children}

        <footer className="fixed bottom-4 left-0 w-full text-center text-white hover:text-yellow-400 transition-colors duration-300 cursor-pointer z-50">
        ᴶᵉˢˢᵉ³ᵈ @𝕣𝕖𝕒𝕔𝕥-𝕥𝕙𝕣𝕖𝕖/𝕗𝕚𝕓𝕖𝕣
        </footer>
      </body>
    </html>
  );
}


