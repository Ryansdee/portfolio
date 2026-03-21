"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { ContactRequest, ClientMessage } from "@/types"
import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const STATUSES = [
  { key: "new",          label: "Reçue",        desc: "Votre demande a bien été reçue." },
  { key: "read",         label: "En lecture",    desc: "Je consulte votre demande." },
  { key: "in_progress",  label: "En cours",      desc: "Je travaille sur votre estimation." },
  { key: "quote_sent",   label: "Devis envoyé",  desc: "Mon estimation est disponible ci-dessous." },
  { key: "done",         label: "Terminé",       desc: "Projet finalisé. Merci pour votre confiance !" },
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

export default function PortailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [request, setRequest]     = useState<ContactRequest | null>(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  // Message form
  const [message, setMessage]     = useState("")
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [sendError, setSendError] = useState("")
  const [localMessages, setLocalMessages] = useState<ClientMessage[]>([])

  useEffect(() => {
    if (!token) {
      setNotFound(true)
      setLoading(false)
      return
    }

    const fetchRequest = async () => {
      try {
        const q = query(
          collection(db, "contact_requests"),
          where("token", "==", token)
        )
        const snap = await getDocs(q)

        if (snap.empty) {
          setNotFound(true)
        } else {
          const d = snap.docs[0]
          const raw = d.data()
          const req = {
            id: d.id,
            ...raw,
            createdAt: raw.createdAt?.toDate().toLocaleDateString("fr-BE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) ?? "",
          } as ContactRequest
          setRequest(req)
          setLocalMessages(req.clientMessages ?? [])
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRequest()
  }, [token])

  const currentStep = STATUSES.findIndex((s) => s.key === request?.status)

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !token) return

    setSending(true)
    setSendError("")

    try {
      const res = await fetch("/api/client/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, content: message.trim() }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      // Ajouter le message localement sans rechargement
      setLocalMessages((prev) => [...prev, data.message])
      setMessage("")
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch {
      setSendError("Erreur lors de l'envoi. Réessayez.")
    } finally {
      setSending(false)
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 size={20} className="text-neutral-400 animate-spin" />
      </div>
    )
  }

  // ── Not found ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <AlertCircle size={32} className="text-neutral-300 mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-neutral-900 mb-2">
            Lien invalide
          </h1>
          <p className="text-sm text-neutral-400 mb-6">
            Ce lien est introuvable ou a expiré. Vérifiez l'email reçu ou
            contactez-moi directement.
          </p>
          <Link
            href="/#contact"
            className="text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-colors"
          >
            Retour au site
          </Link>
        </div>
      </div>
    )
  }

  // ── Portail ──
  return (
    <div className="min-h-screen bg-neutral-50">

      {/* Nav */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-neutral-900">
            Ryan Deschuyteneer
          </Link>
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
            Espace client
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">
            Bonjour, {request?.firstName} 👋
          </h1>
          <p className="text-sm text-neutral-400">
            Voici l'état de votre demande soumise le {request?.createdAt}.
          </p>
        </div>

        {/* Stepper statut */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-5">
            Statut de la demande
          </p>
          <div className="flex items-start">
            {STATUSES.map((step, i) => {
              const isDone   = i <= currentStep
              const isActive = i === currentStep
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i < STATUSES.length - 1 && (
                    <div
                      className={cn(
                        "absolute top-3.5 left-1/2 w-full h-px transition-colors",
                        i < currentStep ? "bg-neutral-900" : "bg-neutral-200"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full border-2 flex items-center justify-center z-10 transition-all mb-3",
                      isDone
                        ? "border-neutral-900 bg-neutral-900"
                        : "border-neutral-200 bg-white"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle size={13} className="text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-300" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center leading-tight px-1",
                      isActive
                        ? "font-semibold text-neutral-900"
                        : isDone
                          ? "font-medium text-neutral-600"
                          : "text-neutral-300"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-5 bg-neutral-50 border border-neutral-100 rounded-lg px-4 py-3 flex items-center gap-2">
            <Clock size={13} className="text-neutral-400 shrink-0" />
            <span className="text-sm text-neutral-600">
              {STATUSES[currentStep]?.desc ?? "Demande en cours de traitement."}
            </span>
          </div>
        </div>

        {/* Résumé demande */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <FileText size={14} className="text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-900">
              Votre demande
            </span>
          </div>
          <div className="px-6 py-2">
            {[
              { label: "Formule", value: request?.plan },
              { label: "Budget",  value: request?.budget || "Non précisé" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-3 border-b border-neutral-50 last:border-0"
              >
                <span className="text-sm text-neutral-400">{item.label}</span>
                <span className="text-sm font-medium text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="px-6 pb-5">
            <p className="text-xs text-neutral-400 mb-2 uppercase tracking-wider font-medium">
              Description
            </p>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {request?.description}
            </p>
          </div>
        </div>

        {/* Réponse admin */}
        {request?.adminReply ? (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
              <MessageSquare size={14} className="text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-900">
                Réponse de Ryan
              </span>
              {request.adminReplyAt && (
                <span className="ml-auto text-xs text-neutral-300">
                  {formatDate(request.adminReplyAt)}
                </span>
              )}
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {request.adminReply}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-neutral-100 rounded-xl px-6 py-8 text-center">
            <Clock size={20} className="text-neutral-200 mx-auto mb-3" />
            <p className="text-sm text-neutral-400">
              Pas encore de réponse — vous serez notifié par email dès que je vous réponds.
            </p>
          </div>
        )}

        {/* ── Messagerie ── */}
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-2">
            <MessageSquare size={14} className="text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-900">
              Messages
            </span>
            {localMessages.length > 0 && (
              <span className="ml-auto text-xs text-neutral-300">
                {localMessages.length} message{localMessages.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Liste des messages envoyés */}
          {localMessages.length > 0 ? (
            <div className="px-6 py-4 flex flex-col gap-3 border-b border-neutral-100">
              {localMessages.map((msg, i) => (
                <div key={i} className="flex flex-col items-end gap-1">
                  <div className="bg-neutral-900 text-white text-sm px-4 py-2.5 rounded-xl rounded-tr-sm max-w-[85%]">
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs text-neutral-300">
                    {formatDate(msg.sentAt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-5 border-b border-neutral-100">
              <p className="text-sm text-neutral-300 text-center">
                Aucun message envoyé pour l'instant.
              </p>
            </div>
          )}

          {/* Formulaire d'envoi */}
          <form onSubmit={handleSendMessage} className="px-6 py-4">
            <p className="text-xs text-neutral-400 mb-3">
              Une question ou une précision à apporter ? Envoyez un message — je serai notifié par email.
            </p>
            <div className="flex flex-col gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Votre message…"
                className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-4 py-3 rounded-lg outline-none focus:border-neutral-400 transition-colors resize-none"
              />

              {sendError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  {sendError}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-300">
                  {sent ? (
                    <span className="text-green-600 font-medium">
                      ✓ Message envoyé !
                    </span>
                  ) : (
                    "Réponse sous 24h"
                  )}
                </p>
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-md hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi…
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-neutral-300 pb-4">
          Une urgence ?{" "}
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_MAIL_USER}`}
            className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2 transition-colors"
          >
            Contactez-moi directement par email
          </a>
        </p>

      </div>
    </div>
  )
}