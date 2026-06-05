import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { adminDb as db } from "@/lib/firebase-admin"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
})

// ── Helpers couleurs ──────────────────────────────────────────────────────
const BLACK  = rgb(0.067, 0.067, 0.067)   // #111
const GREY   = rgb(0.533, 0.533, 0.533)   // #888
const LGREY  = rgb(0.941, 0.941, 0.941)   // #F0F0F0
const WHITE  = rgb(1, 1, 1)

async function generateQuotePdf(data: {
  quoteNumber: string
  clientName: string
  clientEmail: string
  items: { title: string; description: string; unitPrice: number; quantity: number }[]
  subtotal: number
  vatAmount: number
  total: number
}): Promise<Uint8Array> {
  const { quoteNumber, clientName, clientEmail, items, subtotal, vatAmount, total } = data

  const doc  = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const fontReg  = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)

  const M  = 48  // marge gauche/droite
  const CW = width - M * 2  // largeur utile
  let y    = height - 48

  // ── Header ──────────────────────────────────────────────────────────────
  fontBold && page.drawText("Ryan Deschuyteneer", { x: M, y, font: fontBold, size: 15, color: BLACK })
  page.drawText("Développeur Web & IT — Belgique", { x: M, y: y - 16, font: fontReg, size: 9, color: GREY })

  // Numéro + date à droite
  const dateStr = new Date().toLocaleDateString("fr-BE", { day: "2-digit", month: "long", year: "numeric" })
  page.drawText(quoteNumber, { x: width - M - fontBold.widthOfTextAtSize(quoteNumber, 11), y, font: fontBold, size: 11, color: BLACK })
  page.drawText(dateStr, { x: width - M - fontReg.widthOfTextAtSize(dateStr, 9), y: y - 16, font: fontReg, size: 9, color: GREY })

  y -= 36
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
  y -= 28

  // ── Titre devis ─────────────────────────────────────────────────────────
  page.drawText("DEVIS", { x: M, y, font: fontBold, size: 22, color: BLACK })
  y -= 32

  // ── Infos client ────────────────────────────────────────────────────────
  page.drawText("CLIENT", { x: M, y, font: fontBold, size: 8, color: GREY })
  y -= 14
  page.drawText(clientName, { x: M, y, font: fontBold, size: 11, color: BLACK })
  y -= 14
  page.drawText(clientEmail, { x: M, y, font: fontReg, size: 9, color: GREY })
  y -= 32

  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
  y -= 20

  // ── En-têtes tableau ────────────────────────────────────────────────────
  const colService = M
  const colQty     = M + CW * 0.55
  const colPU      = M + CW * 0.70
  const colTotal   = M + CW * 0.85

  const headers = [
    { label: "SERVICE",  x: colService },
    { label: "QTÉ",     x: colQty },
    { label: "P.U. HT", x: colPU },
    { label: "TOTAL HT",x: colTotal },
  ]
  for (const h of headers) {
    page.drawText(h.label, { x: h.x, y, font: fontBold, size: 8, color: GREY })
  }
  y -= 10
  page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 1, color: BLACK })
  y -= 18

  // ── Lignes ──────────────────────────────────────────────────────────────
  for (const item of items) {
    const lineTotal = (item.unitPrice * item.quantity).toFixed(2) + " €"
    const pu        = item.unitPrice.toFixed(2) + " €"
    const qty       = String(item.quantity)

    page.drawText(item.title, { x: colService, y, font: fontBold, size: 10, color: BLACK })
    if (item.description) {
      page.drawText(item.description, { x: colService, y: y - 13, font: fontReg, size: 8, color: GREY })
    }
    page.drawText(qty,       { x: colQty,   y, font: fontReg,  size: 10, color: BLACK })
    page.drawText(pu,        { x: colPU,    y, font: fontReg,  size: 10, color: BLACK })
    page.drawText(lineTotal, { x: colTotal, y, font: fontBold, size: 10, color: BLACK })

    y -= item.description ? 34 : 22
    page.drawLine({ start: { x: M, y }, end: { x: width - M, y }, thickness: 0.5, color: LGREY })
    y -= 14
  }

  // ── Récap TVA ────────────────────────────────────────────────────────────
  y -= 10
  const recapX = width - M - 180

  const rows = [
    { label: "Sous-total HTVA", value: subtotal.toFixed(2) + " €", bold: false },
    { label: "TVA 21%",         value: vatAmount.toFixed(2) + " €", bold: false },
    { label: "Total TTC",       value: total.toFixed(2) + " €",     bold: true  },
  ]

  for (const row of rows) {
    if (row.bold) {
      y -= 6
      page.drawLine({ start: { x: recapX, y: y + 14 }, end: { x: width - M, y: y + 14 }, thickness: 0.5, color: LGREY })
      y -= 4
    }
    const font = row.bold ? fontBold : fontReg
    const size = row.bold ? 12 : 10
    page.drawText(row.label, { x: recapX,                                                      y, font, size, color: row.bold ? BLACK : GREY })
    page.drawText(row.value, { x: width - M - font.widthOfTextAtSize(row.value, size), y, font, size, color: BLACK })
    y -= row.bold ? 22 : 18
  }

  // ── Footer ───────────────────────────────────────────────────────────────
  page.drawLine({ start: { x: M, y: 60 }, end: { x: width - M, y: 60 }, thickness: 0.5, color: LGREY })
  page.drawText("Ryan Deschuyteneer · Développeur Web & IT · Belgique", {
    x: M, y: 44, font: fontReg, size: 8, color: GREY,
  })

  return doc.save()
}

// ── Route POST ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { requestId, clientName, clientEmail, items, token } = body

    if (!requestId || !clientName || !clientEmail || !items?.length) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    // Numéro auto-incrémenté
    const year = new Date().getFullYear()
    const snap = await db.collection("quotes").orderBy("createdAt", "desc").get()
    const existing = snap.docs
      .map((d) => d.data().quoteNumber as string)
      .filter((n) => n?.startsWith(`DEV-${year}-`))
    const lastNum = existing.length
      ? Math.max(...existing.map((n) => parseInt(n.split("-")[2] ?? "0", 10)))
      : 0
    const quoteNumber = `DEV-${year}-${String(lastNum + 1).padStart(3, "0")}`

    // Calculs TVA
    const vatRate   = 0.21
    const subtotal  = items.reduce((s: number, i: any) => s + i.unitPrice * i.quantity, 0)
    const vatAmount = Math.round(subtotal * vatRate * 100) / 100
    const total     = Math.round((subtotal + vatAmount) * 100) / 100

    // Génération PDF
    const pdfBytes = await generateQuotePdf({
      quoteNumber, clientName, clientEmail, items, subtotal, vatAmount, total,
    })

    // Sauvegarde Firestore
    const quoteRef = await db.collection("quotes").add({
      quoteNumber, requestId, clientName, clientEmail,
      items, subtotal, vatRate, vatAmount, total,
      status: "sent", token,
      createdAt: new Date(), sentAt: new Date(),
    })

    await db.collection("contact_requests").doc(requestId).update({ status: "quote_sent" })

    // Email client avec PDF en pièce jointe
    const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${token}`
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #F5F5F5;font-size:13px;color:#111;">
          <strong>${item.title}</strong>
          ${item.description ? `<br/><span style="color:#888;font-size:12px;">${item.description}</span>` : ""}
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #F5F5F5;font-size:13px;color:#888;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 0;border-bottom:1px solid #F5F5F5;font-size:13px;color:#111;text-align:right;">${item.unitPrice.toFixed(2)} €</td>
        <td style="padding:12px 0;border-bottom:1px solid #F5F5F5;font-size:13px;font-weight:600;color:#111;text-align:right;">${(item.unitPrice * item.quantity).toFixed(2)} €</td>
      </tr>`).join("")

    await transporter.sendMail({
      from: `"Ryan Deschuyteneer" <${process.env.MAIL_USER}>`,
      to: clientEmail,
      subject: `Devis ${quoteNumber} — Ryan Deschuyteneer`,
      attachments: [{
        filename: `${quoteNumber}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      }],
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:640px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="margin-bottom:32px;padding-bottom:24px;border-bottom:1px solid #F0F0F0;">
            <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:6px;">Ryan Deschuyteneer · Développeur Web & IT</div>
            <div style="font-size:22px;font-weight:700;color:#111;">Devis ${quoteNumber}</div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead><tr style="border-bottom:2px solid #111;">
              <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#999;text-align:left;">Service</th>
              <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#999;text-align:center;">Qté</th>
              <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#999;text-align:right;">P.U.</th>
              <th style="padding:8px 0;font-size:11px;font-weight:600;text-transform:uppercase;color:#999;text-align:right;">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="margin-left:auto;max-width:260px;margin-bottom:32px;">
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;">
              <span style="color:#888;">Sous-total HTVA</span><span style="font-weight:500;">${subtotal.toFixed(2)} €</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #F0F0F0;">
              <span style="color:#888;">TVA 21%</span><span style="font-weight:500;">${vatAmount.toFixed(2)} €</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;font-size:16px;font-weight:700;">
              <span>Total TTC</span><span>${total.toFixed(2)} €</span>
            </div>
          </div>
          <div style="background:#F9F9F9;border:1px solid #EBEBEB;border-radius:10px;padding:20px;margin-bottom:28px;">
            <p style="font-size:13px;color:#555;margin-bottom:16px;">Le PDF du devis est joint à cet email. Vous pouvez également le consulter et l'accepter depuis votre portail.</p>
            <a href="${portalUrl}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:12px 24px;border-radius:8px;">Voir le portail →</a>
          </div>
          <p style="font-size:13px;color:#555;">Cordialement,<br/><strong>Ryan Deschuyteneer</strong></p>
        </div>`,
    })

    // Notif admin
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `Devis ${quoteNumber} envoyé à ${clientName}`,
      attachments: [{
        filename: `${quoteNumber}.pdf`,
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      }],
      html: `<p style="font-family:sans-serif;font-size:14px;">Devis <strong>${quoteNumber}</strong> envoyé à ${clientName} (${clientEmail}).<br/>Total TTC : <strong>${total.toFixed(2)} €</strong></p>`,
    })

    return NextResponse.json({ success: true, quoteId: quoteRef.id, quoteNumber })
  } catch (error) {
    console.error("Quote API error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}