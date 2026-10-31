import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check, Menu, X } from 'lucide-react'
import { demoPanel, hero, nav, stack } from '../content.js'
import { Button, Logo, Stars, contactLabel, whatsappHref } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const toggle = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Menu do celular aberto: Esc fecha (e devolve o foco ao botão) e a página atrás não rola.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus() } }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ${scrolled || open ? 'border-b border-alice/10 bg-night/80 backdrop-blur-md' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#topo" className="shrink-0"><Logo /><span className="sr-only">, início</span></a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-alice/70 transition-colors duration-150 hover:text-alice">{item.label}</a>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button href={whatsappHref()} className="min-h-10 px-5 text-sm">{contactLabel()}</Button>
        </div>
        <button
          ref={toggle}
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
            className="max-h-[calc(100svh-4rem)] overflow-y-auto overscroll-contain border-t border-alice/10 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:hidden"
            initial={{ opacity: 0, transform: 'translateY(-8px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-4px)', transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center border-b border-alice/5 text-base text-alice/80">{item.label}</a>
            ))}
            <Button href={whatsappHref()} className="mt-5 w-full" onClick={() => setOpen(false)}>{contactLabel()}</Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40">
      <div className="glow-bottom glow-breathe pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />
      <Stars />
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
            {/* Cada linha sobe de trás de uma máscara. Sem fade: o título conta como conteúdo visível desde o início. */}
            {hero.title.map((line, i) => (
              <span key={line} className="-my-[0.12em] block overflow-hidden py-[0.12em]">
                <motion.span
                  className={`block ${i === hero.title.length - 1 ? 'text-nyx-light' : ''}`}
                  initial={{ transform: 'translateY(105%)' }}
                  animate={{ transform: 'translateY(0%)' }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.08 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-alice/70"
            initial={{ opacity: 0.001 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
          >
            {hero.text}
          </motion.p>
          <motion.div
            className="mt-9 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
          >
            <Button href={whatsappHref()}>{hero.primary}<ArrowRight size={18} className="nudge" aria-hidden="true" /></Button>
            <Button href="#projetos" variant="ghost">{hero.secondary}</Button>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(24px) scale(0.97)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.3 }}
        >
          <Parallax><DemoPanel /></Parallax>
        </motion.div>
      </div>
    </section>
  )
}

// O painel sobe um pouco mais devagar que a página ao rolar (profundidade). Desligado com menos movimento.
function Parallax({ children }) {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const transform = useTransform(scrollY, [0, 700], ['translateY(0px)', 'translateY(-48px)'])
  return <motion.div style={reduce ? undefined : { transform }}>{children}</motion.div>
}

// Painel ilustrativo: as linhas vão de "pendente" para "feito", uma por vez, em ciclo.
// Só anima enquanto está na tela.
function DemoPanel() {
  const ref = useRef(null)
  const visible = useInView(ref)
  const [done, setDone] = useState(0)
  const total = demoPanel.rows.length

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setDone(total); return }
    if (!visible) return
    const id = setInterval(() => setDone((d) => (d >= total + 2 ? 0 : d + 1)), 1100)
    return () => clearInterval(id)
  }, [total, visible])

  const finished = Math.min(done, total)

  return (
    <figure ref={ref} className="relative rounded-3xl border border-alice/10 bg-prussian/85 p-5 shadow-[0_40px_120px_-40px_rgb(24_93_241/0.6)] sm:p-6">
      <figcaption className="flex items-center justify-between">
        <span className="flex items-center gap-3">
          <span className="flex shrink-0 items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/20" /><span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/20" /><span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/20" />
          </span>
          <span className="text-sm font-semibold">{demoPanel.title}</span>
        </span>
        <span className="rounded-full bg-alice/5 px-2.5 py-1 font-mono text-[0.7rem] text-alice/60">demonstração</span>
      </figcaption>
      <p className="sr-only">Exemplo de painel em que relatórios, pedidos, manutenções e o fechamento do dia são concluídos automaticamente.</p>
      <ul className="mt-5 space-y-2.5" aria-hidden="true">
        {demoPanel.rows.map((row, i) => {
          const ok = i < finished
          return (
            <li key={row.label} className="flex items-center justify-between gap-3 rounded-2xl border border-alice/5 bg-night/60 px-4 py-3.5">
              <span className="text-sm text-alice/85">{row.label}</span>
              <span className={`inline-grid shrink-0 overflow-hidden rounded-full text-xs font-medium transition-colors duration-300 ${ok ? 'bg-nyx/20 text-nyx-light' : 'bg-alice/5 text-alice/60'}`}>
                {/* Troca de estado: o rótulo antigo sai para cima e o novo entra por baixo. */}
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={ok ? 'ok' : 'wait'}
                    className="col-start-1 row-start-1 inline-flex items-center gap-1.5 px-2.5 py-1"
                    initial={{ opacity: 0, transform: 'translateY(60%)' }}
                    animate={{ opacity: 1, transform: 'translateY(0%)' }}
                    exit={{ opacity: 0, transform: 'translateY(-60%)' }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                  >
                    {ok ? <Check size={13} /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-alice/40 motion-reduce:animate-none" />}
                    {ok ? row.done : row.pending}
                  </motion.span>
                </AnimatePresence>
              </span>
            </li>
          )
        })}
      </ul>
      {/* A barra desliza dentro do trilho (translate), sem achatar as pontas arredondadas. */}
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-alice/5" aria-hidden="true">
        <div
          className="h-full rounded-full bg-gradient-to-r from-nyx to-nyx-light transition-transform duration-500 ease-out"
          data-bar style={{ transform: `translateX(${(finished / total - 1) * 100}%)` }}
        />
      </div>
      <div className="mt-4 flex items-center justify-between gap-3" aria-hidden="true">
        <span className="text-xs text-alice/60">{demoPanel.footer}</span>
        <span className="font-mono text-sm font-semibold tabular-nums text-alice">{finished}/{total}</span>
      </div>
    </figure>
  )
}

// Abaixo do hero: o que fazemos, só os nomes, em pílulas fixas (sem faixa rolando).
export function StackStrip() {
  return (
    <section aria-labelledby="o-que-fazemos" className="border-y border-alice/10 bg-prussian/30 px-4 py-8 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[17rem_1fr] lg:items-center lg:gap-10">
        <div>
          <h2 id="o-que-fazemos" className="text-xs font-semibold uppercase tracking-[0.16em] text-nyx-light">{stack.label}</h2>
          <p className="mt-2 text-pretty text-lg font-semibold leading-snug tracking-[-0.02em]">{stack.text}</p>
        </div>
        <ul className="flex flex-wrap gap-2.5 sm:gap-3">
          {stack.items.map((item) => (
            <li key={item} className="inline-flex min-h-11 items-center gap-2.5 rounded-2xl border border-alice/10 bg-night/60 px-4 text-sm font-semibold text-alice/90">
              <span className="h-2 w-2 rounded-full bg-nyx-light" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
