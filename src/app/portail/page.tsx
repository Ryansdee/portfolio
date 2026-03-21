import { Suspense } from "react"
import PortailContent from "./PortailContent"
import { Loader2 } from "lucide-react"

export default function PortailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <Loader2 size={20} className="text-neutral-400 animate-spin" />
        </div>
      }
    >
      <PortailContent />
    </Suspense>
  )
}