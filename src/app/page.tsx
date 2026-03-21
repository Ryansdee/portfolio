"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Hero from "@/components/sections/Hero"
import Expertise from "@/components/sections/Expertise"
import Projects from "@/components/sections/Projects"
import Pricing from "@/components/sections/Pricing"
import Contact from "@/components/sections/Contact"

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState("")

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName)
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main>
      <Navbar />
      <Hero />
      <Expertise />
      <Projects />
      <Pricing onSelectPlan={handleSelectPlan} />
      <Contact defaultPlan={selectedPlan} />
      <Footer />
    </main>
  )
}