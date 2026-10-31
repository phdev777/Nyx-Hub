import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { contato, finalCta, form as copy, nav } from '../content.js'
import { Logo, LogoMark, Reveal } from '../components/ui.jsx'

// Formulário curto: monta a mensagem e abre o WhatsApp (ou o e-mail). Não guarda nada em servidor.
export function Contact() {
  const [form, setForm] = useState({ nome: '', empresa: '', necessidade: '' })
  const [aviso, setAviso] = useState('')
  const set = (k) => (e) => { setAviso(''); setForm((f) => ({ ...f, [k]: e.target.value })) }
  const canal = contato.whatsapp ? 'whatsapp' : contato.email ? 'email' : null

  function enviar(e) {
    e.preventDefault()
    const nome = form.nome.trim()
    const empresa = form.empresa.trim()
    const necessidade = form.necessidade.trim()
    if (!nome || !necessidade) { setAviso(copy.vazio); return }
    const texto = `Olá! Sou ${nome}${empresa ? `, da ${empresa}` : ''}. Quero resolver: ${necessidade}`
    if (canal === 'whatsapp') {
      window.open(`https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    } else if (canal === 'email') {
      window.location.href = `mailto:${contato.email}?subject=${encodeURIComponent('Projeto com a Nyx Hub')}&body=${encodeURIComponent(texto)}`
    } else {
      setAviso(copy.semContato)
    }
  }

  const campo = 'mt-2 w-full rounded-2xl border border-alice/10 bg-night/70 px-4 py-3.5 text-base text-alice placeholder:text-alice/50 transition-colors duration-150 focus:border-nyx/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nyx-light'

  return (
    <section id="contato" className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="glow-bottom glow-breathe pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <LogoMark className="h-12 w-12 text-nyx-light" />
          <h2 className="mt-8 text-balance text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{finalCta.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-alice/65">{finalCta.text}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <form onSubmit={enviar} className="rounded-3xl border border-alice/10 bg-prussian/80 p-6 sm:p-8">
            <label className="block text-sm font-medium text-alice/80">{copy.nome}
              <input required name="nome" autoComplete="name" autoCapitalize="words" enterKeyHint="next" maxLength={80} value={form.nome} onChange={set('nome')} className={campo} />
            </label>
            <label className="mt-5 block text-sm font-medium text-alice/80">Empresa <span className="font-normal text-alice/60">(opcional)</span>
              <input name="empresa" autoComplete="organization" autoCapitalize="words" enterKeyHint="next" maxLength={80} value={form.empresa} onChange={set('empresa')} className={campo} />
            </label>
            <label className="mt-5 block text-sm font-medium text-alice/80">{copy.necessidade} <span className="font-normal text-alice/60">{copy.necessidadeAjuda}</span>
              <textarea required name="necessidade" rows={3} maxLength={500} autoCapitalize="sentences" enterKeyHint="send" value={form.necessidade} onChange={set('necessidade')} placeholder="Ex.: parar de montar o relatório da equipe à mão" className={`${campo} resize-none`} />
            </label>
            <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-nyx px-6 font-semibold text-snow shadow-[0_8px_30px_-8px_rgb(24_93_241/0.7)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#1450d6] active:scale-[0.97]">
              {canal === 'email' ? copy.enviarEmail : copy.enviarWhatsapp}<ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className={`mt-3 min-h-5 text-center text-xs ${aviso ? 'text-amber-200' : 'text-alice/60'}`} role="status">{aviso || (canal === 'email' ? copy.ajudaEmail : copy.ajudaWhatsapp)}</p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-alice/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo className="h-11" />
          <p className="mt-3 text-sm text-alice/60">Software sob demanda.</p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-3">
          {nav.map((item) => <a key={item.href} href={item.href} className="text-sm text-alice/65 hover:text-alice">{item.label}</a>)}
          {contato.instagram && <a href={contato.instagram} target="_blank" rel="noreferrer" className="text-sm text-alice/65 hover:text-alice">Instagram</a>}
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-alice/55">© {new Date().getFullYear()} Nyx Hub</p>
    </footer>
  )
}
