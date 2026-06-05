import admin from "firebase-admin"
import { readFileSync } from "fs"
import path from "path"

if (!admin.apps.length) {
  // Prod (Netlify) : variable d'env base64
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64").toString("utf8")
    )
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }
  // Dev local : fichier JSON
  else {
    const serviceAccount = JSON.parse(
      readFileSync(path.resolve(process.cwd(), "serviceAccountKey.json"), "utf8")
    )
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  }
}

export const adminDb = admin.firestore()