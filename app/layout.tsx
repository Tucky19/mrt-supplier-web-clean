import "./globals.css";
import type { ReactNode } from "react";
import LineContactButton from "@/components/ui/LineContactButton";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-950">
        {children}
        <LineContactButton />
      </body>
    </html>
  );
}