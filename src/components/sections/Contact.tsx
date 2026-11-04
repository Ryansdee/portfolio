"use client"

import { useState } from "react"
import { ArrowUpRight, CheckCircle, AlertCircle, Search, ExternalLink } from "lucide-react"

const services = [
  "Site vitrine",
  "Application web sur mesure",
  "Application mobile",
  "Modification d'un site existant",
  "Dépannage informatique",
  "Autre",
]

const inputClass =
  "w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 text-[15px] px-4 py-2.5 rounded-lg outline-none transition-colors focus:border-neutral-900"

const labelClass = "text-[13px] text-neutral-600"

const inputClass =
  "w-full bg-white border border-neutral-300 text-neutral-900 placeholder:text-neutral-400 text-[15px] px-3.5 py-2.5 rounded-md outline-none transition-colors focus:border-neutral-900"

const labelClass = "text-[13px] text-neutral-600"

const linkClass =
  "text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400"

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
    <div className="border-t border-neutral-100 pt-8 mt-8">
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">
        Retrouver mon espace client
      </p>

      {status === "sent" ? (
        <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3.5">
          <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-800 mb-0.5">Lien envoyé !</p>
            <p className="text-xs text-green-600 leading-relaxed">
              Vérifiez votre boîte mail — le lien d'accès vous a été renvoyé.
            </p>
            <button
              onClick={() => { setStatus("idle"); setEmail("") }}
              className="text-xs text-green-600 underline underline-offset-4 mt-2 hover:text-green-800 transition-colors"
            >
              Réessayer avec un autre email
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
              className="flex-1 bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-neutral-900 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-4 py-2.5 rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            >
              {status === "loading" ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={13} />
              )}
              Recevoir le lien
            </button>
          </div>

          {status === "notfound" && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-3.5 py-2.5 rounded-lg">
              <AlertCircle size={12} className="shrink-0" />
              Aucune demande trouvée pour cet email.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
              <AlertCircle size={12} className="shrink-0" />
              Une erreur est survenue. Réessayez dans quelques instants.
            </p>
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
    <section id="contact" className="border-b border-neutral-200">

      <div className="max-w-6xl mx-auto px-6 py-5 border-b border-neutral-100 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Contact</span>
        <span className="text-xs font-mono text-neutral-300">Réponse sous 24h</span>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-neutral-100">

          {/* Gauche */}
          <div className="py-14 lg:pr-14">
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 leading-[1.1] mb-3">
              Un projet en tête ?
            </p>
            <p className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-300 leading-[1.1] mb-10">
              Parlons-en.
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mb-12">
              Disponible pour des missions freelance en Belgique et à distance.
              Chaque devis est personnalisé, gratuit, et envoyé sous 24h.
            </p>

            <div className="mb-10">
              {[
                { label: "Localisation",    value: "Belgique" },
                { label: "Disponibilité",   value: "Disponible", green: true },
                { label: "Mode de travail", value: "Remote · On-site" },
                { label: "Expérience",      value: "4+ ans · Freelance" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3.5 border-b border-neutral-100 first:border-t">
                  <span className="text-sm text-neutral-400">{item.label}</span>
                  {item.green ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      {item.value}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-neutral-700">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <a href="https://github.com/ryansdee" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 px-4 py-2 rounded-md hover:border-neutral-900 hover:text-neutral-900 transition-all duration-150">
                GitHub <ArrowUpRight size={11} className="text-neutral-300 group-hover:text-neutral-700 transition-colors" />
              </a>
              <a href="https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/" target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 border border-neutral-200 px-4 py-2 rounded-md hover:border-neutral-900 hover:text-neutral-900 transition-all duration-150">
                LinkedIn <ArrowUpRight size={11} className="text-neutral-300 group-hover:text-neutral-700 transition-colors" />
              </a>
            </div>

            {/* Retrouver le portail */}
            <PortalFinder />
          </div>

          {/* Droite — formulaire */}
          <div className="py-14 lg:pl-14">
            <div className="flex items-center gap-2 mb-8">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
                Demande de devis
              </span>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-start gap-5 py-8">
                <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle size={18} className="text-green-500" />
                </div>
                <div>
                  <p className="text-base font-semibold text-neutral-900 mb-1">Demande reçue.</p>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Je vous recontacte sous 24h avec une estimation personnalisée.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs text-neutral-400 hover:text-neutral-700 underline underline-offset-4 transition-colors"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "firstName", label: "Prénom", placeholder: "Jean" },
                    { name: "lastName",  label: "Nom",    placeholder: "Dupont" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-col gap-2">
                      <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        value={form[field.name as keyof typeof form]}
                        onChange={handleChange}
                        required
                        placeholder={field.placeholder}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-neutral-900 transition-colors"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Email</label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="jean@entreprise.com"
                    className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Type de projet</label>
                  <div className="relative">
                    <select
                      name="service" value={form.service} onChange={handleChange} required
                      className="w-full appearance-none bg-white border border-neutral-200 text-neutral-900 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-neutral-900 transition-colors cursor-pointer pr-8"
                    >
                      <option value="">Sélectionner…</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">↓</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between">
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                      Description du projet
                    </label>
                    <span className="text-[10px] text-neutral-300">{form.description.length}/500</span>
                  </div>
                  <textarea
                    name="description" value={form.description} onChange={handleChange}
                    required maxLength={500} rows={4}
                    placeholder="Fonctionnalités, public cible, délai souhaité, contraintes particulières…"
                    className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-3.5 py-2.5 rounded-lg outline-none focus:border-neutral-900 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2.5 text-red-600 text-xs bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-lg">
                    <AlertCircle size={13} className="shrink-0" />
                    Une erreur est survenue. Réessayez ou écrivez-moi directement.
                  </div>
                )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                <button
                  type="submit" disabled={status === "loading"}
                  className="group relative flex items-center justify-center gap-2 w-full text-sm font-medium bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-1"
                >
                  {status === "loading" ? (
                    <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours…</>
                  ) : (
                    <>Envoyer la demande <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" /></>
                  )}
                </button>

                <p className="text-[10px] text-neutral-300 text-center leading-relaxed">
                  Devis gratuit · Sans engagement · Réponse sous 24h
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}