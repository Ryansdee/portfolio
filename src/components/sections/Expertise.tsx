const services = [
  {
    title: "Sites vitrines",
    description:
      "Pour un indépendant, un commerce ou un cabinet. Un site rapide, clair, que vous pouvez mettre à jour vous-même.",
  },
  {
    title: "Applications web sur mesure",
    description:
      "Réservations, espace client, paiements, tableau de bord. Quand un site ne suffit plus et qu'il faut un vrai outil.",
  },
  {
    title: "Applications mobiles",
    description:
      "Une application iOS et Android à partir d'une même base de code, jusqu'à la publication sur les stores.",
  },
  {
    title: "Suivi après la mise en ligne",
    description:
      "Corrections, petites évolutions, hébergement. Vous savez à qui écrire quand quelque chose doit changer.",
  },
]

export default function Expertise() {
  return (
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
      </div>
    </section>
  )
}