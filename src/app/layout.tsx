import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Ryan Deschuyteneer — Développeur web & dépannage informatique",
  description:
    "Je conçois des sites et des applications web pour des indépendants et des petites entreprises en Belgique, et je dépanne les ordinateurs autour de Soignies.",
  keywords: [
    "développeur web",
    "belgique",
    "soignies",
    "dépannage informatique",
    "next.js",
    "freelance",
  ],
  openGraph: {
    title: "Ryan Deschuyteneer — Développeur web & dépannage informatique",
    description:
      "Sites et applications web sur mesure en Belgique, dépannage informatique autour de Soignies.",
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
    <html lang="fr" className={`${inter.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  )
}