import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import CustomCursor from "@/components/cursor/CustomCursor"
import ScrollProgressBar from "@/components/ui/ScrollProgressBar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "netzy-vulns | Offensive Security Research",
  description: "Red Teaming, Threat Modeling, 보안 인프라 설계 및 보안 기술 연구",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased cursor-none`}
      >
        <ScrollProgressBar />
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
