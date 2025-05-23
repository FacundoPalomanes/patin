import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NacPatin",
  description: "Esta es una pagina web de patin profesora Natalia Ciardello Anahi para la utilizacion de un sistema de pago y usuarios, etc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>{children}</section>
  );
}
