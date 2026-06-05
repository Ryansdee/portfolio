// lib/generate-quote-pdf.ts
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

const BLACK = rgb(0.067, 0.067, 0.067)
const GREY  = rgb(0.533, 0.533, 0.533)
const LGREY = rgb(0.941, 0.941, 0.941)

type QuoteItem = {
  title: string
  description: string
  unitPrice: number
  quantity: number
}

type GenerateQuotePdfParams = {
  quoteNumber: string
  clientName: string
  clientEmail: string
  items: QuoteItem[]
  subtotal: number
  vatAmount: number
  total: number
}

export async function generateQuotePdf(data: GenerateQuotePdfParams): Promise<Uint8Array> {
  const { quoteNumber, clientName, clientEmail, items, subtotal, vatAmount, total } = data

  const doc  = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const fontReg  = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const M  = 48
  const CW = width - M * 2
  let y    = height - 48

  // ── Header ────────────────────────────────────────────────────────────
  page.drawText("Ryan Deschuyteneer", { x: M, y, font: fontBold, size: 15, color: BLACK })
  page.drawText("Développeur Web & IT — Belgique", { x: M, y: y - 16, font: fontReg, size: 9, color: GREY })

  const dateStr = new Date().toLocaleDateString("fr-BE", {
    day: "2-digit", month: "long", year: "numeric",
  })
  page.drawText(quoteNumber, {
    x: width - M - fontBold.widthOfTextAtSize(quoteNumber, 11),
    y, font: fontBold, size: 11, color: BLACK,
  })
  page.drawText(dateStr, {
    x: width - M - fontReg.widthOfTextAtSize(dateStr, 9),
    y: y - 16, font: fontReg, size: 9, color: GREY,
  })

  y -= 36
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
  y -= 28

  // ── Titre ─────────────────────────────────────────────────────────────
  page.drawText("DEVIS", { x: M, y, font: fontBold, size: 22, color: BLACK })
  y -= 32

  // ── Client ────────────────────────────────────────────────────────────
  page.drawText("CLIENT", { x: M, y, font: fontBold, size: 8, color: GREY })
  y -= 14
  page.drawText(clientName,  { x: M, y, font: fontBold, size: 11, color: BLACK })
  y -= 14
  page.drawText(clientEmail, { x: M, y, font: fontReg,  size: 9,  color: GREY })
  y -= 32

  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
  y -= 20

  // ── En-têtes tableau ──────────────────────────────────────────────────
  const colService = M
  const colQty     = M + CW * 0.55
  const colPU      = M + CW * 0.70
  const colTotal   = M + CW * 0.85

  for (const [label, x] of [
    ["SERVICE",   colService],
    ["QTÉ",       colQty],
    ["P.U. HT",   colPU],
    ["TOTAL HT",  colTotal],
  ] as [string, number][]) {
    page.drawText(label, { x, y, font: fontBold, size: 8, color: GREY })
  }

  y -= 10
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1, color: BLACK })
  y -= 18

  // ── Lignes ────────────────────────────────────────────────────────────
  for (const item of items) {
    const lineTotal = (item.unitPrice * item.quantity).toFixed(2) + " €"
    const pu        = item.unitPrice.toFixed(2) + " €"

    page.drawText(item.title, { x: colService, y, font: fontBold, size: 10, color: BLACK })
    if (item.description) {
      page.drawText(item.description, { x: colService, y: y - 13, font: fontReg, size: 8, color: GREY })
    }
    page.drawText(String(item.quantity), { x: colQty,   y, font: fontReg,  size: 10, color: BLACK })
    page.drawText(pu,                    { x: colPU,    y, font: fontReg,  size: 10, color: BLACK })
    page.drawText(lineTotal,             { x: colTotal, y, font: fontBold, size: 10, color: BLACK })

    y -= item.description ? 34 : 22
    page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
    y -= 14
  }

  // ── Récap TVA ─────────────────────────────────────────────────────────
  y -= 10
  const recapX = width - M - 180

  for (const row of [
    { label: "Sous-total HTVA", value: subtotal.toFixed(2) + " €",  bold: false },
    { label: "TVA 21%",         value: vatAmount.toFixed(2) + " €", bold: false },
    { label: "Total TTC",       value: total.toFixed(2) + " €",     bold: true  },
  ]) {
    if (row.bold) {
      y -= 6
      page.drawLine({
        start: { x: recapX, y: y + 14 },
        end:   { x: width - M, y: y + 14 },
        thickness: 0.5, color: LGREY,
      })
      y -= 4
    }
    const font = row.bold ? fontBold : fontReg
    const size = row.bold ? 12 : 10
    page.drawText(row.label, { x: recapX, y, font, size, color: row.bold ? BLACK : GREY })
    page.drawText(row.value, {
      x: width - M - font.widthOfTextAtSize(row.value, size),
      y, font, size, color: BLACK,
    })
    y -= row.bold ? 22 : 18
  }

  // ── Footer ────────────────────────────────────────────────────────────
  page.drawLine({ start: { x: M, y: 60 }, end: { x: width - M, y: 60 }, thickness: 0.5, color: LGREY })
  page.drawText("Ryan Deschuyteneer · Développeur Web & IT · Belgique", {
    x: M, y: 44, font: fontReg, size: 8, color: GREY,
  })

  return doc.save()
}