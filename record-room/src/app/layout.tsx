import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Record Room",
  description: "A 3D virtual room experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
