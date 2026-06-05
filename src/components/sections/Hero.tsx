import Link from "next/link"
import { MapPin } from "lucide-react"

const stats = [
  { label: "Statut", value: "Disponible", green: true },
  { label: "Localisation", value: "Belgique" },
  { label: "Expérience", value: "4+ ans · Freelance" },
  { label: "Stack principal", value: "Next.js · Firebase · Tailwind", mono: true },
  { label: "Projets livrés", value: "12+" },
  { label: "Délai de réponse", value: "Sous 72h" },
]

const pills = [
  "TypeScript", "React", "Next.js", "Tailwind CSS",
  "Firebase", "Stripe", "Framer Motion", "React Native",
  "Nodemailer", "Linux",
]

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function Hero() {
  return (
    <>
      <section className="pt-14 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 text-xs text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-full">
                <MapPin size={11} />
                Développeur Web &amp; IT · Belgique
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900 leading-[1.08] mb-4">
              Interfaces robustes.
              <br />
              <span className="text-neutral-400">Solutions durables.</span>
            </h1>

            <p className="text-base text-neutral-500 leading-relaxed max-w-md mb-8">
              Je conçois et développe des applications web full-stack pour des
              clients en Belgique et à distance — du site vitrine au SaaS
              complet.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="#projets"
                className="text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-colors"
              >
                Voir les projets
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-neutral-700 bg-white border border-neutral-200 px-5 py-2.5 rounded-md hover:border-neutral-400 transition-colors"
              >
                Me contacter
              </Link>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-5 py-3.5 border-b border-neutral-100 last:border-0"
              >
                <span className="text-sm text-neutral-400">{stat.label}</span>

                {stat.green ? (
                  <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    {stat.value}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      stat.mono && "font-mono text-xs text-neutral-500 font-normal"
                    )}
                  >
                    {stat.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mr-2">
            Stack
          </span>
          {pills.map((pill) => (
            <span
              key={pill}
              className="text-xs text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}