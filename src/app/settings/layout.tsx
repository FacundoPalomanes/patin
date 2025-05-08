import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "NacPatin User Settings",
  description: "En esta pagina podras editar la configuracion de tu perfil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section> {children} </section>
  );
}
