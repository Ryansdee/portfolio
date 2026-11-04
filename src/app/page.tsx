import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import Projects from "@/components/sections/Projects"
import Expertise from "@/components/sections/Expertise"
import Depannage from "@/components/sections/Depannage"
import Contact from "@/components/sections/Contact"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <Expertise />
      <Depannage />
      <Contact />
      <Footer />
    </main>
  )
}