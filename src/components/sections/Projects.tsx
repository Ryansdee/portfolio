"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

type Project = {
  title: string
  discipline: string
  description: string
  image: string
  url: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: "Vits Architecture",
    discipline: "Architecture",
    description:
      "Site vitrine pour un cabinet d'architecture belge, pensé pour laisser les projets bâtis occuper toute la place.",
    image: "/projects/vits.png",
    url: "https://vits-architecture.netlify.app/",
    tags: ["HTML", "Tailwind"],
  },
  {
    title: "Vadim Thevelin",
    discipline: "Photographie",
    description:
      "Portfolio d'un photographe bruxellois, avec un portail client pour livrer et gérer les galeries.",
    image: "/projects/vadim.png",
    url: "https://vadimthevelin.com/",
    tags: ["Next.js", "Firebase"],
  },
  {
    title: "Woppy",
    discipline: "Plateforme",
    description:
      "Marketplace de jobs étudiants : géolocalisation des offres, paiements et notifications en temps réel.",
    image: "/projects/woppy.png",
    url: "https://woppy.netlify.app/",
    tags: ["Next.js", "Stripe", "Leaflet"],
  },
  {
    title: "Palki",
    discipline: "Institut de beauté",
    description:
      "Site et prise de rendez-vous en ligne pour un institut de beauté à Ixelles.",
    image: "/projects/palki.png",
    url: "https://palki.netlify.app/",
    tags: ["Next.js", "Tailwind"],
  },
]

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion()
  const flip = index % 2 === 1

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 items-center">
      {/* Image */}
      <motion.div
        initial={reduce ? false : { clipPath: "inset(0 0 100% 0)", opacity: 0.6 }}
        whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={`lg:col-span-7 ${flip ? "lg:order-2" : "lg:order-1"}`}
      >
        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100 outline-none ring-neutral-900/60 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FBFAF8]"
        >
          <Image
            src={project.image}
            alt={`Aperçu du site ${project.title}`}
            loading="eager"
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-500 group-hover:bg-neutral-900/[0.06]" />
        </Link>
      </motion.div>

      {/* Texte */}
      <div className={`lg:col-span-5 ${flip ? "lg:order-1" : "lg:order-2"}`}>
        <p className="text-[13px] text-neutral-500 mb-3">{project.discipline}</p>

        <h3 className="font-serif text-[28px] sm:text-[32px] leading-tight text-neutral-900 mb-4">
          <Link
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none decoration-neutral-300 underline-offset-[6px] hover:underline focus-visible:underline"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[46ch] mb-6">
          {project.description}
        </p>

        <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-neutral-400 mb-6">
          {project.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-x-2.5">
              {i > 0 && <span className="text-neutral-300">/</span>}
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
        >
          Voir le site
        </Link>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projets" className="bg-[#FBFAF8] border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <header className="max-w-2xl mb-16 sm:mb-24">
          <h2 className="font-serif text-[40px] sm:text-[52px] leading-none tracking-tight text-neutral-900 mb-5">
            Projets
          </h2>
          <p className="text-[16px] leading-relaxed text-neutral-600">
            Quatre réalisations menées de la conception au déploiement, pour des
            clients en Belgique.
          </p>
        </header>

        {/* Lignes */}
        <div className="space-y-24 sm:space-y-32">
          {projects.map((project, index) => (
            <ProjectRow key={project.url} project={project} index={index} />
          ))}
        </div>

        {/* Pied — appel à l'action */}
        <div className="mt-24 sm:mt-32 pt-10 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[15px] text-neutral-500 mb-1">Un projet en tête ?</p>
            <p className="font-serif text-[24px] text-neutral-900 leading-snug">
              Parlons-en.
            </p>
          </div>
          <Link
            href="#contact"
            className="inline-block text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
          >
            Démarrer un projet
          </Link>
        </div>
      </div>
    </section>
  )
}