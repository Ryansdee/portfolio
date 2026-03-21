import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { requestId, reply, clientEmail, clientName, plan, token } = await req.json()

    if (!requestId || !reply) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 })
    }

    const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${token}`

    // Mise à jour Firestore
    await updateDoc(doc(db, "contact_requests", requestId), {
      adminReply: reply,
      adminReplyAt: new Date().toISOString(),
      status: "quote_sent",
    })

    // Email au client
    await transporter.sendMail({
      from: `"Ryan Deschuyteneer" <${process.env.MAIL_USER}>`,
      to: clientEmail,
      subject: `Réponse à votre demande — ${plan}`,
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999;">
              Ryan Deschuyteneer · Développeur Web & IT
            </span>
          </div>

          <h2 style="font-size:20px;font-weight:600;color:#111;margin-bottom:8px;letter-spacing:-0.02em;">
            Bonjour ${clientName},
          </h2>
          <p style="color:#666;font-size:14px;line-height:1.7;margin-bottom:20px;">
            J'ai bien examiné votre demande concernant <strong style="color:#111;">${plan}</strong>
            et voici ma réponse :
          </p>

          <div style="background:#f9f9f9;border-left:3px solid #111;padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:24px;">
            <p style="font-size:14px;color:#333;line-height:1.7;white-space:pre-wrap;margin:0;">${reply}</p>
          </div>

          <a href="${portalUrl}"
             style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:500;padding:12px 24px;border-radius:6px;margin-bottom:24px;">
            Voir dans mon espace client →
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #f0f0f0;">
            <p style="font-size:13px;color:#555;">
              À très bientôt,<br/>
              <strong style="color:#111;">Ryan Deschuyteneer</strong><br/>
              <span style="color:#999;font-size:12px;">Développeur Web & IT — Belgique</span>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reply API error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}