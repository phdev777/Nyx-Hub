import { MotionConfig } from 'motion/react'
import { Header, Hero, StackStrip } from './sections/Top.jsx'
import { Faq, Fit, Problem, Process, Projects, Services } from './sections/Body.jsx'
import { Contact, Footer } from './sections/Bottom.jsx'
import { Showcase } from './sections/Showcase.jsx'

export default function App() {
  return (
    // "user": quem pede menos movimento no sistema vê só os fades, sem deslocamento.
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-nyx focus:px-4 focus:py-2">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <StackStrip />
        <Problem />
        <Services />
        <Projects />
        <Showcase />
        <Process />
        <Fit />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
