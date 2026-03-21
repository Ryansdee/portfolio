import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { token, content } = await req.json()

    if (!token || !content?.trim()) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    // Trouver la demande par token
    const q = query(
      collection(db, "contact_requests"),
      where("token", "==", token)
    )
    const snap = await getDocs(q)

    if (snap.empty) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 })
    }

    const docRef = snap.docs[0]
    const data = docRef.data()

    const newMessage = {
      content: content.trim(),
      sentAt: new Date().toISOString(),
    }

    // Ajouter le message dans le tableau clientMessages
    await updateDoc(doc(db, "contact_requests", docRef.id), {
      clientMessages: arrayUnion(newMessage),
    })

    // Notifier Ryan par email
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `💬 Nouveau message client — ${data.firstName} ${data.lastName}`,
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999;">
              Message client — Portail
            </span>
          </div>
          <p style="color:#666;font-size:14px;margin-bottom:16px;">
            <strong style="color:#111;">${data.firstName} ${data.lastName}</strong>
            vous a envoyé un message depuis son espace client :
          </p>
          <div style="background:#f9f9f9;border-left:3px solid #111;padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:24px;">
            <p style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;margin:0;">${content}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin"
             style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:500;padding:10px 20px;border-radius:6px;">
            Répondre depuis l'admin →
          </a>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: newMessage })
  } catch (error) {
    console.error("Client message error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}