"use client"

import { useState } from "react"
import Image from "next/image"

type Project = {
  slug: string
  title: string
  client: string
  year: string
  status?: string
  description: string
  stack: string[]
  image: string
  url: string
}

const projects: Project[] = [
  {
    slug: "palki",
    title: "Palki",
    client: "Institut de beauté, Ixelles",
    year: "2026",
    status: "Livré",
    description:
      "Site complet avec prise de rendez-vous par soin. La gérante modifie elle-même ses disponibilités semaine par semaine, ses tarifs et ses promotions, sans passer par moi.",
    stack: ["Next.js", "Firebase", "Tailwind"],
    image: "/projects/palki.png",
    url: "https://palki.netlify.app/",
  },
  {
    slug: "woppy",
    title: "Woppy",
    client: "Plateforme de jobs étudiants",
    year: "2025",
    description:
      "Marketplace qui met en relation étudiants et recruteurs : offres géolocalisées, paiements en ligne et notifications en temps réel.",
    stack: ["Next.js", "Firebase", "Stripe", "Leaflet"],
    image: "/projects/woppy.png",
    url: "https://woppy.netlify.app/",
  },
  {
    slug: "vadim",
    title: "Vadim Thevelin",
    client: "Photographe, Bruxelles",
    year: "2025",
    description:
      "Portfolio photo avec un espace client privé pour livrer les galeries et gérer les commandes.",
    stack: ["Next.js", "Firebase"],
    image: "/projects/vadim.png",
    url: "https://vadimthevelin.com/",
  },
  {
    slug: "vits",
    title: "Vits Architecture",
    client: "Cabinet d'architecture",
    year: "2025",
    description:
      "Site vitrine sobre qui laisse toute la place aux projets bâtis du cabinet.",
    stack: ["HTML", "Tailwind"],
    image: "/projects/vits.png",
    url: "https://vits-architecture.netlify.app/",
  },
]

export default function Projects() {
  const [active, setActive] = useState(projects[0].slug)
  const current = projects.find((p) => p.slug === active) ?? projects[0]

  return (
    <section id="projets" className="border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6">
        <header className="flex items-baseline justify-between gap-6 mb-12">
          <h2 className="font-serif text-[34px] sm:text-[42px] leading-none tracking-tight text-neutral-900">
            Projets
          </h2>
          <p className="text-[14px] text-neutral-500">Sélection, 2025 – 2026</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Liste */}
          <ol className="lg:col-span-7 border-t border-neutral-200">
            {projects.map((p) => (
              <li
                key={p.slug}
                onMouseEnter={() => setActive(p.slug)}
                onFocus={() => setActive(p.slug)}
                className="border-b border-neutral-200"
              >
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-7 outline-none"
                >
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-serif text-[26px] leading-tight text-neutral-900 group-hover:text-neutral-500 group-focus-visible:underline transition-colors">
                      {p.title}
                    </h3>
                    <span className="text-[13px] text-neutral-500 tabular-nums shrink-0">
                      {p.year}
                    </span>
                  </div>

                  <p className="text-[14px] text-neutral-500 mb-3">
                    {p.client}
                    {p.status && (
                      <>
                        <span className="mx-2 text-neutral-300">·</span>
                        <span className="text-emerald-700">{p.status}</span>
                      </>
                    )}
                  </p>

                  <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[52ch] mb-4">
                    {p.description}
                  </p>

                  {/* Aperçu mobile */}
                  <div className="lg:hidden relative aspect-[16/10] mb-4 overflow-hidden rounded-md bg-neutral-100">
                    <Image
                      src={p.image}
                      alt={`Aperçu du site ${p.title}`}
                      fill
                      sizes="100vw"
                      className="object-cover object-top"
                    />
                  </div>

                  <p className="text-[13px] text-neutral-400">{p.stack.join(" / ")}</p>
                </a>
              </li>
            ))}
          </ol>

          {/* Aperçu desktop */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-neutral-100 border border-neutral-200">
                {projects.map((p) => (
                  <Image
                    key={p.slug}
                    src={p.image}
                    alt={`Aperçu du site ${p.title}`}
                    fill
                    sizes="40vw"
                    className={`object-cover object-top transition-opacity duration-300 ${
                      p.slug === current.slug ? "opacity-100" : "opacity-0"
                    }`}
                  />
                ))}
              </div>
              <a
                href={current.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition-colors"
              >
                Voir le site de {current.title}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}