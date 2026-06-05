import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { adminDb as db } from "@/lib/firebase-admin"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
})

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 })

    // Cherche la demande la plus récente pour cet email
    const snap = await db
      .collection("contact_requests")
      .where("email", "==", email.toLowerCase())
      .orderBy("createdAt", "desc")
      .limit(1)
      .get()

    if (snap.empty) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const data = snap.docs[0].data()
    const { token, firstName } = data
    const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${token}`

    await transporter.sendMail({
      from: `"Ryan Deschuyteneer" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Votre lien d'accès — Espace client",
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="margin-bottom:28px;">
            <div style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#999;margin-bottom:6px;">
              Ryan Deschuyteneer · Développeur Web & IT
            </div>
            <div style="font-size:20px;font-weight:700;color:#111;">Votre espace client</div>
          </div>
          <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:28px;">
            Bonjour ${firstName},<br/><br/>
            Voici votre lien d'accès personnel pour consulter l'état de votre demande et votre devis.
          </p>
          <a href="${portalUrl}"
            style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:14px 28px;border-radius:10px;margin-bottom:28px;">
            Accéder à mon espace →
          </a>
          <p style="font-size:12px;color:#aaa;line-height:1.6;">
            Ce lien est personnel et vous donne accès à votre espace privé.<br/>
            Ne le partagez pas.
          </p>
          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #F0F0F0;">
            <p style="font-size:13px;color:#555;">
              Cordialement,<br/>
              <strong style="color:#111;">Ryan Deschuyteneer</strong>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Resend portal error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}