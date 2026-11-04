"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const services = [
  "Site vitrine",
  "Application web sur mesure",
  "Application mobile",
  "Modification d'un site existant",
  "Dépannage informatique",
  "Autre",
]

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
    <div className="pt-8 mt-10 border-t border-neutral-200">
      <p className="text-[15px] text-neutral-900 mb-1">Déjà client ?</p>
      <p className="text-[14px] text-neutral-500 mb-4">
        Entrez votre email, je vous renvoie le lien de votre espace client.
      </p>

      {status === "sent" ? (
        <div>
          <p className="text-[14px] text-emerald-700 mb-2">
            Lien envoyé. Vérifiez votre boîte mail.
          </p>
          <button
            onClick={() => { setStatus("idle"); setEmail("") }}
            className={linkClass}
          >
            Utiliser un autre email
          </button>
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
              aria-label="Votre email"
              className={`flex-1 ${inputClass}`}
            />
            <button
              type="submit"
              disabled={status === "loading" || !email.trim()}
              className="text-[14px] text-neutral-900 border border-neutral-900 px-4 py-2.5 rounded-md transition-colors hover:bg-neutral-900 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? "Envoi…" : "Recevoir le lien"}
            </button>
          </div>

          {status === "notfound" && (
            <p className="text-[13px] text-amber-800">
              Aucune demande n'est associée à cet email.
            </p>
          )}
          {status === "error" && (
            <p className="text-[13px] text-red-700">
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

  return (
    <section id="contact" className="border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-x-10">
        {/* Gauche */}
        <div className="lg:col-span-5">
          <h2 className="font-serif text-[34px] sm:text-[42px] leading-none tracking-tight text-neutral-900 mb-5">
            Parlons de votre projet
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[40ch] mb-8">
            Décrivez-moi en quelques lignes ce que vous avez en tête. Je vous
            réponds moi-même sous 24 h, avec un devis gratuit et sans engagement.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/ryansdee"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
            </a>
          </div>

          <PortalFinder />
        </div>

        {/* Droite — formulaire */}
        <div className="lg:col-span-7">
          {status === "success" ? (
            <div className="border-t border-neutral-200 pt-8">
              <p className="font-serif text-[26px] text-neutral-900 mb-2">Merci, c'est bien reçu.</p>
              <p className="text-[15px] text-neutral-600 leading-relaxed mb-6">
                Je reviens vers vous sous 24 h. Vous recevrez aussi un email avec le
                lien de votre espace client.
              </p>
              <button onClick={() => setStatus("idle")} className={linkClass}>
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
                    <label htmlFor={field.name} className={labelClass}>{field.label}</label>
                    <input
                      id={field.name}
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
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email" name="email" type="email" value={form.email} onChange={handleChange} required
                  placeholder="jean@exemple.be"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="service" className={labelClass}>Votre demande concerne</label>
                <div className="relative">
                  <select
                    id="service" name="service" value={form.service} onChange={handleChange} required
                    className={`${inputClass} appearance-none cursor-pointer pr-10`}
                  >
                    <option value="">Choisir…</option>
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
                  <label htmlFor="description" className={labelClass}>Quelques mots sur le projet</label>
                  <span className="text-[12px] text-neutral-400 tabular-nums">
                    {form.description.length}/500
                  </span>
                </div>
                <textarea
                  id="description" name="description" value={form.description} onChange={handleChange}
                  required maxLength={500} rows={5}
                  placeholder="Ce que vous voulez faire, pour qui, et pour quand."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
              </div>

              {status === "error" && (
                <p className="text-[13px] text-red-700">
                  Une erreur est survenue. Réessayez ou écrivez-moi directement.
                </p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
                <button
                  type="submit" disabled={status === "loading"}
                  className="text-[15px] font-medium bg-neutral-900 text-white px-6 py-3 rounded-md transition-colors hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Envoi en cours…" : "Envoyer"}
                </button>
                <p className="text-[13px] text-neutral-500">
                  Devis gratuit, réponse sous 24 h.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}