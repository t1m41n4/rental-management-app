"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SessionProvider>
              {children}
            </SessionProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
