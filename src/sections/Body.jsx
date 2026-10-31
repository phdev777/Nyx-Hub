import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Minus, Plus, X } from 'lucide-react'
import { faq, fit, problem, process, projects, services } from '../content.js'
import { Reveal, Section, SectionHead } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function Problem() {
  return (
    <Section id="problema">
      <SectionHead {...problem} />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {problem.points.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="rounded-3xl border border-alice/10 bg-prussian/40 p-6">
            <p className="font-mono text-xs text-alice/35">0{i + 1}</p>
            <h3 className="mt-6 text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-alice/60">{p.text}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

export function Services() {
  return (
    <Section id="servicos">
      <SectionHead {...services} />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((s, i) => (
          <Reveal as="li" key={s.name} delay={i * 0.06} className="group relative flex flex-col overflow-hidden rounded-3xl border border-alice/10 bg-prussian/40 p-6 transition-colors duration-200 hover:border-nyx/50">
            <span className="w-fit rounded-full bg-nyx/15 px-2.5 py-1 text-xs font-medium text-nyx-light">{s.tag}</span>
            <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-alice/60">{s.text}</p>
            <span className="mt-auto pt-8 font-mono text-xs text-alice/30">Degrau {i + 1} de {services.items.length}</span>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

export function Projects() {
  return (
    <Section id="projetos" className="overflow-hidden">
      <div className="glow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-60" aria-hidden="true" />
      <div className="relative">
        <SectionHead {...projects} />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {projects.items.map((p, i) => (
            <Reveal as="article" key={p.name} delay={i * 0.06} className="flex flex-col overflow-hidden rounded-3xl border border-alice/10 bg-night/70 p-6 backdrop-blur-sm">
              {p.image && (
                <figure className="-mx-6 -mt-6 mb-6 aspect-[4/3] overflow-hidden border-b border-alice/10">
                  <img src={p.image.src} alt={p.image.alt} loading="lazy" decoding="async" width="1000" height="1333" className="h-full w-full object-cover object-[50%_45%]" />
                </figure>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-nyx-light">{p.kind}</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-alice/50"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />Em uso</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em]">{p.name}</h3>
              <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                <div><dt className="text-alice/40">Problema</dt><dd className="mt-1 text-alice/75">{p.problem}</dd></div>
                <div><dt className="text-alice/40">O que fizemos</dt><dd className="mt-1 text-alice/75">{p.solution}</dd></div>
              </dl>
              <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.facts.map((f) => <li key={f} className="rounded-full border border-alice/10 px-3 py-1 text-xs text-alice/70">{f}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Process() {
  return (
    <Section id="como-funciona">
      <SectionHead {...process} />
      <ol className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-alice/10 bg-alice/10 md:grid-cols-4">
        {process.steps.map((s, i) => (
          <Reveal as="li" key={s.title} delay={i * 0.06} className="bg-night p-6 sm:p-7">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-nyx text-sm font-bold">{i + 1}</span>
            <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-alice/60">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

export function Fit() {
  return (
    <Section id="pra-quem">
      <SectionHead {...fit} />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Reveal className="rounded-3xl border border-nyx/30 bg-nyx/[0.07] p-6 sm:p-8">
          <h3 className="font-semibold">É pra você</h3>
          <ul className="mt-5 space-y-3.5">
            {fit.yes.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-alice/80"><Check size={18} className="mt-0.5 shrink-0 text-nyx-light" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.06} className="rounded-3xl border border-alice/10 bg-prussian/30 p-6 sm:p-8">
          <h3 className="font-semibold text-alice/80">Provavelmente não é pra você</h3>
          <ul className="mt-5 space-y-3.5">
            {fit.no.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-alice/55"><X size={18} className="mt-0.5 shrink-0 text-alice/35" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  const base = useId()
  return (
    <Section id="perguntas">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHead {...faq} />
        <div className="divide-y divide-alice/10 border-y border-alice/10">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            const panelId = `${base}-p${i}`
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left text-base font-medium"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {item.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-alice/15 text-alice/70">
                      {isOpen ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                    >
                      <p className="pb-5 pr-12 text-sm leading-relaxed text-alice/65">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
