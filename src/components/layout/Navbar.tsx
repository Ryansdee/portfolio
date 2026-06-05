"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)

      const sections = ["expertise", "projets", "tarifs", "contact"]
      const current = sections.find((id) => {
        const el = document.getElementById(id)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 80 && rect.bottom >= 80
      })
      setActiveSection(current ?? "")
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Ferme le menu mobile au scroll
  useEffect(() => {
    if (mobileOpen) setMobileOpen(false)
  }, [activeSection])

  const links = [
    { label: "Expertise", href: "#expertise", id: "expertise" },
    { label: "Projets", href: "#projets", id: "projets" },
    { label: "Tarifs", href: "#tarifs", id: "tarifs" },
    { label: "Contact", href: "#contact", id: "contact" },
  ]

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/80"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
          >
            <span className="text-sm font-semibold text-neutral-900 tracking-tight group-hover:text-neutral-600 transition-colors duration-150">
              Ryan Deschuyteneer
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
              DEV
            </span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm px-3.5 py-1.5 transition-colors duration-150",
                  activeSection === link.id
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {link.label}
                {/* Active underline */}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-neutral-900 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Disponibilité */}
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              Disponible
            </span>

            {/* CTA */}
            <Link
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors duration-150"
            >
              Discutons
              <span className="text-neutral-400 text-xs">↗</span>
            </Link>

            {/* Burger mobile */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] group"
            >
              <span
                className={cn(
                  "w-5 h-px bg-neutral-700 transition-all duration-200 origin-center",
                  mobileOpen && "rotate-45 translate-y-[6.5px]"
                )}
              />
              <span
                className={cn(
                  "w-5 h-px bg-neutral-700 transition-all duration-200",
                  mobileOpen && "opacity-0 scale-x-0"
                )}
              />
              <span
                className={cn(
                  "w-5 h-px bg-neutral-700 transition-all duration-200 origin-center",
                  mobileOpen && "-rotate-45 -translate-y-[6.5px]"
                )}
              />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 bg-white/95 backdrop-blur-md border-t border-neutral-100",
            mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between text-sm py-2.5 border-b border-neutral-100 last:border-0 transition-colors duration-150",
                  activeSection === link.id
                    ? "text-neutral-900 font-medium"
                    : "text-neutral-500 hover:text-neutral-900"
                )}
              >
                {link.label}
                <span className="text-neutral-300 text-xs">↗</span>
              </Link>
            ))}
            <div className="pt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                </span>
                Disponible
              </span>
              <Link
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                Discutons ↗
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer pour compenser le fixed */}
      <div className="h-14" />
    </>
  )
}