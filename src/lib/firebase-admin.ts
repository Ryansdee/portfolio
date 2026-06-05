import admin from "firebase-admin"

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64!, "base64").toString("utf8")
  )
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

export const adminDb = admin.firestore()