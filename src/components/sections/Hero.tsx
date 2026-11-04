import Link from "next/link"

<<<<<<< HEAD
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
=======
const stats = [
  { label: "Statut", value: "Disponible", live: true },
  { label: "Localisation", value: "Belgique" },
  { label: "Activité", value: "Freelance depuis 2022" },
  { label: "Stack principal", value: "Next.js / Firebase / Tailwind" },
  { label: "Projets livrés", value: "12+" },
  { label: "Délai de réponse", value: "Sous 24 h" },
]

const stack = [
  "TypeScript", "React", "Next.js", "Tailwind CSS", "Firebase",
  "Stripe", "Framer Motion", "React Native", "Nodemailer", "Linux",
]

export default function Hero() {
  return (
    <section className="bg-[#FBFAF8] border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Texte */}
        <div>
          <p className="text-[14px] text-neutral-500 mb-6">
            Développeur web &amp; IT, basé en Belgique
          </p>

          <h1 className="font-serif text-[44px] sm:text-[60px] leading-[1.05] tracking-tight text-neutral-900 mb-6">
            Interfaces robustes, solutions durables.
          </h1>

          <p className="text-[16px] leading-relaxed text-neutral-600 max-w-md mb-9">
            Je conçois et développe des applications web full-stack pour des
            clients en Belgique et à distance — du site vitrine au SaaS complet.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#projets"
              className="text-[14px] font-medium bg-neutral-900 text-white px-6 py-3 rounded-md transition-colors hover:bg-neutral-700 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBFAF8]"
            >
              Voir les projets
            </Link>
            <Link
              href="#contact"
              className="text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 transition-colors hover:text-neutral-500 hover:border-neutral-400 outline-none focus-visible:text-neutral-500"
            >
              Me contacter
            </Link>
          </div>
        </div>

        {/* Panneau infos */}
        <div className="w-full bg-white border border-neutral-200 rounded-xl overflow-hidden">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex justify-between items-center gap-4 px-5 py-4 border-b border-neutral-100 last:border-0"
            >
              <span className="text-[14px] text-neutral-500">{stat.label}</span>

              {stat.live ? (
                <span className="flex items-center gap-2 text-[14px] font-medium text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {stat.value}
                </span>
              ) : (
                <span className="text-[14px] font-medium text-neutral-900 text-right">
                  {stat.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bandeau technologies */}
      <div className="border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-neutral-500">
          {stack.map((tech, i) => (
            <span key={tech} className="flex items-center gap-x-3">
              {i > 0 && <span className="text-neutral-300">/</span>}
              {tech}
            </span>
>>>>>>> ba7bb876857a71280f0bb742c56cbc052bec7cca
          ))}
        </dl>
      </div>
    </section>
  )
}