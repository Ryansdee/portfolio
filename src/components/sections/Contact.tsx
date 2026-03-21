"use client"

import { useState } from "react"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  "Starter — €300",
  "Business — à partir de €600",
  "E-commerce — à partir de €750",
  "Premium — à partir de €1200",
  "Support IT",
  "Autre",
]

const budgets = [
  "300€ – 500€",
  "500€ – 800€",
  "800€ – 1200€",
  "1200€+",
  "À définir ensemble",
]

interface ContactProps {
  defaultPlan?: string
}

export default function Contact({ defaultPlan = "" }: ContactProps) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    plan: defaultPlan,
    budget: "",
    description: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()
      setStatus("success")
      setForm({ firstName: "", lastName: "", email: "", plan: "", budget: "", description: "" })
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-neutral-100">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Contact
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">

          {/* Gauche — infos */}
          <div className="py-12 lg:pr-12">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-3">
              Un projet en tête ?
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mb-10">
              Disponible pour des missions freelance, du développement web et du
              support IT en Belgique. Je réponds sous 24h avec une estimation
              personnalisée.
            </p>

            <div className="flex flex-col gap-0 mb-8">
              {[
                { label: "Localisation", value: "Belgique" },
                { label: "Disponibilité", value: "● Immédiate", green: true },
                { label: "Type de mission", value: "Freelance · Remote · On-site" },
                { label: "Réponse garantie", value: "Sous 24h" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-3 border-b border-neutral-100 first:border-t"
                >
                  <span className="text-sm text-neutral-400">{item.label}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    item.green ? "text-green-600" : "text-neutral-700"
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <a
                href="https://github.com/ryansdee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 border border-neutral-200 px-4 py-2 rounded-md hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 border border-neutral-200 px-4 py-2 rounded-md hover:border-neutral-400 hover:text-neutral-900 transition-all"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          {/* Droite — formulaire */}
          <div className="py-12 lg:pl-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
                Portail client — Demande de devis
              </span>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <CheckCircle size={36} className="text-green-500" />
                <div>
                  <p className="text-base font-semibold text-neutral-900 mb-1">
                    Demande envoyée !
                  </p>
                  <p className="text-sm text-neutral-400">
                    Je vous recontacte sous 24h avec une estimation personnalisée.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-sm text-neutral-400 hover:text-neutral-700 underline underline-offset-4 mt-2"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Prénom + Nom */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Prénom
                    </label>
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Jean"
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                      Nom
                    </label>
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Dupont"
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="jean@entreprise.com"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>

                {/* Formule */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Formule choisie
                  </label>
                  <select
                    name="plan"
                    value={form.plan}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionner une formule</option>
                    {plans.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Sélectionner un budget</option>
                    {budgets.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    Description du projet
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Décrivez votre projet en détail — fonctionnalités, public cible, délai souhaité…"
                    className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3 py-2.5 rounded-md outline-none focus:border-neutral-400 transition-colors resize-none"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 px-3 py-2.5 rounded-md">
                    <AlertCircle size={14} />
                    Une erreur est survenue. Réessayez ou contactez-moi directement.
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-neutral-900 text-white py-2.5 rounded-md hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}