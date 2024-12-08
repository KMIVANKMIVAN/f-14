import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queyClient";

export const metadata: Metadata = {
  title: "Control de Paradas",
  description: "Sindicato 14 de septiembre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster expand={false} position="top-center" />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

