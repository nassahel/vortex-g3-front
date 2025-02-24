import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "LuxShop",
  description: "LuxShop | Elegí tu estilo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={` antialiased`}>
        <div><Toaster position="bottom-right" /></div>
        {children}
      </body>
    </html>
  );
}
