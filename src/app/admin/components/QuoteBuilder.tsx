// Ajoutez ce composant dans app/admin/page.tsx

import { Plus, Trash2, FileText, Calculator, Mail } from "lucide-react"
import { ContactRequest, Quote, QuoteItem } from "@/types"
import { useState } from "react"

export function QuoteBuilder({
  selected,
  onSent,
}: {
  selected: ContactRequest
  onSent: () => void
}) {
  const [open, setOpen]     = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState("")
  const [items, setItems]   = useState<QuoteItem[]>([
    { title: "", description: "", unitPrice: 0, quantity: 1 },
  ])

  const VAT = 0.21
  const subtotal  = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const vatAmount = Math.round(subtotal * VAT * 100) / 100
  const total     = Math.round((subtotal + vatAmount) * 100) / 100

  const addItem = () =>
    setItems((p) => [...p, { title: "", description: "", unitPrice: 0, quantity: 1 }])

  const removeItem = (idx: number) =>
    setItems((p) => p.filter((_, i) => i !== idx))

  const updateItem = <K extends keyof QuoteItem>(
    idx: number, key: K, value: QuoteItem[K]
  ) => setItems((p) => p.map((item, i) => i === idx ? { ...item, [key]: value } : item))

  const handleSend = async () => {
    if (items.some((i) => !i.title.trim())) {
      setError("Remplissez le titre de chaque ligne.")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch("/api/admin/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selected.id,
          clientName: `${selected.firstName} ${selected.lastName}`,
          clientEmail: selected.email,
          items,
          token: selected.token,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSent(true)
      onSent()
      setTimeout(() => { setSent(false); setOpen(false) }, 3000)
    } catch {
      setError("Erreur lors de l'envoi.")
    } finally {
      setSending(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 text-sm font-medium border-2 border-dashed border-neutral-200 text-neutral-400 py-4 rounded-xl hover:border-neutral-400 hover:text-neutral-700 transition-all duration-150"
      >
        <FileText size={14} />
        Créer un devis pour ce client
      </button>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Créer un devis</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Pour {selected.firstName} {selected.lastName} · Numéro attribué automatiquement
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-neutral-400 hover:text-neutral-700 border border-neutral-200 px-2.5 py-1.5 rounded-lg transition-colors"
        >
          Annuler
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4">

        {/* En-tête colonnes */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 80px 100px 32px" }}>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            Service / Description
          </span>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest text-center">
            Qté
          </span>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest text-right">
            Prix HTVA
          </span>
          <span />
        </div>

        {/* Lignes */}
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-2 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
            <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 80px 100px 32px" }}>
              <input
                value={item.title}
                onChange={(e) => updateItem(idx, "title", e.target.value)}
                placeholder="Titre du service"
                className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-3 py-2 rounded-lg outline-none focus:border-neutral-900 transition-colors"
              />
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm px-3 py-2 rounded-lg outline-none focus:border-neutral-900 transition-colors text-center"
              />
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm pl-3 pr-7 py-2 rounded-lg outline-none focus:border-neutral-900 transition-colors text-right"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 pointer-events-none">€</span>
              </div>
              <button
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
            <input
              value={item.description}
              onChange={(e) => updateItem(idx, "description", e.target.value)}
              placeholder="Description optionnelle…"
              className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs px-3 py-2 rounded-lg outline-none focus:border-neutral-900 transition-colors text-neutral-500 placeholder:text-neutral-300"
            />
            {/* Sous-total ligne */}
            <div className="flex justify-end">
              <span className="text-xs font-mono text-neutral-400">
                = {(item.unitPrice * item.quantity).toFixed(2)} € HTVA
              </span>
            </div>
          </div>
        ))}

        {/* Ajouter ligne */}
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 transition-colors self-start"
        >
          <Plus size={13} />
          Ajouter une ligne
        </button>

        {/* Récap TVA */}
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Calculator size={12} className="text-neutral-400" />
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
              Récapitulatif
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Sous-total HTVA</span>
            <span className="font-mono font-medium text-neutral-700">{subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">TVA 21%</span>
            <span className="font-mono font-medium text-neutral-700">{vatAmount.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t border-neutral-200 pt-2 mt-1">
            <span className="text-neutral-900">Total TTC</span>
            <span className="font-mono text-neutral-900">{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block shrink-0" />
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSend}
          disabled={sending || items.every((i) => !i.title.trim())}
          className="flex items-center justify-center gap-2 w-full text-sm font-semibold bg-neutral-900 text-white py-3 rounded-xl hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {sending ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours…</>
          ) : sent ? (
            "✓ Devis envoyé !"
          ) : (
            <>
              <Mail size={14} />
              Envoyer le devis à {selected.firstName}
            </>
          )}
        </button>
        <p className="text-[10px] text-neutral-400 text-center">
          Le statut passera automatiquement à "Devis envoyé" · Un email sera envoyé au client
        </p>
      </div>
    </div>
  )
}