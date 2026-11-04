"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { label: "Projets", href: "#projets" },
  { label: "Services", href: "#services" },
  { label: "Dépannage", href: "#depannage" },
  { label: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 bg-[#FBFAF8] transition-colors duration-200",
          scrolled ? "border-b border-neutral-200" : "border-b border-transparent"
        )}
      >
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-[19px] text-neutral-900 hover:text-neutral-500 transition-colors"
          >
            Ryan Deschuyteneer
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="md:hidden text-[14px] text-neutral-900"
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-neutral-200 bg-[#FBFAF8]">
            <div className="max-w-5xl mx-auto px-6 py-2 flex flex-col">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-[15px] text-neutral-700 border-b border-neutral-100 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="h-16" />
    </>
  )
}