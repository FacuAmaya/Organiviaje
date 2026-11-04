import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Encabezado } from "@/components/layout/encabezado";
import { SCRIPT_TEMA } from "@/lib/tema";
import { textos } from "@/textos/es";

import { Providers } from "./providers";
import "./globals.css";

// Tipografía provisoria hasta definir el look & feel (docs/ux/). next/font la sirve desde
// nuestro propio dominio: sin pedidos a Google y sin saltos de layout al cargar.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: textos.app.nombre, template: `%s · ${textos.app.nombre}` },
  description: textos.app.descripcion,
  applicationName: textos.app.nombre,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // permite usar las safe areas de iOS
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de tema modifica <html> antes de que React hidrate.
    <html lang="es" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Providers>
          <Encabezado />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
