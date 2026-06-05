"use client"

import { ArrowUpRight } from "lucide-react"

const services = [
  {
    num: "01",
    name: "Starter",
    description: "Landing page soignée, responsive, prête à convertir. Idéal pour un lancement rapide ou une présence en ligne professionnelle.",
    scope: ["1 à 3 pages", "Design responsive", "Formulaire de contact", "SEO de base", "Déploiement inclus"],
  },
  {
    num: "02",
    name: "Business",
    description: "Site complet avec animations, back-office et analytics. Pour les entreprises qui veulent se démarquer sérieusement.",
    scope: ["Jusqu'à 8 pages", "Animations Framer Motion", "CMS ou back-office", "SEO avancé", "Formulaires avancés"],
  },
  {
    num: "03",
    name: "E-commerce",
    description: "Boutique ou SaaS avec paiements, authentification et dashboard admin. Une solution full-stack clé en main.",
    scope: ["Stripe intégré", "Auth utilisateurs", "Dashboard admin", "Firebase backend", "Emails automatisés"],
  },
  {
    num: "04",
    name: "Premium",
    description: "Architecture complexe, app mobile, rôles et permissions. Pour les projets ambitieux qui demandent une expertise complète.",
    scope: ["Full-stack sur mesure", "Rôles & permissions", "App mobile incluse", "Intégrations API", "3 mois maintenance"],
  },
]

export default function Pricing() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="tarifs" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-5 border-b border-neutral-100 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Formules
        </span>
        <span className="text-xs font-mono text-neutral-300">
          Prix sur devis
        </span>
      </div>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-6 py-10 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 leading-snug max-w-lg">
          Chaque projet est unique.<br />
          <span className="text-neutral-400">Chaque devis aussi.</span>
        </p>
        <button
          onClick={scrollToContact}
          className="inline-flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-colors self-start sm:self-auto shrink-0"
        >
          Demander un devis
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-neutral-100">
          {services.map((s) => (
            <div
              key={s.num}
              className="group p-7 flex flex-col gap-5 hover:bg-neutral-50 transition-colors duration-150 relative overflow-hidden"
            >
              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-neutral-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />

              {/* Num + name */}
              <div>
                <span className="text-xs font-mono text-neutral-300 block mb-2">
                  {s.num}
                </span>
                <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
                  {s.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-400 leading-relaxed flex-1">
                {s.description}
              </p>

              {/* Scope */}
              <ul className="flex flex-col gap-1.5">
                {s.scope.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-neutral-300 shrink-0" />
                    <span className="text-xs text-neutral-400">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={scrollToContact}
                className="flex items-center justify-between w-full text-xs font-medium text-neutral-500 border border-neutral-200 px-3.5 py-2 rounded-md hover:border-neutral-400 hover:text-neutral-900 transition-all duration-150 group/btn mt-auto"
              >
                Obtenir un devis
                <ArrowUpRight
                  size={12}
                  className="text-neutral-300 group-hover/btn:text-neutral-700 transition-colors"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-6xl mx-auto px-6 py-4 border-t border-neutral-100">
        <p className="text-xs text-neutral-400 leading-relaxed">
          Tous les projets font l'objet d'un devis personnalisé gratuit.
          Les formules ci-dessus reflètent la portée habituelle de chaque type de mission —
          le tarif final dépend de vos besoins spécifiques, délais et fonctionnalités.
          <span className="text-neutral-600 font-medium"> Réponse sous 24h.</span>
        </p>
      </div>
    </section>
  )
}