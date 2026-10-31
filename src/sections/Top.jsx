import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Check, Menu, X } from 'lucide-react'
import { demoPanel, hero, nav, stack } from '../content.js'
import { Button, Logo, whatsappHref } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-200 ${scrolled || open ? 'border-b border-alice/10 bg-night/80 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#topo" aria-label="Nyx Hub, início"><Logo /></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-alice/70 transition-colors duration-150 hover:text-alice">{item.label}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href={whatsappHref()} className="min-h-10 px-5 text-sm">Falar com a gente</Button>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-alice md:hidden"
          aria-expanded={open}
          aria-controls="menu-celular"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-celular"
            aria-label="Principal"
            className="border-t border-alice/10 px-4 pb-6 md:hidden"
            initial={{ opacity: 0, transform: 'translateY(-8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-8px)' }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-alice/5 text-base text-alice/80">{item.label}</a>
            ))}
            <Button href={whatsappHref()} className="mt-5 w-full" onClick={() => setOpen(false)}>Falar com a gente</Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
      <div className="glow-bottom pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.p
            className="inline-flex items-center gap-2 rounded-full border border-alice/10 bg-alice/5 px-3 py-1.5 text-xs font-medium text-alice/75"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-nyx-light" aria-hidden="true" />
            {hero.eyebrow}
          </motion.p>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">
            {hero.title.map((line, i) => (
              <motion.span
                key={line}
                className={`block ${i === hero.title.length - 1 ? 'text-nyx-light' : ''}`}
                initial={{ opacity: 0, transform: 'translateY(18px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.08 + i * 0.07 }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-alice/65"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
          >
            {hero.text}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
          >
            <Button href={whatsappHref()}>{hero.primary}<ArrowRight size={18} aria-hidden="true" /></Button>
            <Button href="#projetos" variant="ghost">{hero.secondary}</Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(24px) scale(0.98)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.25 }}
        >
          <DemoPanel />
        </motion.div>
      </div>
    </section>
  )
}

// Painel ilustrativo: as linhas vão de "pendente" para "feito", uma por vez, em ciclo.
function DemoPanel() {
  const [done, setDone] = useState(0)
  const total = demoPanel.rows.length

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(total); return }
    const id = setInterval(() => setDone((d) => (d >= total + 2 ? 0 : d + 1)), 1100)
    return () => clearInterval(id)
  }, [total])

  const finished = Math.min(done, total)

  return (
    <figure className="relative rounded-3xl border border-alice/10 bg-prussian/70 p-5 shadow-[0_40px_120px_-40px_rgb(24_93_241/0.6)] backdrop-blur-sm sm:p-6">
      <figcaption className="flex items-center justify-between">
        <span className="text-sm font-semibold">{demoPanel.title}</span>
        <span className="rounded-full bg-alice/5 px-2.5 py-1 font-mono text-[0.7rem] text-alice/50">demonstração</span>
      </figcaption>
      <ul className="mt-5 space-y-2.5" aria-label="Exemplo de tarefas automatizadas">
        {demoPanel.rows.map((row, i) => {
          const ok = i < finished
          return (
            <li key={row.label} className="flex items-center justify-between gap-3 rounded-2xl border border-alice/5 bg-night/60 px-4 py-3.5">
              <span className="text-sm text-alice/85">{row.label}</span>
              <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${ok ? 'bg-nyx/20 text-nyx-light' : 'bg-alice/5 text-alice/45'}`}>
                {ok ? <Check size={13} aria-hidden="true" /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-alice/40 motion-reduce:animate-none" aria-hidden="true" />}
                {ok ? row.done : row.pending}
              </span>
            </li>
          )
        })}
      </ul>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-alice/10 pt-4">
        <span className="text-xs text-alice/50">{demoPanel.footer}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-alice">{finished}/{total}</span>
      </div>
    </figure>
  )
}

export function StackStrip() {
  const [paused, setPaused] = useState(false)
  const items = [...stack, ...stack]
  return (
    <section aria-label="Tecnologias e integrações" className="border-y border-alice/10 bg-prussian/30">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6">
        <p className="hidden shrink-0 py-5 text-xs uppercase tracking-[0.16em] text-alice/40 sm:block">Trabalhamos com</p>
        <div className="marquee relative flex-1 overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]" data-paused={paused}>
          <ul className="marquee-track flex w-max gap-10">
            {items.map((item, i) => (
              <li key={`${item}-${i}`} aria-hidden={i >= stack.length} className="whitespace-nowrap text-sm font-medium text-alice/55">{item}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={() => setPaused((p) => !p)} className="shrink-0 rounded-full px-3 py-2 text-xs text-alice/45 hover:text-alice/80">
          {paused ? 'Continuar' : 'Pausar'}<span className="sr-only"> faixa de tecnologias</span>
        </button>
      </div>
    </section>
  )
}
