import Link from "next/link"

const facts = [
  { label: "Basé à", value: "Soignies, Belgique" },
  { label: "Freelance depuis", value: "2022" },
  { label: "Je travaille avec", value: "Next.js, TypeScript, Firebase" },
  { label: "Réponse", value: "Sous 24 h" },
]

export default function Hero() {
  return (
    <section className="border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <h1 className="font-serif text-[40px] sm:text-[56px] leading-[1.08] tracking-tight text-neutral-900 max-w-[18ch] mb-8">
          Je fais des sites et des applications web, et je dépanne des ordinateurs.
        </h1>

        <div className="max-w-[58ch] space-y-4 text-[17px] leading-relaxed text-neutral-600 mb-10">
          <p>
            Je m'appelle Ryan. Depuis 2022, je conçois et développe des sites pour
            des indépendants et des petites entreprises en Belgique : un institut de
            beauté à Ixelles, un photographe bruxellois, un cabinet d'architecture,
            une plateforme de jobs étudiants.
          </p>
          <p>
            Je m'occupe de tout, de la première maquette à la mise en ligne, et je
            reste votre seul interlocuteur. À côté, je dépanne les ordinateurs à
            domicile autour de Soignies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-16">
          <Link
            href="#contact"
            className="text-[15px] font-medium bg-neutral-900 text-white px-5 py-2.5 rounded-md hover:bg-neutral-700 transition-colors"
          >
            Parlons de votre projet
          </Link>
          <Link
            href="#projets"
            className="text-[15px] text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition-colors"
          >
            Voir mes projets
          </Link>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-8 pt-8 border-t border-neutral-200">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="text-[13px] text-neutral-500 mb-1">{f.label}</dt>
              <dd className="text-[15px] text-neutral-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}