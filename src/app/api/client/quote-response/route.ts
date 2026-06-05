import { NextRequest, NextResponse } from "next/server"
import { adminDb as db } from "@/lib/firebase-admin"

export async function POST(req: NextRequest) {
  const { token, quoteId, action } = await req.json()
  if (!token || !quoteId || !["accept", "refuse"].includes(action))
    return NextResponse.json({ error: "Params invalides" }, { status: 400 })

  const doc = await db.collection("quotes").doc(quoteId).get()
  if (!doc.exists || doc.data()?.token !== token)
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  await db.collection("quotes").doc(quoteId).update({
    status: action === "accept" ? "accepted" : "refused",
    respondedAt: new Date(),
  })

  if (action === "accept") {
    await db.collection("contact_requests").doc(doc.data()!.requestId).update({
      status: "done",
    })
  }

  return NextResponse.json({ success: true })
}