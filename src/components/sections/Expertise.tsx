const services = [
  {
    num: "01",
    title: "Développement Frontend",
    description:
      "Interfaces modernes, performantes et animées. De la landing page au SaaS complet, avec une attention particulière au design et à l'UX.",
    tags: "React · Next.js · Tailwind · Framer Motion",
  },
  {
    num: "02",
    title: "Backend & Base de données",
    description:
      "Architecture serverless, authentification, stockage et paiements en ligne. Solutions scalables adaptées à chaque projet.",
    tags: "Firebase · Node.js · Flask · Stripe",
  },
  {
    num: "03",
    title: "Technicien IT",
    description:
      "Maintenance, déploiement, configuration réseau et support technique. Une approche pragmatique pour garder votre infrastructure opérationnelle.",
    tags: "Réseaux · Matériel · Linux · Support",
  },
  {
    num: "04",
    title: "Mobile",
    description:
      "Applications cross-platform avec une expérience native. Du prototype au déploiement sur les stores, un accompagnement complet.",
    tags: "React Native · Expo · iOS · Android",
  },
]

export default function Expertise() {
  return (
    <section id="expertise" className="border-b border-neutral-200">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-b border-neutral-100">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Expertise
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-neutral-100">
          {services.map((s) => (
            <div
              key={s.num}
              className="p-7 hover:bg-neutral-50 transition-colors duration-150 group"
            >
              <span className="text-xs font-mono text-neutral-300 mb-4 block">
                {s.num}
              </span>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2 tracking-tight">
                {s.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-4">
                {s.description}
              </p>
              <span className="text-xs text-neutral-400 font-mono">
                {s.tags}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}