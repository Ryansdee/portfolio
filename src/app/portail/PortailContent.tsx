"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { ContactRequest, ClientMessage } from "@/types"
import {
  CheckCircle, Clock, FileText, MessageSquare,
  AlertCircle, Loader2, Send, ArrowUpRight,
  LayoutDashboard, ChevronRight, Download, Eye,
  Receipt, X, ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────

type Quote = {
  id: string
  quoteNumber: string
  clientName: string
  clientEmail: string
  items: { title: string; description: string; unitPrice: number; quantity: number }[]
  subtotal: number
  vatAmount: number
  total: number
  status: "sent" | "accepted" | "refused"
  createdAt: any
  pdfUrl?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES = [
  { key: "new",         label: "Reçue",        desc: "Votre demande a bien été reçue." },
  { key: "read",        label: "En lecture",    desc: "Je consulte votre demande." },
  { key: "in_progress", label: "En cours",      desc: "Je travaille sur votre estimation." },
  { key: "quote_sent",  label: "Devis envoyé",  desc: "Mon estimation est disponible ci-dessous." },
  { key: "done",        label: "Terminé",       desc: "Projet finalisé. Merci pour votre confiance !" },
]

const STATUS_STYLES: Record<string, { pill: string; dot: string; badge: string }> = {
  new:         { pill: "bg-blue-50 text-blue-700",     dot: "bg-blue-500",    badge: "bg-blue-50 text-blue-700 border-blue-100" },
  read:        { pill: "bg-neutral-100 text-neutral-600", dot: "bg-neutral-400", badge: "bg-neutral-100 text-neutral-600 border-neutral-200" },
  in_progress: { pill: "bg-amber-50 text-amber-700",   dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-700 border-amber-100" },
  quote_sent:  { pill: "bg-purple-50 text-purple-700", dot: "bg-purple-500",  badge: "bg-purple-50 text-purple-700 border-purple-100" },
  done:        { pill: "bg-green-50 text-green-700",   dot: "bg-green-500",   badge: "bg-green-50 text-green-700 border-green-100" },
}

type NavItem = "overview" | "request" | "quote" | "messages"

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-BE", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  } catch { return "" }
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={18} className="text-neutral-400 animate-spin" />
        <p className="text-xs text-neutral-400">Chargement de votre espace…</p>
      </div>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white border border-neutral-200 rounded-2xl p-8">
        <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
          <AlertCircle size={16} className="text-red-400" />
        </div>
        <h1 className="text-lg font-semibold text-neutral-900 tracking-tight mb-2">Lien invalide</h1>
        <p className="text-sm text-neutral-500 leading-relaxed mb-6">
          Ce lien est introuvable ou a expiré. Vérifiez l'email reçu ou contactez-moi directement.
        </p>
        <Link
          href="/#contact"
          className="inline-flex items-center gap-1.5 text-sm font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors"
        >
          Retour au site <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  request, active, onNav, hasMessages, hasQuote,
}: {
  request: ContactRequest
  active: NavItem
  onNav: (v: NavItem) => void
  hasMessages: boolean
  hasQuote: boolean
}) {
  const currentStatus = request.status ?? "new"
  const style       = STATUS_STYLES[currentStatus] ?? STATUS_STYLES.new
  const statusLabel = STATUSES.find((s) => s.key === currentStatus)?.label ?? "Nouveau"
  const statusDesc  = STATUSES.find((s) => s.key === currentStatus)?.desc ?? ""

  const navItems: { id: NavItem; icon: React.ElementType; label: string; dot?: boolean; highlight?: boolean }[] = [
    { id: "overview",  icon: LayoutDashboard, label: "Vue d'ensemble" },
    { id: "request",   icon: FileText,        label: "Ma demande" },
    { id: "quote",     icon: Receipt,         label: "Devis",     highlight: hasQuote, dot: hasQuote },
    { id: "messages",  icon: MessageSquare,   label: "Messages",  dot: hasMessages },
  ]

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-neutral-100">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Navigation</p>
        <nav className="flex flex-col gap-0.5">
          {navItems.map(({ id, icon: Icon, label, dot, highlight }) => (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors duration-150",
                active === id
                  ? "bg-neutral-900 text-white"
                  : highlight
                    ? "text-purple-700 bg-purple-50 hover:bg-purple-100"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <Icon size={14} className={active === id ? "text-white" : highlight ? "text-purple-500" : "text-neutral-400"} />
              <span className="text-sm font-medium">{label}</span>
              {dot && (
                <span className={cn(
                  "ml-auto w-2 h-2 rounded-full",
                  active === id ? "bg-green-400" : highlight ? "bg-purple-400" : "bg-green-500"
                )} />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-b border-neutral-100">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Statut actuel</p>
        <div className="flex items-center gap-2 mb-2">
          <span className={cn("w-2 h-2 rounded-full shrink-0", style.dot)} />
          <span className="text-sm font-semibold text-neutral-900">{statusLabel}</span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">{statusDesc}</p>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-neutral-900 mb-0.5">
            {request.firstName} {request.lastName}
          </p>
          <p className="text-[11px] text-neutral-400 truncate">{request.email}</p>
          <p className="text-[10px] text-neutral-300 mt-1.5">Demande du {request.createdAt}</p>
        </div>
      </div>
    </aside>
  )
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-0">
      {STATUSES.map((step, i) => {
        const isDone   = i <= currentStep
        const isActive = i === currentStep
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all text-xs font-semibold",
                isActive ? "bg-amber-500 text-white scale-110"
                : isDone  ? "bg-neutral-900 text-white"
                :           "bg-neutral-100 text-neutral-400"
              )}>
                {isDone && !isActive ? <CheckCircle size={12} /> : i + 1}
              </div>
              <span className={cn(
                "text-[9px] font-medium whitespace-nowrap",
                isActive ? "text-neutral-900 font-semibold"
                : isDone  ? "text-neutral-500"
                :           "text-neutral-300"
              )}>
                {step.label}
              </span>
            </div>
            {i < STATUSES.length - 1 && (
              <div className={cn(
                "w-10 h-px mb-4 mx-1 transition-colors",
                i < currentStep ? "bg-neutral-900" : "bg-neutral-200"
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Quote Tab ────────────────────────────────────────────────────────────────

function QuoteTab({ quote, requestId, token, onAccepted }: {
  quote: Quote | null
  requestId: string
  token: string
  onAccepted: () => void
}) {
  const [accepting, setAccepting]   = useState(false)
  const [refusing, setRefusing]     = useState(false)
  const [accepted, setAccepted]     = useState(quote?.status === "accepted")
  const [refused, setRefused]       = useState(quote?.status === "refused")
  const [showConfirm, setShowConfirm] = useState<"accept" | "refuse" | null>(null)

  if (!quote) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-16 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
          <Receipt size={18} className="text-neutral-300" />
        </div>
        <p className="text-sm font-medium text-neutral-500">Aucun devis pour l'instant</p>
        <p className="text-xs text-neutral-400 max-w-xs leading-relaxed">
          Votre devis apparaîtra ici dès qu'il sera prêt. Vous recevrez également un email avec le PDF.
        </p>
      </div>
    )
  }

  const handleAction = async (action: "accept" | "refuse") => {
    const setter = action === "accept" ? setAccepting : setRefusing
    setter(true)
    try {
      await fetch("/api/client/quote-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, quoteId: quote.id, action }),
      })
      if (action === "accept") { setAccepted(true); onAccepted() }
      else setRefused(true)
    } finally {
      setter(false)
      setShowConfirm(null)
    }
  }

  const statusBanner = accepted
    ? { bg: "bg-green-50 border-green-200", dot: "bg-green-500", text: "text-green-700", label: "Devis accepté — merci ! Je vous contacterai très bientôt." }
    : refused
      ? { bg: "bg-red-50 border-red-200", dot: "bg-red-400", text: "text-red-700", label: "Devis refusé. N'hésitez pas à me contacter pour en discuter." }
      : null

  return (
    <div className="flex flex-col gap-5">

      {/* Banner statut */}
      {statusBanner && (
        <div className={cn("border rounded-2xl px-5 py-4 flex items-center gap-3", statusBanner.bg)}>
          <span className={cn("w-2 h-2 rounded-full shrink-0", statusBanner.dot)} />
          <p className={cn("text-sm font-medium", statusBanner.text)}>{statusBanner.label}</p>
        </div>
      )}

      {/* Card principale devis */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">Devis</p>
            <p className="text-lg font-bold text-neutral-900 tracking-tight">{quote.quoteNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Bouton télécharger PDF */}
            <a
              href={`/api/client/quote-pdf?token=${token}&quoteId=${quote.id}`}
              download={`${quote.quoteNumber}.pdf`}
              className="flex items-center gap-2 text-xs font-medium border border-neutral-200 text-neutral-600 px-3 py-2 rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
            >
              <Download size={13} />
              Télécharger PDF
            </a>
            {/* Bouton voir PDF dans nouvel onglet */}
            <a
              href={`/api/client/quote-pdf?token=${token}&quoteId=${quote.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-medium border border-neutral-200 text-neutral-600 px-3 py-2 rounded-xl hover:border-neutral-400 hover:text-neutral-900 transition-all"
            >
              <ExternalLink size={13} />
              Voir le PDF
            </a>
          </div>
        </div>

        {/* Lignes du devis */}
        <div className="px-6 py-2">
          {/* En-têtes colonnes */}
          <div className="grid py-3 border-b border-neutral-100" style={{ gridTemplateColumns: "1fr 60px 90px 90px" }}>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Service</span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest text-center">Qté</span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest text-right">P.U. HT</span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest text-right">Total HT</span>
          </div>

          {quote.items.map((item, i) => (
            <div key={i} className="grid py-4 border-b border-neutral-50 last:border-0" style={{ gridTemplateColumns: "1fr 60px 90px 90px" }}>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                {item.description && (
                  <p className="text-xs text-neutral-400 mt-0.5">{item.description}</p>
                )}
              </div>
              <p className="text-sm text-neutral-600 text-center self-start pt-0.5">{item.quantity}</p>
              <p className="text-sm text-neutral-600 text-right self-start pt-0.5">{item.unitPrice.toFixed(2)} €</p>
              <p className="text-sm font-semibold text-neutral-900 text-right self-start pt-0.5">
                {(item.unitPrice * item.quantity).toFixed(2)} €
              </p>
            </div>
          ))}
        </div>

        {/* Récap TVA */}
        <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100">
          <div className="ml-auto max-w-xs flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Sous-total HTVA</span>
              <span className="font-mono font-medium text-neutral-700">{quote.subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm pb-2 border-b border-neutral-200">
              <span className="text-neutral-400">TVA 21%</span>
              <span className="font-mono font-medium text-neutral-700">{quote.vatAmount.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1">
              <span className="text-neutral-900">Total TTC</span>
              <span className="font-mono text-neutral-900">{quote.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions accept/refuse */}
      {!accepted && !refused && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-neutral-900 mb-1">Répondre à ce devis</p>
          <p className="text-xs text-neutral-400 mb-4">
            Acceptez pour confirmer votre projet, ou refusez si vous souhaitez en discuter.
          </p>

          {showConfirm ? (
            <div className={cn(
              "border rounded-xl p-4 flex flex-col gap-3",
              showConfirm === "accept" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            )}>
              <p className="text-sm font-medium text-neutral-900">
                {showConfirm === "accept"
                  ? "Confirmer l'acceptation du devis ?"
                  : "Confirmer le refus du devis ?"}
              </p>
              <p className="text-xs text-neutral-500">
                {showConfirm === "accept"
                  ? "Je serai notifié immédiatement et vous contacterai pour la suite."
                  : "Vous pouvez me contacter via l'onglet Messages pour en discuter."}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(showConfirm)}
                  disabled={accepting || refusing}
                  className={cn(
                    "flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-50",
                    showConfirm === "accept"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                  )}
                >
                  {(accepting || refusing) && (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {showConfirm === "accept" ? "Oui, j'accepte" : "Oui, je refuse"}
                </button>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="text-sm font-medium text-neutral-500 px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm("accept")}
                className="flex items-center gap-2 text-sm font-semibold bg-neutral-900 text-white px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-all"
              >
                <CheckCircle size={14} />
                Accepter le devis
              </button>
              <button
                onClick={() => setShowConfirm("refuse")}
                className="flex items-center gap-2 text-sm font-medium text-neutral-500 px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
              >
                <X size={14} />
                Refuser
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({
  request, currentStep, quote, onNav,
}: {
  request: ContactRequest
  currentStep: number
  quote: Quote | null
  onNav: (v: NavItem) => void
}) {
  const style       = STATUS_STYLES[request.status ?? "new"] ?? STATUS_STYLES.new
  const statusLabel = STATUSES.find((s) => s.key === request.status)?.label ?? "Nouveau"
  const statusDesc  = STATUSES[currentStep]?.desc ?? ""

  return (
    <div className="flex flex-col gap-5">
      {/* Stepper */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border", style.badge)}>
              <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
              {statusLabel}
            </span>
            <span className="text-sm text-neutral-500">{statusDesc}</span>
          </div>
        </div>
        <Stepper currentStep={currentStep} />
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
            <FileText size={13} className="text-neutral-400" />
            <span className="text-sm font-semibold text-neutral-900">Détails</span>
          </div>
          <div className="px-5 py-1">
            {[
              { label: "Service",    value: request.service ?? request.plan ?? "—" },
              { label: "Soumise le", value: request.createdAt },
              { label: "Réponse",    value: "Sous 24h" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-neutral-50 last:border-0">
                <span className="text-xs text-neutral-400 font-medium">{item.label}</span>
                <span className="text-xs font-semibold text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card devis rapide */}
        {quote ? (
          <button
            onClick={() => onNav("quote")}
            className="bg-white border border-purple-200 rounded-2xl overflow-hidden text-left hover:border-purple-400 transition-colors group"
          >
            <div className="px-5 py-3.5 border-b border-purple-100 flex items-center gap-2 bg-purple-50">
              <Receipt size={13} className="text-purple-500" />
              <span className="text-sm font-semibold text-purple-900">Devis disponible</span>
              <span className="ml-auto text-[10px] font-semibold text-purple-500 bg-white border border-purple-200 px-2 py-0.5 rounded-full">
                {quote.quoteNumber}
              </span>
            </div>
            <div className="px-5 py-4">
              <p className="text-2xl font-bold text-neutral-900 font-mono tracking-tight mb-1">
                {quote.total.toFixed(2)} €
              </p>
              <p className="text-xs text-neutral-400 mb-3">Total TTC · {quote.items.length} ligne{quote.items.length > 1 ? "s" : ""}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-purple-700 group-hover:gap-2.5 transition-all">
                <Eye size={12} />
                Voir le devis complet
                <ChevronRight size={11} />
              </div>
            </div>
          </button>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
              <MessageSquare size={13} className="text-neutral-400" />
              <span className="text-sm font-semibold text-neutral-900">Réponse</span>
            </div>
            <div className="px-5 py-4">
              {request.adminReply ? (
                <p className="text-sm text-neutral-700 leading-relaxed line-clamp-4">{request.adminReply}</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
                  <Clock size={18} className="text-neutral-200" />
                  <p className="text-xs text-neutral-400 leading-relaxed">En attente — vous serez notifié par email.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Request Tab ──────────────────────────────────────────────────────────────

function RequestTab({ request }: { request: ContactRequest }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
          <FileText size={13} className="text-neutral-400" />
          <span className="text-sm font-semibold text-neutral-900">Votre demande</span>
        </div>
        <div className="px-5 py-1">
          <div className="flex justify-between items-center py-3 border-b border-neutral-50">
            <span className="text-xs text-neutral-400 font-medium">Service</span>
            <span className="text-xs font-semibold text-neutral-900">{request.service ?? request.plan ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-xs text-neutral-400 font-medium">Date</span>
            <span className="text-xs font-semibold text-neutral-900">{request.createdAt}</span>
          </div>
        </div>
        <div className="px-5 pb-5">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-2.5">Description</p>
          <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{request.description}</p>
        </div>
      </div>

      {request.adminReply && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">RD</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900">Réponse de Ryan</span>
            {request.adminReplyAt && (
              <span className="ml-auto text-xs text-neutral-400">{formatDate(request.adminReplyAt)}</span>
            )}
          </div>
          <div className="px-5 py-5">
            <div className="bg-neutral-50 border border-neutral-100 rounded-xl rounded-tl-sm px-4 py-3.5">
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">{request.adminReply}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab({ request, localMessages, onSend }: {
  request: ContactRequest
  localMessages: ClientMessage[]
  onSend: (e: React.FormEvent, msg: string, setMsg: (v: string) => void) => Promise<void>
}) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [localMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setError("")
    try {
      await onSend(e, message, setMessage)
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch {
      setError("Erreur lors de l'envoi.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: 480 }}>
      <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center gap-2">
        <MessageSquare size={13} className="text-neutral-400" />
        <span className="text-sm font-semibold text-neutral-900">Messages</span>
        {localMessages.length > 0 && (
          <span className="ml-auto text-[10px] font-semibold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
            {localMessages.length}
          </span>
        )}
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-4 overflow-y-auto">
        {localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-10">
            <MessageSquare size={20} className="text-neutral-200" />
            <p className="text-xs text-neutral-400">Aucun message envoyé pour l'instant.</p>
          </div>
        ) : (
          localMessages.map((msg, i) => (
            <div key={i} className="flex flex-col items-end gap-1">
              <div className="bg-neutral-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[80%]">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] text-neutral-400">{formatDate(msg.sentAt)}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50/50">
        <p className="text-xs text-neutral-400 mb-3">
          Une question ou précision ? Ryan sera notifié par email.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Votre message…"
            className="w-full bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-300 text-sm px-4 py-3 rounded-xl outline-none focus:border-neutral-900 transition-colors resize-none leading-relaxed"
          />
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1.5">
              <AlertCircle size={11} /> {error}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs">
              {sent && (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={11} /> Message envoyé !
                </span>
              )}
            </span>
            <button
              type="submit"
              disabled={sending || !message.trim()}
              className="flex items-center gap-2 text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-xl hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {sending
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi…</>
                : <><Send size={12} />Envoyer</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PortailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [request, setRequest]             = useState<ContactRequest | null>(null)
  const [quote, setQuote]                 = useState<Quote | null>(null)
  const [loading, setLoading]             = useState(true)
  const [notFound, setNotFound]           = useState(false)
  const [localMessages, setLocalMessages] = useState<ClientMessage[]>([])
  const [activeTab, setActiveTab]         = useState<NavItem>("overview")

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return }

    const fetchData = async () => {
      try {
        // Fetch contact request
        const q = query(collection(db, "contact_requests"), where("token", "==", token))
        const snap = await getDocs(q)
        if (snap.empty) { setNotFound(true); setLoading(false); return }

        const d   = snap.docs[0]
        const raw = d.data()
        const req = {
          id: d.id, ...raw,
          createdAt: raw.createdAt?.toDate().toLocaleDateString("fr-BE", {
            day: "2-digit", month: "long", year: "numeric",
          }) ?? "",
        } as ContactRequest
        setRequest(req)
        setLocalMessages(req.clientMessages ?? [])

        // Fetch devis associé
        const qq = query(collection(db, "quotes"), where("token", "==", token))
        const qSnap = await getDocs(qq)
        if (!qSnap.empty) {
          const qd  = qSnap.docs[0]
          const qData = qd.data()
          setQuote({ id: qd.id, ...qData } as Quote)
          // Auto-navigate to quote tab if just sent
          if (req.status === "quote_sent") setActiveTab("quote")
        }
      } catch { setNotFound(true) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [token])

  const handleSend = async (_e: React.FormEvent, message: string, setMessage: (v: string) => void) => {
    const res = await fetch("/api/client/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, content: message.trim() }),
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    setLocalMessages((prev) => [...prev, data.message])
    setMessage("")
  }

  const handleQuoteAccepted = () => {
    if (request) setRequest({ ...request, status: "done" })
  }

  if (loading)              return <LoadingScreen />
  if (notFound || !request) return <NotFoundScreen />

  const currentStep = STATUSES.findIndex((s) => s.key === request.status)
  const tabLabels: Record<NavItem, string> = {
    overview: "Vue d'ensemble",
    request:  "Ma demande",
    quote:    "Devis",
    messages: "Messages",
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col">

      {/* Topbar */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">RD</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-600 transition-colors">
              Ryan Deschuyteneer
            </span>
            <span className="text-[10px] font-mono text-neutral-400 border border-neutral-200 px-1.5 py-0.5 rounded-sm">
              PORTAIL CLIENT
            </span>
          </Link>
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_MAIL_USER}`}
            className="group inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 border border-neutral-200 px-3 py-1.5 rounded-lg transition-all"
          >
            Une urgence ? Contactez-moi
            <ArrowUpRight size={11} className="text-neutral-300 group-hover:text-neutral-700 transition-colors" />
          </a>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <Sidebar
          request={request}
          active={activeTab}
          onNav={setActiveTab}
          hasMessages={localMessages.length > 0}
          hasQuote={!!quote}
        />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-7">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span>Portail</span>
              <ChevronRight size={12} />
              <span className="text-neutral-600 font-medium">{tabLabels[activeTab]}</span>
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              {activeTab === "overview" ? `Bonjour, ${request.firstName}.` : tabLabels[activeTab]}
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              {activeTab === "overview"   ? "Voici l'état de votre demande en temps réel."
               : activeTab === "request"  ? "Détails et réponse de Ryan."
               : activeTab === "quote"    ? "Consultez, téléchargez et répondez à votre devis."
               :                           "Posez vos questions directement."}
            </p>
          </div>

          {activeTab === "overview" && (
            <OverviewTab request={request} currentStep={currentStep} quote={quote} onNav={setActiveTab} />
          )}
          {activeTab === "request" && <RequestTab request={request} />}
          {activeTab === "quote" && (
            <QuoteTab
              quote={quote}
              requestId={request.id!}
              token={token!}
              onAccepted={handleQuoteAccepted}
            />
          )}
          {activeTab === "messages" && (
            <MessagesTab request={request} localMessages={localMessages} onSend={handleSend} />
          )}
        </main>
      </div>
    </div>
  )
}