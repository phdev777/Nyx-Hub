import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Box, Building2, CalendarClock, Check, Factory, Gauge, Wrench } from 'lucide-react'
import { showcase } from '../content.js'
import { Reveal, Section, SectionHead } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

// Telas de exemplo do tipo de sistema que construímos, com nomes e números fictícios.
const TABS = [
  { id: 'producao', label: 'Painel de produção', icon: Gauge, from: 'Gestão de mineração', Screen: ProductionScreen },
  { id: 'manutencao', label: 'Manutenção', icon: Wrench, from: 'Gestão de mineração', Screen: MaintenanceScreen },
  { id: 'central', label: 'Central de operações', icon: Building2, from: 'Portal de um grupo de empresas', Screen: CentralScreen },
  { id: 'diarias', label: 'Diárias e eventos', icon: CalendarClock, from: 'Gestão de usina', Screen: ShiftScreen },
  { id: 'planta', label: 'Planta 3D', icon: Box, from: 'Gestão de usina', Screen: PlantScreen },
]

export function Showcase() {
  const [active, setActive] = useState(TABS[0].id)
  const base = useId()
  const tab = TABS.find((t) => t.id === active)

  // Na faixa de abas que rola no celular, a aba escolhida vem para a vista.
  function choose(id) {
    setActive(id)
    document.getElementById(`${base}-tab-${id}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }

  function onKey(e) {
    const i = TABS.findIndex((t) => t.id === active)
    const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i - 1 + TABS.length) % TABS.length : null
    if (next === null) return
    e.preventDefault()
    choose(TABS[next].id)
    document.getElementById(`${base}-tab-${TABS[next].id}`)?.focus()
  }

  return (
    <Section id="por-dentro">
      <SectionHead {...showcase} />
      <Reveal className="mt-10">
        <motion.div layoutScroll role="tablist" aria-label="Telas de exemplo" onKeyDown={onKey} className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none]">
          {TABS.map((t) => {
            const selected = t.id === active
            return (
              <button
                key={t.id}
                id={`${base}-tab-${t.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`${base}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(t.id)}
                className={`relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm font-medium transition-[color,transform] duration-150 ease-out active:scale-[0.97] ${selected ? 'text-alice' : 'text-alice/65 hover:text-alice/90'}`}
              >
                {/* A pílula azul desliza até a aba escolhida. */}
                {selected && <motion.span layoutId="showcase-pill" className="absolute inset-0 rounded-full bg-nyx" transition={{ type: 'spring', duration: 0.45, bounce: 0.15 }} />}
                <t.icon size={16} className="relative" aria-hidden="true" />
                <span className="relative">{t.label}</span>
              </button>
            )
          })}
        </motion.div>

        <div id={`${base}-panel`} tabIndex={0} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className="mt-5 overflow-hidden rounded-3xl border border-alice/10 bg-prussian/50 shadow-[0_40px_120px_-50px_rgb(24_93_241/0.55)]">
          <div className="flex items-center justify-between gap-3 border-b border-alice/10 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-alice/15" /><span className="h-2.5 w-2.5 rounded-full bg-alice/15" /><span className="h-2.5 w-2.5 rounded-full bg-alice/15" />
            </div>
            <p className="min-w-0 truncate text-xs text-alice/60" title={`Exemplo: ${tab.from}`}><span className="hidden sm:inline">Exemplo: </span><span className="text-alice/80">{tab.from}</span></p>
            <span className="shrink-0 rounded-full bg-amber-400/10 px-2.5 py-1 text-[0.7rem] font-medium text-amber-300">Dados fictícios</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, transform: 'translateY(8px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(-4px)', transition: { duration: 0.1 } }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="p-4 sm:p-6"
            >
              <tab.Screen />
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
    </Section>
  )
}

/* ---------- peças comuns ---------- */

function Card({ title, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-alice/5 bg-night/60 p-4 ${className}`}>
      {title && <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-alice/60">{title}</h3>}
      {children}
    </div>
  )
}

function Kpi({ label, value, note, tone = 'neutral' }) {
  const toneClass = tone === 'up' ? 'text-emerald-300' : tone === 'down' ? 'text-rose-300' : 'text-alice/60'
  return (
    <Card>
      <p className="text-xs text-alice/60">{label}</p>
      <p className="mt-2 whitespace-nowrap text-xl font-bold tracking-[-0.03em] tabular-nums min-[360px]:text-2xl">{value}</p>
      <p className={`mt-1 text-xs ${toneClass}`}>{note}</p>
    </Card>
  )
}

// Barra que sobe de dentro da base quando aparece na tela (translate, sem achatar a ponta arredondada).
function GrowBar({ value, max, delay = 0, className = '' }) {
  return (
    <motion.div
      data-bar
      className={`w-full rounded-t-md ${className}`}
      style={{ height: `${(value / max) * 100}%` }}
      initial={{ transform: 'translateY(100%)' }}
      whileInView={{ transform: 'translateY(0%)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    />
  )
}

function FillBar({ value, delay = 0, className = 'bg-nyx' }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-alice/5">
      <motion.div
        data-bar
        className={`h-full rounded-full ${className}`}
        style={{ width: `${Math.min(value, 100)}%` }}
        initial={{ transform: 'translateX(-100%)' }}
        whileInView={{ transform: 'translateX(0%)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      />
    </div>
  )
}

/* ---------- 1. Painel de produção ---------- */

const PRODUCAO_HORA = [86, 102, 118, 95, 40, 72, 124, 131, 117, 128, 136, 112]
const PARADAS = [
  { grupo: 'Manutenção corretiva', min: 95 },
  { grupo: 'Falta de material', min: 58 },
  { grupo: 'Chuva', min: 42 },
  { grupo: 'Abastecimento', min: 25 },
]
const LINHA = [
  { tag: 'ESC-01', blocos: [['op', 38], ['par', 8], ['op', 54]] },
  { tag: 'CB-04', blocos: [['op', 22], ['sb', 10], ['op', 48], ['par', 6], ['op', 14]] },
  { tag: 'BR-01', blocos: [['op', 30], ['par', 18], ['op', 52]] },
]
const COR = { op: 'bg-nyx', par: 'bg-rose-400/80', sb: 'bg-amber-300/70' }
const NOME = { op: 'Operando', par: 'Parado', sb: 'Aguardando' }

function ProductionScreen() {
  const max = Math.max(...PRODUCAO_HORA)
  const maxParada = Math.max(...PARADAS.map((p) => p.min))
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Produção do dia" value="1.361 t" note="+6% sobre ontem" tone="up" />
        <Kpi label="Horas trabalhadas" value="142,5 h" note="18 equipamentos" />
        <Kpi label="Disponibilidade" value="91%" note="meta: 88%" tone="up" />
        <Kpi label="Tempo parado" value="3h40" note="+25 min sobre ontem" tone="down" />
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <Card title="Produção por hora (t)">
          <div className="flex h-40 items-end gap-1.5 sm:gap-2" role="img" aria-label="Gráfico de barras com a produção de cada hora do turno, entre 40 e 136 toneladas">
            {PRODUCAO_HORA.map((v, i) => (
              <div key={i} className="flex h-full flex-1 items-end overflow-hidden"><GrowBar value={v} max={max} delay={i * 0.03} className={v < 60 ? 'bg-rose-400/70' : 'bg-gradient-to-t from-nyx to-nyx-light'} /></div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[0.65rem] text-alice/60" aria-hidden="true"><span>07h</span><span>13h</span><span>18h</span></div>
        </Card>
        <Card title="Tempo parado por motivo">
          <ul className="space-y-3">
            {PARADAS.map((p, i) => (
              <li key={p.grupo}>
                <div className="mb-1.5 flex justify-between text-xs"><span className="text-alice/75">{p.grupo}</span><span className="tabular-nums text-alice/60">{p.min} min</span></div>
                <FillBar value={(p.min / maxParada) * 100} delay={i * 0.05} className="bg-rose-400/70" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card title="Linha do tempo do turno">
        <ul className="space-y-2.5">
          {LINHA.map((m, r) => (
            <li key={m.tag} className="flex items-center gap-3">
              <span className="w-14 shrink-0 font-mono text-xs text-alice/60">{m.tag}</span>
              <div className="flex h-3 flex-1 gap-0.5 overflow-hidden rounded-full" role="img" aria-label={m.blocos.map(([tipo, pct]) => `${NOME[tipo]} ${pct}%`).join(', ')}>
                {m.blocos.map(([tipo, pct], i) => (
                  <motion.span key={i} className={`h-full origin-left ${COR[tipo]}`} style={{ width: `${pct}%` }}
                    initial={{ opacity: 0, transform: 'scaleX(0.6)' }} whileInView={{ opacity: 1, transform: 'scaleX(1)' }} viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: r * 0.08 + i * 0.05 }} />
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-4 text-[0.7rem] text-alice/60" aria-hidden="true">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-nyx" />Operando</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-300/70" />Aguardando</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400/80" />Parado</span>
        </div>
      </Card>
    </div>
  )
}

/* ---------- 2. Manutenção ---------- */

const EQUIPS = [
  { tag: 'PC-02', nome: 'Pá carregadeira', uso: 106, falta: 'vencida há 14 h' },
  { tag: 'ESC-01', nome: 'Escavadeira', uso: 92, falta: 'faltam 38 h' },
  { tag: 'CB-04', nome: 'Caminhão basculante', uso: 71, falta: 'faltam 145 h' },
  { tag: 'BR-01', nome: 'Britador primário', uso: 48, falta: 'em 12 dias' },
  { tag: 'GR-01', nome: 'Gerador', uso: 23, falta: 'faltam 380 h' },
]
const situacao = (u) => (u >= 100 ? ['Vencida', 'bg-rose-400/15 text-rose-300', 'bg-rose-400'] : u >= 85 ? ['Atenção', 'bg-amber-300/15 text-amber-300', 'bg-amber-300'] : ['Em dia', 'bg-emerald-400/10 text-emerald-300', 'bg-nyx'])

function MaintenanceScreen() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
      <Card title="Próximas revisões">
        <ul className="divide-y divide-alice/5">
          {EQUIPS.map((e, i) => {
            const [rotulo, chip, barra] = situacao(e.uso)
            return (
              <li key={e.tag} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-3 sm:grid-cols-[11rem_1fr_auto]">
                <div className="min-w-0"><p className="font-mono text-xs text-alice/60">{e.tag}</p><p className="truncate text-sm">{e.nome}</p></div>
                <span className={`justify-self-end rounded-full px-2.5 py-1 text-xs font-medium sm:order-last ${chip}`}>{rotulo}</span>
                <div className="col-span-2 sm:col-span-1">
                  <FillBar value={e.uso} delay={i * 0.05} className={barra} />
                  <p className="mt-1 text-[0.7rem] text-alice/60">{e.falta}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>
      <div className="grid content-start gap-3">
        <Kpi label="Revisões em dia" value="83%" note="15 de 18 equipamentos" tone="up" />
        <Kpi label="Vencidas" value="1" note="PC-02 · pá carregadeira" tone="down" />
        <Card title="Último registro">
          <p className="text-sm text-alice/80">Troca de óleo e filtros · ESC-01</p>
          <p className="mt-1 text-xs text-alice/60">Horímetro 4.512 h · hoje, 09:40</p>
        </Card>
      </div>
    </div>
  )
}

/* ---------- 3. Central de operações ---------- */

const UNIDADES = [
  { nome: 'Unidade Serra Azul', tipo: 'Mineração', info: '24 equipamentos · 3 turnos', status: 'Em operação', tone: 'ok' },
  { nome: 'Unidade Vale Verde', tipo: 'Brita', info: '11 equipamentos · 2 turnos', status: 'Em operação', tone: 'ok' },
  { nome: 'Usina Pedra Branca', tipo: 'Calcário', info: 'Implantação em andamento', status: 'Em implantação', tone: 'wait' },
  { nome: 'Escritório central', tipo: 'Administrativo', info: 'Pessoas, acessos e relatórios', status: 'Em operação', tone: 'ok' },
]
const PERFIS = [['Diretoria', 'Dir.'], ['Gestor', 'Gest.'], ['Encarregado', 'Enc.'], ['Operador', 'Op.']]
const PERMISSOES = [
  ['Ver relatórios', [1, 1, 1, 0]],
  ['Registrar diária', [0, 1, 1, 1]],
  ['Planejar metas', [1, 1, 0, 0]],
  ['Gerenciar acessos', [1, 0, 0, 0]],
]

function CentralScreen() {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        {UNIDADES.map((u, i) => (
          <motion.div key={u.nome} initial={{ opacity: 0, transform: 'translateY(8px)' }} whileInView={{ opacity: 1, transform: 'translateY(0px)' }} viewport={{ once: true }} transition={{ duration: 0.4, ease: EASE_OUT, delay: i * 0.05 }}>
            <Card className="h-full">
              <div className="flex items-start justify-between gap-2">
                <Factory size={18} className="text-nyx-light" aria-hidden="true" />
                <span className={`rounded-full px-2 py-0.5 text-[0.68rem] font-medium ${u.tone === 'ok' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-300/15 text-amber-300'}`}>{u.status}</span>
              </div>
              <p className="mt-4 font-semibold">{u.nome}</p>
              <p className="text-xs text-alice/60">{u.tipo}</p>
              <p className="mt-3 text-xs text-alice/65">{u.info}</p>
            </Card>
          </motion.div>
        ))}
      </div>
      <Card title="Quem pode o quê">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead><tr><th className="sticky left-0 bg-[#020812] pb-2 font-normal"><span className="sr-only">Permissão</span></th>{PERFIS.map(([nome, curto]) => <th key={nome} scope="col" className="px-1 pb-2 text-center font-medium text-alice/70"><abbr title={nome} className="no-underline sm:hidden">{curto}</abbr><span className="hidden sm:inline">{nome}</span></th>)}</tr></thead>
            <tbody>
              {PERMISSOES.map(([nome, flags]) => (
                <tr key={nome} className="border-t border-alice/5">
                  <th scope="row" className="sticky left-0 bg-[#020812] py-2.5 pr-2 font-normal text-alice/80">{nome}</th>
                  {flags.map((f, i) => (
                    <td key={i} className="text-center">{f ? <Check size={15} className="mx-auto text-nyx-light" aria-hidden="true" /> : <span className="text-alice/30" aria-hidden="true">—</span>}<span className="sr-only">{f ? 'sim' : 'não'}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.7rem] text-alice/60">A regra vale no sistema inteiro: a tela só mostra o que o perfil permite.</p>
      </Card>
    </div>
  )
}

/* ---------- 4. Diárias e eventos ---------- */

const EVENTOS = [
  { hora: '07:00', tag: 'ESC-01', texto: 'Início do turno · horímetro 4.508,6 h', tipo: 'op' },
  { hora: '08:15', tag: 'CB-04', texto: 'Abastecimento · 180 L de diesel', tipo: 'sb' },
  { hora: '09:40', tag: 'ESC-01', texto: 'Parada · troca de dente da caçamba', tipo: 'par' },
  { hora: '10:05', tag: 'ESC-01', texto: 'Retorno à operação', tipo: 'op' },
  { hora: '12:30', tag: 'BR-01', texto: 'Parada · chuva forte na frente de lavra', tipo: 'par' },
  { hora: '15:00', tag: 'Turno A', texto: 'Diária enviada ao gestor · 9 equipamentos', tipo: 'op' },
]
const DOT = { op: 'bg-nyx', par: 'bg-rose-400', sb: 'bg-amber-300' }

function ShiftScreen() {
  const feitos = 18, total = 21
  const C = 2 * Math.PI * 34
  return (
    <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
      <Card title="Eventos do turno · hoje">
        <ol className="relative space-y-4 pl-5 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-alice/10">
          {EVENTOS.map((e, i) => (
            <motion.li key={i} className="relative" initial={{ opacity: 0, transform: 'translateX(-6px)' }} whileInView={{ opacity: 1, transform: 'translateX(0px)' }} viewport={{ once: true }} transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.05 }}>
              <span className={`absolute -left-5 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-night ${DOT[e.tipo]}`} aria-hidden="true" />
              <p className="text-xs text-alice/60"><span className="tabular-nums">{e.hora}</span> · <span className="font-mono">{e.tag}</span></p>
              <p className="text-sm text-alice/85">{e.texto}</p>
            </motion.li>
          ))}
        </ol>
      </Card>
      <div className="grid content-start gap-3">
        <Card title="Diárias do dia">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90" role="img" aria-label={`${feitos} de ${total} diárias enviadas`}>
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgb(243 247 254 / 0.08)" strokeWidth="8" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke="url(#nyx-ring)" strokeWidth="8" strokeLinecap="round" strokeDasharray={C}
                initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - feitos / total) }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE_OUT }} />
              <defs><linearGradient id="nyx-ring"><stop offset="0" stopColor="#185df1" /><stop offset="1" stopColor="#6e9bff" /></linearGradient></defs>
            </svg>
            <div><p className="text-2xl font-bold tabular-nums">{feitos}/{total}</p><p className="text-xs text-alice/60">enviadas até agora</p></div>
          </div>
        </Card>
        <Kpi label="Diesel no dia" value="2.940 L" note="16,3 L/h na média" />
        <Kpi label="Eventos registrados" value="47" note="12 paradas" />
      </div>
    </div>
  )
}

/* ---------- 5. Planta 3D ---------- */

const PLANTA = '/demos/planta-3d/index.html'
const PLANTA_EMBED = `${PLANTA}?embed=1`

function PlantScreen() {
  // A cena 3D pesa ~1 MB: só carrega quando a pessoa pede.
  const [load, setLoad] = useState(false)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-alice/5 bg-night sm:aspect-[16/10]">
      {load ? (
        <iframe src={PLANTA_EMBED} title="Planta 3D interativa de uma usina de demonstração" className="h-full w-full border-0" loading="lazy" />
      ) : (
        <div className="grid-lines absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <Box size={36} className="text-nyx-light" aria-hidden="true" />
          <p className="max-w-sm text-sm text-alice/70">Usina de britagem e moagem em 3D: o material corre pelas correias, e dá para girar, aproximar e clicar nos equipamentos.</p>
          {/* No celular, a cena dentro da página prende o dedo e atrapalha a rolagem: abre em outra aba, em tela cheia. */}
          <a href={PLANTA} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-nyx px-5 text-sm font-semibold transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] sm:hidden">Abrir planta 3D<span className="sr-only"> em outra aba</span></a>
          <button type="button" onClick={() => setLoad(true)} className="hidden min-h-11 items-center rounded-full bg-nyx px-5 text-sm font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-[#1450d6] active:scale-[0.97] sm:inline-flex">Abrir planta 3D</button>
        </div>
      )}
    </div>
  )
}
