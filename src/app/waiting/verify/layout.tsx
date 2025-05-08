import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NacPatin Esperando Verificacion",
  description: "En esta url estas esperando a que te llegue el mail para verificar tu cuenta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}
    </section>
  );
}
