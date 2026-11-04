"use client"

type Service = {
  name: string
  description: string
  scope: string[]
}

const services: Service[] = [
  {
    name: "Starter",
    description:
      "Landing page soignée et responsive, prête à convertir. Idéale pour un lancement rapide ou une première présence en ligne.",
    scope: ["1 à 3 pages", "Design responsive", "Formulaire de contact", "SEO de base", "Déploiement inclus"],
  },
  {
    name: "Business",
    description:
      "Site complet avec animations, back-office et analytics. Pour les entreprises qui veulent se démarquer sérieusement.",
    scope: ["Jusqu'à 8 pages", "Animations Framer Motion", "CMS ou back-office", "SEO avancé", "Formulaires avancés"],
  },
  {
    name: "E-commerce",
    description:
      "Boutique ou SaaS avec paiements, authentification et tableau de bord admin. Une solution full-stack clé en main.",
    scope: ["Stripe intégré", "Comptes utilisateurs", "Tableau de bord admin", "Backend Firebase", "Emails automatisés"],
  },
  {
    name: "Premium",
    description:
      "Architecture complexe, application mobile, rôles et permissions. Pour les projets ambitieux qui demandent une expertise complète.",
    scope: ["Full-stack sur mesure", "Rôles & permissions", "App mobile incluse", "Intégrations API", "3 mois de maintenance"],
  },
]

export default function Pricing() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="tarifs" className="bg-[#FBFAF8] border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <header className="max-w-2xl mb-16 sm:mb-24">
          <h2 className="font-serif text-[40px] sm:text-[52px] leading-none tracking-tight text-neutral-900 mb-5">
            Formules
          </h2>
          <p className="text-[16px] leading-relaxed text-neutral-600">
            Chaque projet est unique, chaque devis aussi. Les formules ci-dessous
            donnent la portée habituelle de chaque type de mission — le tarif final
            dépend de vos besoins, délais et fonctionnalités.
          </p>
        </header>

        {/* Formules en lignes */}
        <div>
          {services.map((s) => (
            <article
              key={s.name}
              className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6 items-start border-t border-neutral-200 py-10 sm:py-12"
            >
              {/* Nom + description + CTA */}
              <div className="lg:col-span-4">
                <h3 className="font-serif text-[26px] sm:text-[28px] leading-tight text-neutral-900 mb-3">
                  {s.name}
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[42ch] mb-5">
                  {s.description}
                </p>
                <button
                  onClick={scrollToContact}
                  className="inline-block text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
                >
                  Obtenir un devis
                </button>
              </div>

              {/* Contenu de la formule */}
              <div className="lg:col-span-7 lg:col-start-6">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                  {s.scope.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-[14px] text-neutral-600"
                    >
                      <span className="w-1 h-1 rounded-full bg-neutral-400 shrink-0 translate-y-[-2px]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Pied — appel à l'action */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="text-[15px] text-neutral-500 mb-1">
              Devis personnalisé et gratuit — réponse sous 24 h.
            </p>
            <p className="font-serif text-[24px] text-neutral-900 leading-snug">
              Chiffrons votre projet.
            </p>
          </div>
          <button
            onClick={scrollToContact}
            className="inline-block text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500 self-start sm:self-auto"
          >
            Demander un devis
          </button>
        </div>
      </div>
    </section>
  )
}