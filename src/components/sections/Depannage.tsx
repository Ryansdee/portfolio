import Link from "next/link"

const interventions = [
  "PC lent, nettoyage et remise en état",
  "Pannes matérielles et système",
  "Installation de Windows, Linux et logiciels",
  "Mise à niveau (SSD, mémoire, carte graphique)",
  "Ordinateurs portables : écran, stockage, batterie",
  "Dépannage Mac",
  "Réseau et Wi-Fi à la maison",
  "Réparation de téléphones (Android, iPhone jusqu'au 12)",
]

export default function Depannage() {
  return (
    <section id="depannage" className="border-b border-neutral-200 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <header className="lg:col-span-4">
          <h2 className="font-serif text-[34px] sm:text-[42px] leading-none tracking-tight text-neutral-900 mb-5">
            Dépannage informatique
          </h2>
          <p className="text-[15px] leading-relaxed text-neutral-600 max-w-[34ch] mb-6">
            Je me déplace chez vous dans un rayon de 30 km autour de Soignies.
            J'ai un diplôme de technicien informatique et je fais ça à côté de mon
            activité de développeur.
          </p>
          <Link
            href="#contact"
            className="inline-block text-[14px] text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-500 hover:border-neutral-400 transition-colors"
          >
            Demander une intervention
          </Link>
        </header>

        <div className="lg:col-span-8">
          <ul className="grid grid-cols-1 sm:grid-cols-2 border-t border-neutral-200">
            {interventions.map((item) => (
              <li
                key={item}
                className="py-4 border-b border-neutral-200 text-[15px] text-neutral-700 sm:odd:pr-6"
              >
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[15px] leading-relaxed text-neutral-600 max-w-[60ch]">
            Sur demande, je m'occupe aussi de projets plus longs à la maison :
            stockage cloud personnel, caméras, alarme. On en parle avant, et vous
            recevez un devis.
          </p>
        </div>
      </div>
    </section>
  )
}