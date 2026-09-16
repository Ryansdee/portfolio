import { Monitor, Server, Cpu, Smartphone } from "lucide-react"
import { type ElementType } from "react"

type Service = {
  icon: ElementType
  title: string
  description: string
  tags: string[]
}

const services: Service[] = [
  {
    icon: Monitor,
    title: "Développement frontend",
    description:
      "Interfaces modernes, performantes et animées — de la landing page au SaaS complet, avec une attention particulière au design et à l'UX.",
    tags: ["React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    icon: Server,
    title: "Backend & base de données",
    description:
      "Architecture serverless, authentification, stockage et paiements en ligne. Des solutions qui montent en charge, adaptées à chaque projet.",
    tags: ["Firebase", "Node.js", "Flask", "Stripe"],
  },
  {
    icon: Cpu,
    title: "Technicien IT",
    description:
      "Maintenance, déploiement, configuration réseau et support technique. Une approche pragmatique pour garder votre infrastructure opérationnelle.",
    tags: ["Réseaux", "Matériel", "Linux", "Support"],
  },
  {
    icon: Smartphone,
    title: "Applications mobile",
    description:
      "Applications cross-platform avec une expérience native. Du prototype au déploiement sur les stores, un accompagnement complet.",
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
]

export default function Expertise() {
  return (
    <section id="expertise" className="bg-[#FBFAF8] border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <header className="max-w-2xl mb-16 sm:mb-20">
          <h2 className="font-serif text-[40px] sm:text-[52px] leading-none tracking-tight text-neutral-900 mb-5">
            Expertise
          </h2>
          <p className="text-[16px] leading-relaxed text-neutral-600">
            Du frontend au support technique, un même interlocuteur pour concevoir,
            construire et maintenir vos projets.
          </p>
        </header>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="p-8 sm:p-10 border-t border-neutral-200 sm:odd:border-r sm:odd:border-neutral-200"
              >
                <Icon size={22} strokeWidth={1.5} className="text-neutral-400 mb-6" />

                <h3 className="font-serif text-[22px] leading-tight text-neutral-900 mb-3">
                  {s.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[44ch] mb-6">
                  {s.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-neutral-400">
                  {s.tags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-x-2.5">
                      {i > 0 && <span className="text-neutral-300">/</span>}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}