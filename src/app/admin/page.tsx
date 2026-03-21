"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore"
import { ContactRequest, ClientMessage } from "@/types"
import { cn } from "@/lib/utils"
import { LogOut, Mail, Clock, RefreshCw, MessageSquare } from "lucide-react"

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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

// ─── ReplyBox ────────────────────────────────────────────────────────────────

function ReplyBox({
  selected,
  onReplied,
}: {
  selected: ContactRequest
  onReplied: () => void
}) {
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
          requestId: selected.id,
          reply,
          clientEmail: selected.email,
          clientName: selected.firstName,
          plan: selected.plan,
          token: selected.token,
        }),
      })
      if (!res.ok) throw new Error("Erreur serveur")
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
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-900">
          Répondre au client
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Le client recevra un email + verra la réponse dans son portail.
        </p>
      </div>
      <div className="px-6 py-4">
        <textarea
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={5}
          placeholder={`Bonjour ${selected.firstName}, merci pour votre demande…`}
          className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-4 py-3 rounded-md outline-none focus:border-neutral-400 transition-colors resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-neutral-400">
            Le statut passera automatiquement à "Devis envoyé"
          </p>
          <button
            onClick={handleSend}
            disabled={sending || !reply.trim()}
            className="flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {sending ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi…
              </>
            ) : sent ? (
              "✓ Envoyé !"
            ) : (
              "Envoyer la réponse →"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ClientMessages ───────────────────────────────────────────────────────────

function ClientMessages({ messages }: { messages: ClientMessage[] }) {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
          <MessageSquare size={14} className="text-neutral-400" />
          <p className="text-sm font-semibold text-neutral-900">
            Messages du client
          </p>
          <span className="ml-auto text-xs text-neutral-300">0 message</span>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-neutral-300">
            Aucun message envoyé par le client pour l'instant.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
        <MessageSquare size={14} className="text-neutral-400" />
        <p className="text-sm font-semibold text-neutral-900">
          Messages du client
        </p>
        <span className="ml-auto text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
          {messages.length} message{messages.length > 1 ? "s" : ""}
        </span>
      </div>
      <div className="px-6 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex flex-col gap-1">
            {/* Bulle message */}
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl rounded-tl-sm px-4 py-3 max-w-[85%]">
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
            {/* Date */}
            <span className="text-xs text-neutral-300 pl-1">
              {formatDate(msg.sentAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AdminPage ───────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authed, setAuthed]     = useState(false)
  const [error, setError]       = useState("")
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading]   = useState(false)
  const [selected, setSelected] = useState<ContactRequest | null>(null)

  // ── Auth ──
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true)
      setError("")
    } else {
      setError("Mot de passe incorrect")
    }
  }

  // ── Fetch ──
  const fetchRequests = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, "contact_requests"),
        orderBy("createdAt", "desc")
      )
      const snap = await getDocs(q)
      const data = snap.docs.map((d) => {
        const raw = d.data()
        let createdAt = ""
        try {
          createdAt = raw.createdAt?.toDate().toLocaleDateString("fr-BE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }) ?? ""
        } catch {
          createdAt = ""
        }
        return { id: d.id, ...raw, createdAt } as ContactRequest
      })
      setRequests(data)

      // Refresh la demande sélectionnée
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

  // ── Update status ──
  const updateStatus = async (id: string, status: ContactRequest["status"]) => {
    await updateDoc(doc(db, "contact_requests", id), { status })
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : null))
    }
  }

  // ── Stats ──
  const newCount        = requests.filter((r) => r.status === "new").length
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length
  const doneCount       = requests.filter((r) => r.status === "done").length

  // ── Nombre de messages non lus dans la liste ──
  const hasClientMessages = (req: ContactRequest) =>
    (req.clientMessages?.length ?? 0) > 0

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-neutral-900 tracking-tight mb-1">
              Panel Admin
            </h1>
            <p className="text-sm text-neutral-400">Accès réservé — Ryan Deschuyteneer</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm px-4 py-3 rounded-md outline-none focus:border-neutral-400 transition-colors"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full text-sm font-medium bg-neutral-900 text-white py-3 rounded-md hover:bg-neutral-700 transition-colors"
            >
              Accéder →
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50">

      {/* ── Nav ── */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-neutral-900">
              Panel Admin
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
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-md transition-colors"
            >
              <RefreshCw size={12} />
              Actualiser
            </button>
            <button
              onClick={() => { setAuthed(false); setSelected(null) }}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-md transition-colors"
            >
              <LogOut size={12} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Nouvelles demandes", value: newCount,        color: "text-blue-600" },
            { label: "En cours",           value: inProgressCount, color: "text-amber-600" },
            { label: "Terminées",          value: doneCount,       color: "text-green-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-neutral-200 rounded-lg px-5 py-4"
            >
              <p className="text-xs text-neutral-400 mb-1">{stat.label}</p>
              <p className={`text-2xl font-semibold tracking-tight ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-5 h-5 border-2 border-neutral-200 border-t-neutral-600 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-neutral-400">Aucune demande pour l'instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Liste ── */}
            <div className="lg:col-span-1 flex flex-col gap-2">
              {requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelected(req)
                    if (req.status === "new") updateStatus(req.id!, "read")
                  }}
                  className={cn(
                    "text-left w-full bg-white border rounded-lg px-4 py-3.5 transition-all",
                    selected?.id === req.id
                      ? "border-neutral-400 shadow-sm"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {req.firstName} {req.lastName}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Indicateur messages client */}
                      {hasClientMessages(req) && (
                        <span className="flex items-center gap-1 text-xs bg-neutral-900 text-white px-1.5 py-0.5 rounded-full">
                          <MessageSquare size={9} />
                          {req.clientMessages!.length}
                        </span>
                      )}
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded border",
                          STATUS_LABELS[req.status ?? "new"].color
                        )}
                      >
                        {STATUS_LABELS[req.status ?? "new"].label}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{req.plan}</p>
                  <p className="text-xs text-neutral-300 mt-1">{req.createdAt}</p>
                </button>
              ))}
            </div>

            {/* ── Détail + Messages + Reply ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {selected ? (
                <>
                  {/* Fiche demande */}
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-neutral-100 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-semibold text-neutral-900">
                          {selected.firstName} {selected.lastName}
                        </h2>
                        <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                          <Clock size={11} />
                          {selected.createdAt}
                        </p>
                      </div>
                      <a
                        href={`mailto:${selected.email}?subject=Re: ${selected.plan}`}
                        className="flex items-center gap-1.5 text-xs bg-neutral-900 text-white px-3 py-1.5 rounded-md hover:bg-neutral-700 transition-colors shrink-0"
                      >
                        <Mail size={11} />
                        Email direct
                      </a>
                    </div>

                    {/* Changement de statut */}
                    <div className="px-6 py-3 border-b border-neutral-100 flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-neutral-400 mr-1">Statut :</span>
                      {STATUS_BUTTONS.map((s) => (
                        <button
                          key={s.key}
                          onClick={() => updateStatus(selected.id!, s.key)}
                          className={cn(
                            "text-xs px-2.5 py-1.5 rounded-md border transition-colors",
                            selected.status === s.key
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {/* Infos client */}
                    <div className="px-6 py-2 grid grid-cols-2 border-b border-neutral-100">
                      {[
                        { label: "Email",   value: selected.email },
                        { label: "Formule", value: selected.plan },
                        { label: "Budget",  value: selected.budget || "Non précisé" },
                        { label: "Statut",  value: STATUS_LABELS[selected.status ?? "new"].label },
                      ].map((item) => (
                        <div key={item.label} className="py-3 border-b border-neutral-50">
                          <p className="text-xs text-neutral-400 mb-0.5">{item.label}</p>
                          <p className="text-sm font-medium text-neutral-900">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="px-6 py-4 border-b border-neutral-100">
                      <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-medium">
                        Description du projet
                      </p>
                      <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {selected.description}
                      </p>
                    </div>

                    {/* Lien portail */}
                    <div className="px-6 py-3 bg-neutral-50">
                      <p className="text-xs text-neutral-400 mb-1">Lien portail client</p>
                      <a
                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${selected.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-neutral-600 hover:text-neutral-900 underline underline-offset-2 break-all"
                      >
                        {process.env.NEXT_PUBLIC_SITE_URL}/portail?token={selected.token?.slice(0, 24)}…
                      </a>
                    </div>
                  </div>

                  {/* Messages du client */}
                  <ClientMessages messages={selected.clientMessages ?? []} />

                  {/* Zone de réponse */}
                  <ReplyBox selected={selected} onReplied={fetchRequests} />
                </>
              ) : (
                <div className="bg-white border border-neutral-200 rounded-lg flex items-center justify-center py-20">
                  <p className="text-sm text-neutral-300">
                    Sélectionnez une demande pour voir les détails
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}