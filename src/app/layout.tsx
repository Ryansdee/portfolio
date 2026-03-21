import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ryan Deschuyteneer — Développeur Web & IT",
  description:
    "Développeur Web full-stack basé en Belgique. Next.js, Firebase, React Native. Disponible pour missions freelance.",
  keywords: ["développeur web", "belgique", "next.js", "firebase", "freelance"],
  openGraph: {
    title: "Ryan Deschuyteneer — Développeur Web & IT",
    description: "Développeur Web full-stack basé en Belgique.",
    url: "https://ryansdee.netlify.app",
    siteName: "Ryan Deschuyteneer",
    locale: "fr_BE",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}