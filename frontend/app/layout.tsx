"use client";

import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { useEffect } from 'react'; // Import useEffect

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("RootLayout - Before SessionProvider"); // Debug log: before SessionProvider

  useEffect(() => { // useEffect hook for debug log - MOVED OUTSIDE JSX
    console.log("RootLayout - Inside SessionProvider"); // Debug log: inside SessionProvider
  }, []);

  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
