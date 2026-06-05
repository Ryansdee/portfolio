"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import {
  collection, getDocs, orderBy, query, doc, updateDoc,
} from "firebase/firestore"
import { ContactRequest, ClientMessage } from "@/types"
import { cn } from "@/lib/utils"
import { LogOut, Mail, Clock, RefreshCw, MessageSquare, ArrowUpRight, ChevronRight } from "lucide-react"
import { QuoteBuilder } from "./components/QuoteBuilder"

const STATUS_LABELS = {
  new:         { label: "Nouveau",      color: "bg-blue-50 text-blue-600 border-blue-100" },
  read:        { label: "Lu",           color: "bg-neutral-100 text-neutral-500 border-neutral-200" },
  in_progress: { label: "En cours",     color: "bg-amber-50 text-amber-600 border-amber-100" },
  quote_sent:  { label: "Devis envoyé", color: "bg-purple-50 text-purple-600 border-purple-100" },
  done:        { label: "Terminé",      color: "bg-green-50 text-green-600 border-green-100" },
}

const STATUS_BUTTONS: { key: ContactRequest["status"]; label: string }[] = [
  { key: "new",         label: "Nouveau" },
  { key: "read",        label: "Lu" },
  { key: "in_progress", label: "En cours" },
  { key: "quote_sent",  label: "Devis envoyé" },
  { key: "done",        label: "Terminé" },
]

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-BE", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch { return "" }
}

// ─── ReplyBox ─────────────────────────────────────────────────────────────

function ReplyBox({ selected, onReplied }: { selected: ContactRequest; onReplied: () => void }) {
  const [reply, setReply] = useState(selected.adminReply ?? "")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setReply(selected.adminReply ?? "")
    setSent(false)
  }, [selected.id, selected.adminReply])

  const handleSend = async () => {
    if (!reply.trim()) return
    setSending(true)
    try {
      const res = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selected.id, reply,
          clientEmail: selected.email,
          clientName: selected.firstName,
          plan: selected.plan,
          token: selected.token,
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      onReplied()
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900">Répondre au client</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Email + portail client mis à jour automatiquement
          </p>
        </div>
        <Mail size={14} className="text-neutral-300" />
      </div>
      <div className="p-5">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={5}
          placeholder={`Bonjour ${selected.firstName}, merci pour votre demande…`}
          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-4 py-3 rounded-lg outline-none focus:border-neutral-900 transition-colors resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-neutral-400">
            Statut → "Devis envoyé" automatiquement
          </p>
          <button
            onClick={handleSend}
            disabled={sending || !reply.trim()}
            className="flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {sending ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</>
            ) : sent ? "✓ Envoyé !" : (
              <>Envoyer <ArrowUpRight size={13} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ClientMessages ───────────────────────────────────────────────────────

function ClientMessages({ messages }: { messages: ClientMessage[] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
        <MessageSquare size={13} className="text-neutral-400" />
        <p className="text-sm font-medium text-neutral-900">Messages client</p>
        <span className="ml-auto text-xs font-mono text-neutral-300">
          {messages.length} message{messages.length > 1 ? "s" : ""}
        </span>
      </div>
      {messages.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-xs text-neutral-300">Aucun message pour l'instant.</p>
        </div>
      ) : (
        <div className="px-5 py-4 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="bg-neutral-50 border border-neutral-100 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
              <span className="text-xs text-neutral-300 pl-1">{formatDate(msg.sentAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      onAuth()
    } else {
      setError("Mot de passe incorrect")
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-semibold text-neutral-900">Ryan Deschuyteneer</span>
            <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
              ADMIN
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight mb-1">
            Accès restreint
          </h1>
          <p className="text-sm text-neutral-400">Panel de gestion des demandes clients.</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError("") }}
            placeholder="Mot de passe"
            autoFocus
            className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm px-4 py-3 rounded-lg outline-none focus:border-neutral-900 transition-colors"
          />
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
              {error}
            </p>
          )}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-neutral-900 text-white py-3 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Accéder <ChevronRight size={14} />
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed]     = useState(false)
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState<ContactRequest | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const q = query(collection(db, "contact_requests"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      const data = snap.docs.map((d) => {
        const raw = d.data()
        let createdAt = ""
        try {
          createdAt = raw.createdAt?.toDate().toLocaleDateString("fr-BE", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          }) ?? ""
        } catch { createdAt = "" }
        return { id: d.id, ...raw, createdAt } as ContactRequest
      })
      setRequests(data)
      if (selected) {
        const refreshed = data.find((r) => r.id === selected.id)
        if (refreshed) setSelected(refreshed)
      }
    } catch (err) {
      console.error("Firestore error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) fetchRequests()
  }, [authed])

  const updateStatus = async (id: string, status: ContactRequest["status"]) => {
    await updateDoc(doc(db, "contact_requests", id), { status })
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
  }

  const newCount        = requests.filter((r) => r.status === "new").length
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length
  const doneCount       = requests.filter((r) => r.status === "done").length

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-900 tracking-tight">
              Ryan Deschuyteneer
            </span>
            <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
              ADMIN
            </span>
            {newCount > 0 && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                {newCount} nouveau{newCount > 1 ? "x" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRequests}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw size={11} className={cn(loading && "animate-spin")} />
              Actualiser
            </button>
            <button
              onClick={() => { setAuthed(false); setSelected(null) }}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <LogOut size={11} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Nouvelles demandes", value: newCount,        accent: "text-blue-600",   dot: "bg-blue-500" },
            { label: "En cours",           value: inProgressCount, accent: "text-amber-600",  dot: "bg-amber-500" },
            { label: "Terminées",          value: doneCount,       accent: "text-green-600",  dot: "bg-green-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-neutral-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-400 mb-1.5">{stat.label}</p>
                <p className={cn("text-2xl font-semibold tracking-tight", stat.accent)}>
                  {stat.value}
                </p>
              </div>
              <span className={cn("w-2 h-2 rounded-full", stat.dot)} />
            </div>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-neutral-400">Aucune demande pour l'instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Liste */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              {requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelected(req)
                    if (req.status === "new") updateStatus(req.id!, "read")
                  }}
                  className={cn(
                    "text-left w-full bg-white border rounded-xl px-4 py-3.5 transition-all duration-150 relative overflow-hidden group",
                    selected?.id === req.id
                      ? "border-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {/* Accent line si sélectionné */}
                  {selected?.id === req.id && (
                    <span className="absolute top-0 left-0 w-full h-[2px] bg-neutral-900" />
                  )}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {req.firstName} {req.lastName}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(req.clientMessages?.length ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs bg-neutral-900 text-white px-1.5 py-0.5 rounded-full">
                          <MessageSquare size={9} />
                          {req.clientMessages!.length}
                        </span>
                      )}
                      <span className={cn("text-xs px-2 py-0.5 rounded border", STATUS_LABELS[req.status ?? "new"].color)}>
                        {STATUS_LABELS[req.status ?? "new"].label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{req.plan}</p>
                  <p className="text-xs text-neutral-300 mt-1 flex items-center gap-1">
                    <Clock size={9} />
                    {req.createdAt}
                  </p>
                </button>
              ))}
            </div>

            {/* Détail */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {selected ? (
                <>
                  {/* Fiche */}
                  <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">

                    {/* Header fiche */}
                    <div className="px-5 py-4 border-b border-neutral-100 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-neutral-900 tracking-tight">
                          {selected.firstName} {selected.lastName}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <Clock size={10} />
                          {selected.createdAt}
                        </p>
                      </div>
                      <a
                        href={`mailto:${selected.email}?subject=Re: ${selected.plan}`}
                        className="flex items-center gap-1.5 text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-lg hover:bg-neutral-700 transition-colors shrink-0"
                      >
                        <Mail size={11} />
                        Email direct
                      </a>
                    </div>

                    {/* Statuts */}
                    <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mr-1">
                        Statut
                      </span>
                      {STATUS_BUTTONS.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateStatus(selected.id!, s.key)}
                          className={cn(
                            "text-xs px-2.5 py-1.5 rounded-lg border transition-colors duration-150",
                            selected.status === s.key
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Infos */}
                    <div className="px-5 py-2 grid grid-cols-2 border-b border-neutral-100">
                      {[
                        { label: "Email",   value: selected.email },
                        { label: "Service", value: selected.plan },
                        { label: "Statut",  value: STATUS_LABELS[selected.status ?? "new"].label },
                      ].map((item) => (
                        <div key={item.label} className="py-3 border-b border-neutral-50 last:border-0">
                          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm font-medium text-neutral-900">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="px-5 py-4 border-b border-neutral-100">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-2">
                        Description du projet
                      </p>
                      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {selected.description}
                      </p>
                    </div>

                    {/* Portail */}
                    <div className="px-5 py-3 bg-neutral-50 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-0.5">
                          Lien portail client
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          /portail?token={selected.token?.slice(0, 20)}…
                        </p>
                      </div>
                      <a
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${selected.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        Ouvrir <ArrowUpRight size={11} />
                      </a>
                    </div>
                  </div>

                  <ClientMessages messages={selected.clientMessages ?? []} />
                  <ReplyBox selected={selected} onReplied={fetchRequests} />
                  <QuoteBuilder selected={selected} onSent={fetchRequests} />
                </>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-xl flex flex-col items-center justify-center py-20 gap-2">
                  <p className="text-sm text-neutral-300">Sélectionnez une demande</p>
                  <p className="text-xs text-neutral-200">Les détails apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}