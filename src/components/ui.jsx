import { motion } from 'motion/react'
import { contato } from '../content.js'

const EASE_OUT = [0.23, 1, 0.32, 1]

// Logo oficial recortada de brand/logo-banner.png (fundo transparente). Trocar por SVG quando houver o arquivo original.
export function Logo({ className = 'h-10' }) {
  return <img src="/logo-nyx-sm.png" alt="Nyx Hub" width="397" height="120" className={`w-auto ${className}`} />
}

// Lua crescente com a estrela de quatro pontas da marca.
export function LogoMark({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <mask id="nyx-moon">
        <rect width="64" height="64" fill="#fff" />
        <circle cx="47" cy="27" r="17" fill="#000" />
      </mask>
      <circle cx="30" cy="32" r="24" fill="currentColor" mask="url(#nyx-moon)" />
      <path d="M44 22.5l2 7.5 7.5 2-7.5 2-2 7.5-2-7.5-7.5-2 7.5-2z" fill="currentColor" />
    </svg>
  )
}

// Posição do cursor no próprio card (CSS var no elemento, sem re-render do React).
export function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

// Céu estrelado discreto, com posições fixas (mesmo desenho em toda visita).
const STARS = Array.from({ length: 42 }, (_, i) => {
  const r = (n) => ((Math.sin((i + 1) * n) * 10000) % 1 + 1) % 1
  return { left: r(12.9898) * 100, top: r(78.233) * 70, size: r(39.425) > 0.85 ? 2 : 1, d: 3 + r(4.1) * 5, delay: r(9.7) * 6 }
})
export function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {STARS.map((s, i) => (
        <span key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, '--d': `${s.d}s`, '--delay': `-${s.delay}s` }} />
      ))}
    </div>
  )
}

export function whatsappHref(message = 'Olá! Quero conversar sobre um projeto com a Nyx Hub.') {
  if (!contato.whatsapp) return '#contato'
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(message)}`
}

export function Button({ href, variant = 'primary', children, className = '', ...rest }) {
  const external = href?.startsWith('http')
  const styles = variant === 'primary'
    ? 'bg-nyx text-alice shadow-[0_8px_30px_-8px_rgb(24_93_241/0.7)] hover:bg-[#2a6bff]'
    : 'border border-alice/15 text-alice hover:border-alice/35 hover:bg-alice/5'
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] ${styles} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}

// Cabeçalho de seção no estilo editorial: "01 / O problema".
export function SectionHead({ index, label, title, text, align = 'left' }) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-nyx-light">
        {index} <span className="text-alice/30">/</span> {label}
      </p>
      <h2 className="mt-4 text-balance text-3xl font-bold tracking-[-0.03em] sm:text-[2.6rem] sm:leading-[1.08]">{title}</h2>
      {text && <p className="mt-4 text-pretty text-base leading-relaxed text-alice/65 sm:text-lg">{text}</p>}
    </Reveal>
  )
}

// Entrada ao rolar: sobe 16px e aparece, uma vez só.
export function Reveal({ children, delay = 0, className = '', as = 'div', ...rest }) {
  const Tag = motion[as]
  return (
    <Tag
      {...rest}
      className={className}
      initial={{ opacity: 0, transform: 'translateY(16px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  )
}

export function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative px-4 py-20 sm:px-6 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}
