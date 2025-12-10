import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Adjust path if your font is elsewhere
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
// Assuming you have this
import AppContextProvider from "@/context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Adjust path as needed
const scienceGothic = localFont({
  src: "../public/fonts/Science-Gothic.woff2",
  variable: "--font-science-gothic",
});

export const metadata: Metadata = {
  title: "Eco Money",
  description: "Manage your finances with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is vital for next-themes
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${scienceGothic.variable} antialiased`}
      >
        {/* attribute="class" tells next-themes to toggle the 'dark' class on the <html> element.
          defaultTheme="system" sets the initial theme based on the user's system preference.
          enableSystem allows it to respond to system changes.
        */}
        <ThemeProvider>
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}