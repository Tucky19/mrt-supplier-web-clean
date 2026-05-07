import "./globals.css";
import type { ReactNode } from "react";
import { IBM_Plex_Sans, Sarabun } from "next/font/google";
import LineContactButton from "@/components/ui/LineContactButton";

const fontUi = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ui",
});

const fontTech = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tech",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${fontUi.variable} ${fontTech.variable} bg-slate-50 text-slate-950`}
      >
        {children}
        <LineContactButton />
      </body>
    </html>
  );
}
