"use client"
import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"

const projects = [
  { num: "01", title: "Portfolio Personnel", description: "Portfolio responsive avec animations Framer Motion.", image: "/projects/ryansdee.png", url: "https://ryansdee.netlify.app/", tags: ["Next.js", "Tailwind", "Framer"] },
  { num: "02", title: "Clubtwee", description: "Site vitrine pour un café local — identité soignée.", image: "/projects/clubtwee.png", url: "https://clubtwee.netlify.app/", tags: ["HTML", "Tailwind"] },
  { num: "03", title: "Vits Architecture", description: "Landing page pour un cabinet d'architecture belge.", image: "/projects/vits.png", url: "https://vits-architecture.netlify.app/", tags: ["HTML", "Tailwind"] },
  { num: "04", title: "Garage Laurent", description: "Site avec backend PHP pour un garage automobile.", image: "/projects/garage.png", url: "https://garagelaurent.be/", tags: ["PHP", "Tailwind"] },
  { num: "05", title: "SubTrack", description: "Suivi et optimisation d'abonnements en ligne.", image: "/projects/subtrack.png", url: "https://tracksub.netlify.app/", tags: ["Next.js", "Firebase"] },
  { num: "06", title: "Books & Bites", description: "Plateforme collaborative de critiques littéraires.", image: "/projects/booksandbites.png", url: "https://books-and-bites.netlify.app/", tags: ["Next.js", "Firebase"] },
  { num: "07", title: "Vadim Thevelin", description: "Portfolio photographique immersif avec portail client.", image: "/projects/vadim.png", url: "https://vath-portofolio.netlify.app/", tags: ["Next.js", "Firebase"] },
  { num: "08", title: "Woppy", description: "Marketplace emplois étudiants — géoloc, paiements, notifs.", image: "/projects/woppy.png", url: "https://woppy.netlify.app/", tags: ["Next.js", "Stripe", "Leaflet"] },
  { num: "09", title: "Le Brouillon", description: "Plateforme éditoriale pour une écrivaine belge.", image: "/projects/lebrouillon.png", url: "https://le-brouillon.netlify.app/", tags: ["Next.js", "Firebase"] },
]

function ProjectCard({ project }: { project: typeof projects[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    card.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = "rotateX(4deg) rotateY(-4deg) scale(0.97)"
  }

  return (
    <div
      className="[perspective:900px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={project.url} target="_blank" rel="noopener noreferrer">
        <div
          ref={cardRef}
          className="relative rounded-[14px] overflow-hidden cursor-pointer [transform-style:preserve-3d] [transform:rotateX(4deg)_rotateY(-4deg)_scale(0.97)] transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(.23,1,.32,1)] bg-neutral-900 aspect-[4/3] group hover:[box-shadow:0_24px_60px_rgba(0,0,0,.22),0_4px_12px_rgba(0,0,0,.12)]"
        >
          {/* Image */}
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-[transform,filter] duration-500 ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.04] group-hover:brightness-[0.45]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

          {/* Shine */}
          <div className="absolute inset-0 rounded-[14px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,.06),transparent_60%)] pointer-events-none" />

          {/* Arrow */}
          <div className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-white text-[13px]">
            ↗
          </div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-[18px] translate-y-1 group-hover:translate-y-0 transition-transform duration-[350ms] ease-[cubic-bezier(.23,1,.32,1)]">
            <p className="text-[10px] font-mono text-white/45 tracking-[.12em] mb-1">{project.num}</p>
            <p className="font-serif text-[17px] font-normal text-white leading-tight mb-1.5">{project.title}</p>
            <p className="text-[11px] text-white/60 leading-relaxed max-h-0 overflow-hidden opacity-0 group-hover:max-h-16 group-hover:opacity-100 transition-all duration-300">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-2.5 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-[50ms]">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[9px] tracking-[.08em] uppercase text-white/70 border border-white/25 px-[7px] py-[3px] rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projets" className="border-b border-neutral-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between pb-8 border-b border-neutral-100 mb-10">
          <div>
            <p className="text-[10px] tracking-[.16em] uppercase text-neutral-400 font-medium mb-1.5">
              Travaux sélectionnés
            </p>
            <h2 className="font-serif text-[32px] font-normal tracking-tight text-neutral-900 leading-none">
              Projets
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-neutral-400 tabular-nums">2022 — 2026</p>
            <p className="text-[11px] text-neutral-400 tabular-nums mt-0.5">09 références</p>
          </div>
        </div>

        {/* Grid 3D */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => <ProjectCard key={p.num} project={p} />)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-7 mt-10 border-t border-neutral-100">
          <span className="text-[10px] tracking-[.14em] uppercase text-neutral-400">
            Belgique · Disponible
          </span>
          <span className="font-serif text-[13px] italic text-neutral-500">
            Chaque projet, une intention.
          </span>
        </div>
      </div>
    </section>
  )
}