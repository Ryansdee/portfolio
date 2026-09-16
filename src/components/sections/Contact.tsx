"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, ChevronDown } from "lucide-react"

const services = [
  "Site vitrine / Landing page",
  "Site business multi-pages",
  "E-commerce / SaaS",
  "Application full-stack",
  "Application mobile",
  "Support IT",
  "Autre",
]

const inputClass =
  "w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 text-[15px] px-4 py-2.5 rounded-lg outline-none transition-colors focus:border-neutral-900"

const labelClass = "text-[13px] text-neutral-600"

// ─── Retrouver le portail ─────────────────────────────────────────────────────

function PortalFinder() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "notfound" | "error">("idle")

  const handleFind = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus("loading")
    try {
      const res = await fetch("/api/client/resend-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      if (res.status === 404) { setStatus("notfound"); return }
      if (!res.ok) throw new Error()
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="border-t border-neutral-200 pt-8 mt-10">
      <p className="text-[15px] font-medium text-neutral-900 mb-1">Retrouver mon espace client</p>
      <p className="text-[13px] text-neutral-500 mb-4">
        On vous renvoie votre lien d'accès personnel par email.
      </p>

      {status === "sent" ? (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3.5">
          <CheckCircle size={15} className="text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[14px] font-medium text-emerald-900 mb-0.5">Lien envoyé</p>
            <p className="text-[13px] text-emerald-700 leading-relaxed">
              Vérifiez votre boîte mail, votre lien d'accès vient d'être renvoyé.
            </p>
            <button
              onClick={() => { setStatus("idle"); setEmail("") }}
              className="text-[13px] text-emerald-700 underline underline-offset-4 mt-2 hover:text-emerald-900 transition-colors"
            >
              Utiliser un autre email
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFind} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle") }}
              placeholder="votre@email.com"
              required
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="flex items-center justify-center gap-2 text-[14px] font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-lg transition-colors hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBFAF8]"
            >
              {status === "loading" && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Recevoir le lien
            </button>
          </div>

          {status === "notfound" && (
            <div className="flex items-center gap-2 text-[13px] text-amber-800 bg-amber-50 border border-amber-100 px-3.5 py-2.5 rounded-lg">
              <AlertCircle size={13} className="shrink-0" />
              Aucune demande n'est associée à cet email.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-[13px] text-red-700 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
              <AlertCircle size={13} className="shrink-0" />
              Une erreur est survenue. Réessayez dans quelques instants.
            </div>
          )}
        </form>
      )}
    </div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", service: "", description: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

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
      setForm({ firstName: "", lastName: "", email: "", service: "", description: "" })
    } catch {
      setStatus("error")
    }
  }

  const infos = [
    { label: "Localisation", value: "Belgique" },
    { label: "Disponibilité", value: "Disponible", live: true },
    { label: "Mode de travail", value: "À distance ou sur site" },
    { label: "Activité", value: "Freelance depuis 2022" },
  ]

  return (
    <section id="contact" className="bg-[#FBFAF8] border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <header className="max-w-2xl mb-14 sm:mb-20">
          <h2 className="font-serif text-[40px] sm:text-[52px] leading-none tracking-tight text-neutral-900 mb-5">
            Contact
          </h2>
          <p className="text-[16px] leading-relaxed text-neutral-600">
            Disponible pour des missions freelance en Belgique et à distance.
            Chaque devis est personnalisé, gratuit, et envoyé sous 24 h.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-14 lg:gap-x-16">
          {/* Gauche — infos */}
          <div>
            <h3 className="font-serif text-[30px] sm:text-[34px] leading-tight text-neutral-900 mb-10">
              Un projet en tête ? Parlons-en.
            </h3>

            <div className="mb-10">
              {infos.map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-3.5 border-b border-neutral-200 first:border-t"
                >
                  <span className="text-[14px] text-neutral-500">{item.label}</span>
                  {item.live ? (
                    <span className="flex items-center gap-2 text-[14px] font-medium text-emerald-700">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      {item.value}
                    </span>
                  ) : (
                    <span className="text-[14px] font-medium text-neutral-900">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/ryansdee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
              >
                LinkedIn
              </a>
            </div>

            <PortalFinder />
          </div>

          {/* Droite — formulaire */}
          <div>
            <h3 className="font-serif text-[22px] text-neutral-900 mb-8">Demande de devis</h3>

            {status === "success" ? (
              <div className="flex flex-col items-start gap-5 py-6">
                <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-[17px] font-medium text-neutral-900 mb-1">Demande reçue</p>
                  <p className="text-[15px] text-neutral-600 leading-relaxed">
                    Je vous recontacte sous 24 h avec une estimation personnalisée.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "firstName", label: "Prénom", placeholder: "Jean" },
                    { name: "lastName", label: "Nom", placeholder: "Dupont" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className={labelClass}>{field.label}</label>
                      <input
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        required
                        placeholder={field.placeholder}
                        className={inputClass}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Email</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="jean@entreprise.com"
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Type de projet</label>
                  <div className="relative">
                    <select
                      name="service" value={form.service} onChange={handleChange} required
                      className={`${inputClass} appearance-none cursor-pointer pr-10`}
                    >
                      <option value="">Sélectionner…</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <label className={labelClass}>Description du projet</label>
                    <span className="text-[12px] text-neutral-400 tabular-nums">
                      {form.description.length}/500
                    </span>
                  </div>
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    required maxLength={500} rows={4}
                    placeholder="Fonctionnalités, public cible, délai souhaité, contraintes particulières…"
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2.5 text-[13px] text-red-700 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
                    <AlertCircle size={14} className="shrink-0" />
                    Une erreur est survenue. Réessayez ou écrivez-moi directement.
                  </div>
                )}

                <button
                  type="submit" disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full text-[15px] font-medium bg-neutral-900 text-white py-3 rounded-lg transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed mt-1 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBFAF8]"
                >
                  {status === "loading" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>

                <p className="text-[12px] text-neutral-400 text-center leading-relaxed">
                  Devis gratuit, sans engagement. Réponse sous 24 h.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}