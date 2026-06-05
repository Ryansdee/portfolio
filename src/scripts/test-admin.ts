import { config } from "dotenv"
import path from "path"

config({ path: path.resolve(process.cwd(), ".env.local") })

const key = process.env.FIREBASE_PRIVATE_KEY ?? ""
console.log("Length:", key.length)
console.log("Starts with:", key.slice(0, 40))
console.log("Ends with:", key.slice(-40))
console.log("Newlines count:", (key.match(/\n/g) ?? []).length)
console.log("Escaped newlines:", (key.match(/\\n/g) ?? []).length)