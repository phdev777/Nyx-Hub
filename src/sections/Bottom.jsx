import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { contato, finalCta, nav } from '../content.js'
import { Logo, LogoMark, Reveal } from '../components/ui.jsx'

// Formulário curto: monta a mensagem e abre o WhatsApp (ou o e-mail). Não guarda nada em servidor.
export function Contact() {
  const [form, setForm] = useState({ nome: '', empresa: '', necessidade: '' })
  const [aviso, setAviso] = useState('')
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function enviar(e) {
    e.preventDefault()
    const texto = `Olá! Sou ${form.nome}${form.empresa ? `, da ${form.empresa}` : ''}. Preciso de: ${form.necessidade}`
    if (contato.whatsapp) {
      window.open(`https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    } else if (contato.email) {
      window.location.href = `mailto:${contato.email}?subject=${encodeURIComponent('Projeto com a Nyx Hub')}&body=${encodeURIComponent(texto)}`
    } else {
      setAviso('Contato ainda não configurado nesta versão de teste.')
    }
  }

  const campo = 'mt-2 w-full rounded-2xl border border-alice/10 bg-night/70 px-4 py-3.5 text-base text-alice placeholder:text-alice/30 transition-colors duration-150 focus:border-nyx/70 focus:outline-none'

  return (
    <section id="contato" className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="glow-bottom pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <LogoMark className="h-12 w-12 text-nyx-light" />
          <h2 className="mt-8 text-balance text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{finalCta.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-alice/65">{finalCta.text}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <form onSubmit={enviar} className="rounded-3xl border border-alice/10 bg-prussian/60 p-6 backdrop-blur-sm sm:p-8">
            <label className="block text-sm font-medium text-alice/80">Seu nome
              <input required autoComplete="name" value={form.nome} onChange={set('nome')} className={campo} />
            </label>
            <label className="mt-5 block text-sm font-medium text-alice/80">Empresa <span className="font-normal text-alice/40">(opcional)</span>
              <input autoComplete="organization" value={form.empresa} onChange={set('empresa')} className={campo} />
            </label>
            <label className="mt-5 block text-sm font-medium text-alice/80">Em uma frase, o que você precisa?
              <textarea required rows={3} value={form.necessidade} onChange={set('necessidade')} placeholder="Ex.: parar de montar o relatório da equipe à mão" className={`${campo} resize-none`} />
            </label>
            <button type="submit" className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-nyx px-6 font-semibold text-alice shadow-[0_8px_30px_-8px_rgb(24_93_241/0.7)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#2a6bff] active:scale-[0.97]">
              Enviar mensagem<ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="mt-3 min-h-5 text-center text-xs text-alice/45" role="status">{aviso || 'Respondemos com o próximo passo. Sem compromisso.'}</p>
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
          <p className="mt-3 text-sm text-alice/45">Software sob demanda.</p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-3">
          {nav.map((item) => <a key={item.href} href={item.href} className="text-sm text-alice/55 hover:text-alice">{item.label}</a>)}
          {contato.instagram && <a href={contato.instagram} target="_blank" rel="noreferrer" className="text-sm text-alice/55 hover:text-alice">Instagram</a>}
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-alice/30">© {new Date().getFullYear()} Nyx Hub</p>
    </footer>
  )
}
