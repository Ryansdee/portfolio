import { NextRequest, NextResponse } from "next/server"
import { adminDb as db } from "@/lib/firebase-admin"
import { generateQuotePdf } from "@/lib/generate-quote-pdf" // extrait ta fonction dans un fichier séparé

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token   = searchParams.get("token")
  const quoteId = searchParams.get("quoteId")

  if (!token || !quoteId) return NextResponse.json({ error: "Params manquants" }, { status: 400 })

  const doc = await db.collection("quotes").doc(quoteId).get()
  if (!doc.exists || doc.data()?.token !== token)
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  const data = doc.data()!
  const pdfBytes = await generateQuotePdf({
      ...data, quoteNumber: data.quoteNumber,
      clientName: "",
      clientEmail: "",
      items: [],
      subtotal: 0,
      vatAmount: 0,
      total: 0
  })

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${data.quoteNumber}.pdf"`,
    },
  })
}