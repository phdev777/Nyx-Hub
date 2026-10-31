import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Building2, Check, Factory, FileCheck2, Globe, Hammer, MessageCircle, MessagesSquare, Plus, Rocket, Sparkles } from 'lucide-react'
import { faq, fit, problem, process, projects, services } from '../content.js'
import { Button, Reveal, Section, SectionHead, contactLabel, trackPointer, whatsappHref } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function Problem() {
  return (
    <Section id="problema">
      <SectionHead {...problem} />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {problem.points.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06} className="spotlight rounded-3xl border border-alice/10 bg-prussian/40 p-6 transition-colors duration-200" onPointerMove={trackPointer}>
            <p className="font-mono text-xs text-alice/60" aria-hidden="true">0{i + 1}</p>
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
          <Reveal as="li" key={s.name} delay={i * 0.06} className="spotlight flex flex-col overflow-hidden rounded-3xl border border-alice/10 bg-prussian/40 p-6 transition-colors duration-200" onPointerMove={trackPointer}>
            <span className="w-fit rounded-full bg-nyx/15 px-2.5 py-1 text-xs font-medium text-nyx-light">{s.tag}</span>
            <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">{s.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-alice/60">{s.text}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}

// Ícone de cada exemplo sem foto (o de mineração tem a foto do tablet).
const PROJETO_ICONE = { usina: Factory, portal: Building2, site: Globe }

// Exemplos: o primeiro, com foto, ocupa a linha inteira; os outros três ficam lado a lado, todos da mesma altura.
export function Projects() {
  return (
    <Section id="projetos" className="overflow-hidden">
      <div className="glow-bottom pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-60" aria-hidden="true" />
      <div className="relative">
        <SectionHead {...projects} />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {projects.items.map((p, i) => {
            const destaque = Boolean(p.image)
            const Icone = PROJETO_ICONE[p.icon]
            return (
              <Reveal
                as="article"
                key={p.name}
                delay={i * 0.06}
                onPointerMove={trackPointer}
                className={`spotlight flex flex-col overflow-hidden rounded-3xl border border-alice/10 bg-night/85 transition-colors duration-200 ${destaque ? 'lg:col-span-3 lg:grid lg:grid-cols-2' : ''}`}
              >
                {destaque && (
                  <figure className="relative aspect-[4/3] overflow-hidden border-b border-alice/10 lg:aspect-auto lg:min-h-[26rem] lg:border-r lg:border-b-0">
                    <img src={p.image.src} alt={p.image.alt} loading="lazy" decoding="async" width="1000" height="1333" className="h-full w-full object-cover object-[50%_45%] lg:absolute lg:inset-0" />
                  </figure>
                )}
                <div className={`flex flex-1 flex-col p-6 ${destaque ? 'sm:p-8 lg:justify-center lg:p-10' : ''}`}>
                  <div className="flex items-center gap-3">
                    {Icone && (
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-nyx/30 bg-nyx/10 text-nyx-light" aria-hidden="true">
                        <Icone size={18} />
                      </span>
                    )}
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-nyx-light">{p.kind}</span>
                  </div>
                  <h3 className={`mt-5 font-semibold tracking-[-0.02em] ${destaque ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>{p.name}</h3>
                  <dl className="mt-6 grid gap-3 text-sm leading-relaxed">
                    <div className="rounded-2xl border border-alice/10 bg-alice/[0.03] p-4">
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-alice/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-300" aria-hidden="true" />Antes
                      </dt>
                      <dd className="mt-1.5 text-alice/75">{p.problem}</dd>
                    </div>
                    <div className="rounded-2xl border border-nyx/30 bg-nyx/[0.08] p-4">
                      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-nyx-light">
                        <span className="h-1.5 w-1.5 rounded-full bg-nyx-light" aria-hidden="true" />Depois
                      </dt>
                      <dd className="mt-1.5 text-alice/90">{p.solution}</dd>
                    </div>
                  </dl>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {p.facts.map((f) => (
                      <li key={f} className="inline-flex items-center gap-1.5 rounded-full border border-alice/10 px-3 py-1 text-xs text-alice/75">
                        <Check size={12} className="text-nyx-light" aria-hidden="true" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

const PASSO_ICONE = [MessagesSquare, FileCheck2, Hammer, Rocket]

// Linha do tempo: a linha enche conforme a seção passa pela tela e cada passo acende quando a linha chega nele.
// No computador a linha é horizontal, passando pelo centro dos ícones; no celular, trechos verticais ligam um passo ao outro.
export function Process() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const fillX = useTransform(scrollYProgress, (v) => `translateX(${(v - 1) * 100}%)`)
  const total = process.steps.length
  const [reached, setReached] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => setReached(Math.floor(v * (total - 1) + 0.02) + 1))
  const lit = reduce ? total : reached

  return (
    <Section id="como-funciona">
      <SectionHead {...process} />
      <ol ref={ref} className="relative mt-12 grid gap-4 md:grid-cols-4 md:gap-6">
        {/* Trilho do computador: enche junto com a rolagem. */}
        <div className="absolute inset-x-[calc((100%-4.5rem)/8)] top-6 hidden h-0.5 overflow-hidden rounded-full bg-alice/10 md:block" aria-hidden="true">
          <motion.div data-bar className="h-full w-full bg-gradient-to-r from-nyx to-nyx-light" style={{ transform: reduce ? 'translateX(0%)' : fillX }} />
        </div>

        {process.steps.map((s, i) => {
          const Icone = PASSO_ICONE[i]
          const on = i < lit
          return (
            <li key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:gap-0">
              {/* No celular, um trecho de linha liga este passo ao próximo e acende quando o próximo é alcançado. */}
              {i < total - 1 && (
                <span className="absolute -bottom-4 left-6 top-12 w-0.5 -translate-x-1/2 overflow-hidden bg-alice/10 md:hidden" aria-hidden="true">
                  <span className={`block h-full w-full bg-gradient-to-b from-nyx to-nyx-light transition-transform duration-500 ease-out ${i + 1 < lit ? 'translate-y-0' : '-translate-y-full'}`} />
                </span>
              )}
              <span
                className={`relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl border transition-[background-color,border-color,color,box-shadow] duration-300 ease-out ${on ? 'border-nyx bg-nyx text-alice shadow-[0_0_32px_-6px_rgb(24_93_241/0.9)]' : 'border-alice/10 bg-night text-alice/50'}`}
                aria-hidden="true"
              >
                <Icone size={20} />
              </span>
              <Reveal delay={i * 0.06} className="flex-1 rounded-3xl border border-alice/10 bg-night/70 p-5 md:mt-6 md:w-full md:p-6">
                <p className="font-mono text-xs text-nyx-light">Passo {i + 1} de {total}</p>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-alice/65">{s.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-alice/10 px-3 py-1 text-xs text-alice/75">
                  <Check size={12} className="text-nyx-light" aria-hidden="true" />{s.tag}
                </span>
              </Reveal>
            </li>
          )
        })}
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
          <h3 className="font-semibold">O que você pode esperar</h3>
          <ul className="mt-5 space-y-3.5">
            {fit.espera.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-alice/80"><Sparkles size={18} className="mt-0.5 shrink-0 text-nyx-light" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}

// Perguntas: uma por cartão, com a aberta em destaque. O atalho para o WhatsApp fica abaixo do título no computador
// e depois da lista no celular, para quem não achou a resposta.
export function Faq() {
  const [open, setOpen] = useState(0)
  const base = useId()
  return (
    <Section id="perguntas">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:grid-rows-[auto_1fr] lg:gap-x-12 lg:gap-y-8">
        <SectionHead {...faq} />
        <ul className="grid content-start gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {faq.items.map((item, i) => {
            const isOpen = open === i
            const panelId = `${base}-p${i}`
            const buttonId = `${base}-b${i}`
            return (
              <li key={item.q} className={`rounded-2xl border transition-[background-color,border-color] duration-200 ease-out ${isOpen ? 'border-nyx/40 bg-prussian/50' : 'border-alice/10 bg-night/60 hover:border-alice/20'}`}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold transition-transform duration-150 ease-out active:scale-[0.99]"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {item.q}
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200 ease-out ${isOpen ? 'border-nyx bg-nyx text-alice' : 'border-alice/15 text-alice/70'}`}>
                      <Plus size={16} aria-hidden="true" className={`transition-transform duration-200 ease-out ${isOpen ? 'rotate-45' : ''}`} />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT }}
                    >
                      <p className="px-5 pb-5 pr-14 text-sm leading-relaxed text-alice/75">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
        <Reveal className="rounded-3xl border border-alice/10 bg-prussian/40 p-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-nyx/30 bg-nyx/10 text-nyx-light" aria-hidden="true">
            <MessageCircle size={18} />
          </span>
          <p className="mt-4 text-lg font-semibold">{faq.ajuda.titulo}</p>
          <p className="mt-1 text-sm leading-relaxed text-alice/65">{faq.ajuda.texto}</p>
          <Button href={whatsappHref(faq.ajuda.mensagem)} className="mt-5">{contactLabel()}</Button>
        </Reveal>
      </div>
    </Section>
  )
}
