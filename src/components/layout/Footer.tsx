import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#FBFAF8]">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[13px] text-neutral-500">
        <p>© {new Date().getFullYear()} Ryan Deschuyteneer · Soignies, Belgique</p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/ryansdee"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ryan-deschuyteneer-2b1395201/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
          >
            LinkedIn
          </a>
          <Link href="#contact" className="hover:text-neutral-900 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}