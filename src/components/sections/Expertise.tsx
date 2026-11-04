<<<<<<< HEAD
const services = [
  {
    title: "Sites vitrines",
=======
import { Monitor, Server, Cpu, Smartphone } from "lucide-react"
import { type ElementType } from "react"

type Service = {
  icon: ElementType
  title: string
  description: string
  tags: string[]
}

const services: Service[] = [
  {
    icon: Monitor,
    title: "Développement frontend",
>>>>>>> ba7bb876857a71280f0bb742c56cbc052bec7cca
    description:
      "Pour un indépendant, un commerce ou un cabinet. Un site rapide, clair, que vous pouvez mettre à jour vous-même.",
  },
  {
<<<<<<< HEAD
    title: "Applications web sur mesure",
    description:
      "Réservations, espace client, paiements, tableau de bord. Quand un site ne suffit plus et qu'il faut un vrai outil.",
  },
  {
    title: "Applications mobiles",
=======
    icon: Server,
    title: "Backend & base de données",
    description:
      "Architecture serverless, authentification, stockage et paiements en ligne. Des solutions qui montent en charge, adaptées à chaque projet.",
    tags: ["Firebase", "Node.js", "Flask", "Stripe"],
  },
  {
    icon: Cpu,
    title: "Technicien IT",
>>>>>>> ba7bb876857a71280f0bb742c56cbc052bec7cca
    description:
      "Une application iOS et Android à partir d'une même base de code, jusqu'à la publication sur les stores.",
  },
  {
<<<<<<< HEAD
    title: "Suivi après la mise en ligne",
=======
    icon: Smartphone,
    title: "Applications mobile",
>>>>>>> ba7bb876857a71280f0bb742c56cbc052bec7cca
    description:
      "Corrections, petites évolutions, hébergement. Vous savez à qui écrire quand quelque chose doit changer.",
  },
]

export default function Expertise() {
  return (
<<<<<<< HEAD
    <section id="services" className="border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <header className="lg:col-span-4">
          <h2 className="font-serif text-[34px] sm:text-[42px] leading-none tracking-tight text-neutral-900 mb-5">
            Ce que je fais
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[34ch]">
            Chaque projet commence par une discussion et un devis gratuit. Pas de
            formule toute faite, le prix dépend de ce dont vous avez besoin.
          </p>
        </header>

        <dl className="lg:col-span-8 border-t border-neutral-200">
          {services.map((s) => (
            <div
              key={s.title}
              className="grid grid-cols-1 sm:grid-cols-8 gap-2 sm:gap-6 py-6 border-b border-neutral-200"
            >
              <dt className="sm:col-span-3 text-[16px] text-neutral-900">{s.title}</dt>
              <dd className="sm:col-span-5 text-[15px] leading-relaxed text-neutral-600">
                {s.description}
              </dd>
            </div>
          ))}
        </dl>
=======
    <section id="expertise" className="bg-[#FBFAF8] border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* En-tête */}
        <header className="max-w-2xl mb-16 sm:mb-20">
          <h2 className="font-serif text-[40px] sm:text-[52px] leading-none tracking-tight text-neutral-900 mb-5">
            Expertise
          </h2>
          <p className="text-[16px] leading-relaxed text-neutral-600">
            Du frontend au support technique, un même interlocuteur pour concevoir,
            construire et maintenir vos projets.
          </p>
        </header>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="p-8 sm:p-10 border-t border-neutral-200 sm:odd:border-r sm:odd:border-neutral-200"
              >
                <Icon size={22} strokeWidth={1.5} className="text-neutral-400 mb-6" />

                <h3 className="font-serif text-[22px] leading-tight text-neutral-900 mb-3">
                  {s.title}
                </h3>

                <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[44ch] mb-6">
                  {s.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-neutral-400">
                  {s.tags.map((tag, i) => (
                    <span key={tag} className="flex items-center gap-x-2.5">
                      {i > 0 && <span className="text-neutral-300">/</span>}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
>>>>>>> ba7bb876857a71280f0bb742c56cbc052bec7cca
      </div>
    </section>
  )
}