"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { queryClient } from '@/lib/queryClient';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
              <SessionProvider>
                {children}
                <Toaster position="top-right" />
              </SessionProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
