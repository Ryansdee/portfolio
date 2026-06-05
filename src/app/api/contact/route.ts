import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { generateToken } from "@/lib/token"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, service, description } = body

    if (!firstName || !lastName || !email || !service || !description) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
    }

    const token = generateToken()
    const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/portail?token=${token}`

    // Sauvegarde Firestore
    await addDoc(collection(db, "contact_requests"), {
      firstName,
      lastName,
      email,
      service,
      description,
      status: "new",
      token,
      adminReply: "",
      createdAt: serverTimestamp(),
    })

    // Notification admin
    await transporter.sendMail({
      from: `"Portfolio" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `Nouvelle demande — ${service} — ${firstName} ${lastName}`,
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999;">
              Nouvelle demande de devis
            </span>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:10px 0;color:#999;font-size:13px;width:130px;">Nom</td>
              <td style="padding:10px 0;color:#111;font-size:13px;font-weight:500;">${firstName} ${lastName}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:10px 0;color:#999;font-size:13px;">Email</td>
              <td style="padding:10px 0;color:#111;font-size:13px;">${email}</td>
            </tr>
            <tr style="border-bottom:1px solid #f5f5f5;">
              <td style="padding:10px 0;color:#999;font-size:13px;">Service</td>
              <td style="padding:10px 0;color:#111;font-size:13px;">${service}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#999;font-size:13px;vertical-align:top;">Description</td>
              <td style="padding:10px 0;color:#111;font-size:13px;line-height:1.6;">${description}</td>
            </tr>
          </table>

          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin"
             style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:500;padding:10px 20px;border-radius:6px;">
            Voir dans l'admin →
          </a>
        </div>
      `,
    })

    // Confirmation client
    await transporter.sendMail({
      from: `"Ryan Deschuyteneer" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `Demande reçue — accédez à votre espace client`,
      html: `
        <div style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
          <div style="margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid #f0f0f0;">
            <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999;">
              Ryan Deschuyteneer · Développeur Web & IT
            </span>
          </div>

          <h2 style="font-size:20px;font-weight:600;color:#111;margin-bottom:8px;letter-spacing:-0.02em;">
            Bonjour ${firstName},
          </h2>
          <p style="color:#666;font-size:14px;line-height:1.7;margin-bottom:24px;">
            Merci pour votre demande concernant <strong style="color:#111;">${service}</strong>.
            Je l'ai bien reçue et vous recontacte sous 24h avec une estimation personnalisée.
          </p>

          <div style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:20px;margin-bottom:24px;">
            <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#999;margin-bottom:8px;">
              Votre espace client
            </p>
            <p style="font-size:13px;color:#555;line-height:1.6;margin-bottom:16px;">
              Suivez l'avancement de votre demande en temps réel — statut, réponse et informations complémentaires.
            </p>
            <a href="${portalUrl}"
               style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;font-weight:500;padding:12px 24px;border-radius:6px;">
              Accéder à mon espace →
            </a>
          </div>

          <p style="color:#aaa;font-size:12px;line-height:1.6;">
            Ce lien est personnel et sécurisé. Conservez cet email pour y accéder à tout moment.<br/>
            En cas de question : <a href="mailto:${process.env.MAIL_USER}" style="color:#111;">${process.env.MAIL_USER}</a>
          </p>

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
    console.error("Contact API error:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}