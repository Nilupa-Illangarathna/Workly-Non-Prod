import type React from "react";
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { ViewTransitions } from "next-view-transitions";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the font weights you need
  display: "swap", // Recommended for better user experience
});

export const metadata: Metadata = {
  title: "Workly LMS - Digital Marketing Training & Job Placement Program",
  description:
    "Sri Lanka's First Comprehensive Training Program Guaranteeing High-Paying Remote Jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            lato.className
          )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 12000,
                removeDelay: 3000,
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
