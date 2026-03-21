"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { label: "Expertise", href: "#expertise" },
    { label: "Projets", href: "#projets" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-neutral-200"
          : "bg-white border-b border-neutral-200"
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold text-neutral-900 tracking-tight"
        >
          Ryan Deschuyteneer
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-2 text-sm text-neutral-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Disponible
          </span>
          <Link
            href="#contact"
            className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 transition-colors duration-150"
          >
            Discutons →
          </Link>
        </div>
      </nav>
    </header>
  )
}