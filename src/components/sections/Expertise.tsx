import { Monitor, Server, Cpu, Smartphone } from "lucide-react"
import { type ElementType } from "react"

const services: {
  num: string
  icon: ElementType
  title: string
  description: string
  tags: string[]
}[] = [
  {
    num: "01",
    icon: Monitor,
    title: "Développement frontend",
    description:
      "Interfaces modernes, performantes et animées — de la landing page au SaaS complet, avec une attention particulière au design et à l'UX.",
    tags: ["React", "Next.js", "Tailwind", "Framer Motion"],
  },
  {
    num: "02",
    icon: Server,
    title: "Backend & base de données",
    description:
      "Architecture serverless, authentification, stockage et paiements en ligne. Solutions scalables adaptées à chaque projet.",
    tags: ["Firebase", "Node.js", "Flask", "Stripe"],
  },
  {
    num: "03",
    icon: Cpu,
    title: "Technicien IT",
    description:
      "Maintenance, déploiement, configuration réseau et support technique. Une approche pragmatique pour garder votre infrastructure opérationnelle.",
    tags: ["Réseaux", "Matériel", "Linux", "Support"],
  },
  {
    num: "04",
    icon: Smartphone,
    title: "Applications mobile",
    description:
      "Applications cross-platform avec une expérience native. Du prototype au déploiement sur les stores, un accompagnement complet.",
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
]

export default function Expertise() {
  return (
    <section id="expertise" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-5 border-b border-neutral-100 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Expertise
        </span>
        <span className="text-xs font-mono text-neutral-300">
          04 services
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-neutral-100">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.num}
                className="relative p-7 hover:bg-neutral-50 transition-colors duration-150 group overflow-hidden"
              >
                {/* top accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-neutral-900" />

                <span className="text-xs font-mono text-neutral-300 mb-5 block">
                  {s.num}
                </span>

                <Icon
                  size={20}
                  className="text-neutral-400 mb-4"
                  strokeWidth={1.5}
                />

                <h3 className="text-sm font-semibold text-neutral-900 mb-2.5 tracking-tight leading-snug">
                  {s.title}
                </h3>

                <p className="text-sm text-neutral-400 leading-relaxed mb-5">
                  {s.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-neutral-400 bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded-sm"
                    >
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