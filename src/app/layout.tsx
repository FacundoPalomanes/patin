// src/app/layout.tsx ❌ NO LE PONGAS 'use client'
import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers"; // <-- Nuevo archivo que vamos a crear

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NacPatin",
  description: "Página oficial de la profesora de patín Natalia Ciardello Anahí. Accedé a tu perfil, gestioná pagos, clases y usuarios desde un sistema simple, seguro y personalizado.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <Providers> {/* <-- Aquí envolvés tu app */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
