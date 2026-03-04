import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "../globals.css";

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PHOSS Hospital System",
  description: "ระบบจัดการข้อมูลผู้ป่วย",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={`${ibmPlexThai.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
