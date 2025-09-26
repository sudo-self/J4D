import Footer from '@/components/Footer'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jesse 3D",
  description: "Jesse 3D with Three JS",
  openGraph: {
    url: "https://Jesse3d.pages.dev",
    title: "Jesse 3D",
    description: "Explore 3D models in Three.js with Jesse3D",
    siteName: "Jesse 3D",
    images: [{ url: "/J3d.png", width: 1200, height: 630, alt: "Jesse 3D Preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jesse 3D",
    description: "Explore 3D models in Three.js with Jesse3D",
    images: ["/J3d.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}





