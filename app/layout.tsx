import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Screenshot",
  description: "สร้างภาพหน้าจอจากเว็บไซต์ได้ง่ายๆ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}