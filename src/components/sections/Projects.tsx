"use client"
import Link from "next/link"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { useState } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    num: "01",
    title: "Portfolio Personnel",
    description: "Portfolio personnel responsive présentant mes projets, réalisé avec HTML, Tailwind CSS et JavaScript.",
    image: "/projects/ryansdee.png",
    url: "https://ryansdee.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    num: "02",
    title: "Clubtwee",
    description: "Site vitrine réalisé dans le cadre d’un projet d’entraînement pour un café local.",
    image: "/projects/clubtwee.png",
    url: "https://clubtwee.netlify.app/",
    tags: ["html", "Tailwind CSS", "Framer Motion"]
  },
  {
    num: "03",
    title: "Vits Architecture",
    description: "Landing page moderne et performante conçue pour le cabinet Vits Architecture.",
    image: "/projects/vits.png",
    url: "https://vits-architecture.netlify.app/",
    tags: ["html", "Tailwind CSS", "Framer Motion"]
  },
  {
    num: "04",
    title: "Garage Laurent",
    description: "Site vitrine optimisé pour la visibilité en ligne d’un garage automobile.",
    image: "/projects/garage.png",
    url: "https://garagelaurent.be/",
    tags: ["Php", "Tailwind CSS"]
  },
  {
    num: "05",
    title: "SubTrack",
    description: "Application web permettant de suivre, comparer et optimiser ses abonnements en ligne.",
    image: "/projects/subtrack.png",
    url: "https://tracksub.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase"]
  },
  {
    num: "06",
    title: "Books & Bites",
    description: "Plateforme collaborative de critiques littéraires et culinaires créée pour un groupe d’amies.",
    image: "/projects/booksandbites.png",
    url: "https://books-and-bites.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase"]
  },
  {
    num: "07",
    title: "Vadim Thevelin Portfolio",
    description: "Portfolio immersif mettant en valeur le travail photographique de Vadim Thevelin.",
    image: "/projects/vadim.png",
    url: "https://vath-portofolio.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"]
  },
  {
    num: "08",
    title: "Woppy",
    description: "Plateforme de mise en relation entre étudiants et recruteurs pour des emplois flexibles et locaux.",
    image: "/projects/woppy.png",
    url: "https://woppy.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase", "nodemailer", "Stripe", "Leaflet"]
  },
  {
    num: "09",
    title: "Le Brouillon",
    description: "Plateforme dédiée à une écrivaine pour publier des œuvres et partager des conseils d’écriture.",
    image: "/projects/lebrouillon.png",
    url: "https://le-brouillon.netlify.app/",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion", "Firebase"]
  },
]

export default function Projects() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section id="projets" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Projets sélectionnés
        </span>
        <span className="text-xs text-neutral-300">{projects.length} projets</span>
      </div>

      {/* Layout : liste + aperçu image */}
      <div className="max-w-6xl mx-auto px-6 flex gap-0">

        {/* Liste */}
        <div className="flex-1">
          {projects.map((project) => (
            <Link
              key={project.num}
              href={project.url}
              onMouseEnter={() => setHovered(project.num)}
              onMouseLeave={() => setHovered(null)}
              className="group flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 -mx-6 px-6 transition-colors duration-150"
            >
              {/* Numéro */}
              <span className="w-8 text-xs font-mono text-neutral-300 shrink-0">
                {project.num}
              </span>

              {/* Titre + desc */}
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-neutral-900 tracking-tight">
                  {project.title}
                </span>
                <span className="text-sm text-neutral-400 ml-3">
                  {project.description}
                </span>
              </div>

              {/* Tags */}
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-neutral-400 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow */}
              <ArrowUpRight
                size={15}
                className="text-neutral-300 group-hover:text-neutral-600 shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>

        {/* Aperçu image — sticky à droite */}
        <div className="hidden lg:flex w-72 shrink-0 items-start justify-end pl-8 py-4">
          <div className="sticky top-20 w-full">
            <div className="w-full aspect-video rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 relative">
              {hovered ? (
                (() => {
                  const project = projects.find((p) => p.num === hovered)
                  return project?.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-opacity duration-200"
                      sizes="280px"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <ImageOff size={20} className="text-neutral-300" />
                      <span className="text-xs text-neutral-300">
                        Pas d'aperçu
                      </span>
                    </div>
                  )
                })()
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <span className="text-xs text-neutral-300">
                    Survolez un projet
                  </span>
                </div>
              )}
            </div>

            {/* Infos du projet survolé */}
            {hovered && (
              <div className="mt-3 px-1">
                <p className="text-sm font-medium text-neutral-900 tracking-tight">
                  {projects.find((p) => p.num === hovered)?.title}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {projects.find((p) => p.num === hovered)?.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}