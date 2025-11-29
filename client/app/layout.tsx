import type { Metadata } from "next";
import AppContextProvider from '@/context/AppContext';
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// 1. Import Toastify CSS and Container
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Font Configurations
const scienceGothicFont = localFont({
  src: '../public/fonts/Science-Gothic.woff2', 
  weight: '400',
  style: 'normal',
  variable: '--font-science-gothic',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eco Money",
  description: "Money Tracking App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning={true} fixes the "bis_skin_checked" extension error */}
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${scienceGothicFont.variable} antialiased`}
      >
        <AppContextProvider>
          {children}
          {/* ToastContainer handles the popup notifications globally */}
          <ToastContainer position="top-right" autoClose={3000} />
        </AppContextProvider>
      </body>
    </html>
  );
}