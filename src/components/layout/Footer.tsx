import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const links = [
  { label: "Expertise", href: "#expertise" },
  { label: "Projets", href: "#projets" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "Contact", href: "#contact" },
]

const socials = [
  { label: "GitHub", href: "https://github.com/ryansdee" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/" },
]

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Main row */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-neutral-100">

          {/* Identité */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900 tracking-tight">
                Ryan Deschuyteneer
              </span>
              <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
                DEV
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-[200px]">
              Développeur Web & IT freelance basé en Belgique.
            </p>
            <span className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              Disponible pour de nouveaux projets
            </span>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1">
              Navigation
            </span>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact + socials */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1">
              Liens
            </span>
            {socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 w-fit"
              >
                {s.label}
                <ArrowUpRight
                  size={11}
                  className="text-neutral-300 group-hover:text-neutral-700 transition-colors"
                />
              </a>
            ))}
            <Link
              href="#contact"
              className="group inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-150 w-fit mt-1"
            >
              Me contacter
              <ArrowUpRight
                size={11}
                className="text-neutral-300 group-hover:text-neutral-700 transition-colors"
              />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-400">
            © 2022 – 2026 Ryan Deschuyteneer · Belgique
          </span>
          <span className="text-[11px] font-mono text-neutral-300">
            Next.js · Firebase · Tailwind
          </span>
        </div>

      </div>
    </footer>
  )
}