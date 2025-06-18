import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { WagmiProvider } from "@/components/wagmi-provider";
import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "JB Pay SDK",
  description: "Custom UI components for Juicebox Projects",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiProvider>
            <Header />
            {children}
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
