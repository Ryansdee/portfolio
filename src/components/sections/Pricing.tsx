"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    id: "starter",
    label: "Formule 01",
    name: "Starter",
    price: "€300",
    from: "Prix fixe",
    features: [
      "Landing page 1–3 pages",
      "Design responsive mobile",
      "Formulaire de contact",
      "SEO de base",
      "Déploiement inclus",
    ],
    featured: false,
  },
  {
    id: "business",
    label: "Formule 02",
    name: "Business",
    price: "€600",
    from: "À partir de",
    badge: "Populaire",
    features: [
      "Jusqu'à 8 pages",
      "Animations Framer Motion",
      "CMS ou back-office",
      "Analytics & SEO avancé",
      "Formulaires avancés",
    ],
    featured: true,
  },
  {
    id: "ecommerce",
    label: "Formule 03",
    name: "E-commerce",
    price: "€750",
    from: "À partir de",
    features: [
      "Intégration Stripe complète",
      "Authentification utilisateurs",
      "Dashboard admin",
      "Firebase backend",
      "Emails automatisés",
    ],
    featured: false,
  },
  {
    id: "premium",
    label: "Formule 04",
    name: "Premium",
    price: "€1200",
    from: "À partir de",
    features: [
      "Architecture full-stack",
      "Rôles & permissions",
      "App mobile incluse",
      "Intégrations API tierces",
      "3 mois maintenance offerts",
    ],
    featured: false,
  },
]

interface PricingProps {
  onSelectPlan?: (planName: string) => void
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="tarifs" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Tarifs & Formules
        </span>
        <span className="text-xs text-neutral-400">
          Devis personnalisé gratuit sous 24h
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-neutral-100">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "p-7 flex flex-col transition-colors duration-150",
                plan.featured
                  ? "bg-neutral-900 hover:bg-neutral-800"
                  : "hover:bg-neutral-50"
              )}
            >
              {/* Label + badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    plan.featured ? "text-neutral-500" : "text-neutral-300"
                  )}
                >
                  {plan.label}
                </span>
                {plan.badge && (
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded",
                      plan.featured
                        ? "bg-white/10 text-neutral-400"
                        : "bg-neutral-100 text-neutral-500"
                    )}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Name */}
              <h3
                className={cn(
                  "text-base font-semibold tracking-tight mb-4",
                  plan.featured ? "text-white" : "text-neutral-900"
                )}
              >
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-1">
                <span
                  className={cn(
                    "text-3xl font-semibold tracking-tight",
                    plan.featured ? "text-white" : "text-neutral-900"
                  )}
                >
                  {plan.price}
                </span>
              </div>
              <span
                className={cn(
                  "text-xs mb-6",
                  plan.featured ? "text-neutral-500" : "text-neutral-400"
                )}
              >
                {plan.from}
              </span>

              {/* Features */}
              <ul className="flex-1 flex flex-col gap-2.5 mb-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-start gap-2 text-sm",
                      plan.featured ? "text-neutral-400" : "text-neutral-500"
                    )}
                  >
                    <Check
                      size={13}
                      className={cn(
                        "mt-0.5 shrink-0",
                        plan.featured ? "text-neutral-500" : "text-neutral-300"
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => onSelectPlan?.(plan.name)}
                className={cn(
                  "w-full text-sm font-medium py-2.5 rounded-md border transition-all duration-150",
                  plan.featured
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900"
                )}
              >
                Demander un devis
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}