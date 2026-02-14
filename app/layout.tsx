import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Anta } from 'next/font/google'
import "./globals.css";
import { Toaster } from 'react-hot-toast'

const anta = Anta({
  subsets: ['latin'],
  weight: '400',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Bookmark App",
  description: "Bookmark manager with realtime sync",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anta.className} antialiased min-h-screen tracking-wider`}
      >
        <Toaster
          position="top-center" 
          toastOptions={{
            duration: 2500,
            style: {
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
            },
        }}
        />
        {children}
      </body>
    </html>
  );
}
