import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { Box, Building2, CalendarClock, Check, Factory, Gauge, Wrench } from 'lucide-react'
import { showcase } from '../content.js'
import { Reveal, Section, SectionHead } from '../components/ui.jsx'

const EASE_OUT = [0.23, 1, 0.32, 1]

// Telas de exemplo do tipo de sistema que construímos, com nomes e números fictícios.
const TABS = [
  { id: 'producao', label: 'Painel de produção', desc: 'Quanto produziu, quanto parou e por quê, hora a hora.', icon: Gauge, from: 'Gestão de mineração', Screen: ProductionScreen },
  { id: 'manutencao', label: 'Manutenção', desc: 'Avisa antes da revisão vencer, máquina por máquina.', icon: Wrench, from: 'Gestão de mineração', Screen: MaintenanceScreen },
  { id: 'central', label: 'Central de operações', desc: 'Todas as empresas do grupo num lugar só.', icon: Building2, from: 'Portal de um grupo de empresas', Screen: CentralScreen },
  { id: 'usina', label: 'Painel da usina', desc: 'O que está rodando, o que parou e quanto cada máquina produz.', icon: Factory, from: 'Gestão de usina', Screen: PlantPanelScreen },
  { id: 'diarias', label: 'Diárias e eventos', desc: 'Tudo o que aconteceu no turno, registrado na hora.', icon: CalendarClock, from: 'Gestão de usina', Screen: ShiftScreen },
  { id: 'planta', label: 'Planta 3D', desc: 'A usina inteira em 3D, para girar e explorar.', icon: Box, from: 'Gestão de usina', Screen: PlantScreen },
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
    const fwd = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const back = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
    const next = fwd ? (i + 1) % TABS.length : back ? (i - 1 + TABS.length) % TABS.length : null
    if (next === null) return
    e.preventDefault()
    choose(TABS[next].id)
    document.getElementById(`${base}-tab-${TABS[next].id}`)?.focus()
  }

  return (
    <Section id="por-dentro">
      <SectionHead {...showcase} />
      {/* No computador: lista de telas à esquerda, com uma frase em cada; no celular: pílulas que rolam para o lado. */}
      <Reveal className="mt-10 lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-6">
        <motion.div layoutScroll role="tablist" aria-label="Telas de exemplo" onKeyDown={onKey} className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-2 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:[mask-image:none] lg:sticky lg:top-24 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0">
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
                className={`relative inline-flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-left text-sm font-medium transition-[color,transform] duration-150 ease-out active:scale-[0.97] lg:w-full lg:items-start lg:gap-3 lg:rounded-2xl lg:p-3 lg:active:scale-[0.99] ${selected ? 'text-snow lg:text-alice' : 'text-alice/65 hover:text-alice/90'}`}
              >
                {/* O destaque desliza até a aba escolhida: pílula azul no celular, cartão com borda no computador. */}
                {selected && <motion.span layoutId="showcase-pill" className="absolute inset-0 rounded-full bg-nyx lg:rounded-2xl lg:bg-nyx/15 lg:ring-1 lg:ring-nyx/50" transition={{ type: 'spring', duration: 0.35, bounce: 0 }} />}
                <span className={`relative lg:grid lg:h-9 lg:w-9 lg:shrink-0 lg:place-items-center lg:rounded-xl lg:border ${selected ? 'lg:border-nyx/40 lg:bg-nyx lg:text-snow' : 'lg:border-alice/10 lg:bg-night/60 lg:text-nyx-light'}`}>
                  <t.icon size={16} aria-hidden="true" />
                </span>
                <span className="relative">
                  <span className="block lg:font-semibold">{t.label}</span>
                  <span className={`mt-0.5 hidden text-xs font-normal leading-snug lg:block ${selected ? 'text-alice/75' : 'text-alice/55'}`}>{t.desc}</span>
                </span>
              </button>
            )
          })}
        </motion.div>

        <p className="mt-3 text-sm text-alice/70 lg:hidden">{tab.desc}</p>

        <div id={`${base}-panel`} tabIndex={0} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className="@container mt-4 overflow-hidden lg:mt-0 rounded-3xl border border-alice/10 bg-prussian/50 shadow-[0_40px_120px_-50px_rgb(24_93_241/0.55)]">
          <div className="flex items-center justify-between gap-3 border-b border-alice/10 px-4 py-3 sm:px-5">
            {/* Os três botões de janela do Mac: vermelho, amarelo e verde. */}
            <div className="flex shrink-0 items-center gap-2" aria-hidden="true">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-inset ring-black/20" /><span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-inset ring-black/20" /><span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-inset ring-black/20" />
            </div>
            <p className="min-w-0 truncate text-xs text-alice/60" title={`Exemplo: ${tab.from}`}><span className="hidden sm:inline">Exemplo: </span><span className="text-alice/80">{tab.from}</span></p>
            <span className="shrink-0 rounded-full bg-amber-400/10 px-2.5 py-1 text-[0.7rem] font-medium text-amber-300">Dados fictícios</span>
          </div>
          {/* A tela nova entra na hora, sem esperar a anterior sair: dá para trocar de aba rápido sem travar. */}
          <motion.div
            key={active}
            initial={{ opacity: 0, transform: 'translateY(6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="p-4 sm:p-6"
          >
            <tab.Screen />
          </motion.div>
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
      <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <Kpi label="Produção do dia" value="1.361 t" note="+6% sobre ontem" tone="up" />
        <Kpi label="Horas trabalhadas" value="142,5 h" note="18 equipamentos" />
        <Kpi label="Disponibilidade" value="91%" note="meta: 88%" tone="up" />
        <Kpi label="Tempo parado" value="3h40" note="+25 min sobre ontem" tone="down" />
      </div>
      <div className="grid gap-3 @3xl:grid-cols-[1.6fr_1fr]">
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
      <Timeline title="Linha do tempo do turno" rows={LINHA} />
    </div>
  )
}

function Timeline({ title, rows, labelWidth = 'w-14' }) {
  return (
      <Card title={title}>
        <ul className="space-y-2.5">
          {rows.map((m, r) => (
            <li key={m.tag} className="flex items-center gap-3">
              <span className={`${labelWidth} shrink-0 font-mono text-xs text-alice/60`}>{m.tag}</span>
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
    <div className="grid gap-3 @3xl:grid-cols-[1.7fr_1fr]">
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
    <div className="grid gap-3 @4xl:grid-cols-[1.4fr_1fr]">
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
            <thead><tr><th className="sticky left-0 bg-night pb-2 font-normal"><span className="sr-only">Permissão</span></th>{PERFIS.map(([nome, curto]) => <th key={nome} scope="col" className="px-1 pb-2 text-center font-medium text-alice/70"><abbr title={nome} className="no-underline sm:hidden">{curto}</abbr><span className="hidden sm:inline">{nome}</span></th>)}</tr></thead>
            <tbody>
              {PERMISSOES.map(([nome, flags]) => (
                <tr key={nome} className="border-t border-alice/5">
                  <th scope="row" className="sticky left-0 bg-night py-2.5 pr-2 font-normal text-alice/80">{nome}</th>
                  {flags.map((f, i) => (
                    <td key={i} className="text-center">{f ? <Check size={15} className="mx-auto text-nyx-light" aria-hidden="true" /> : <span className="text-alice/30" aria-hidden="true">—</span>}<span className="sr-only">{f ? 'sim' : 'não'}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[0.7rem] text-alice/60">A regra vale no sistema inteiro: cada pessoa só vê o que o cargo permite.</p>
      </Card>
    </div>
  )
}

/* ---------- 4. Painel da usina ---------- */

// Visão geral da usina: a planta no centro, a máquina escolhida ao lado e a linha do tempo embaixo.
// Posição de cada máquina na foto da planta (em % da imagem), para marcar a escolhida.
const MAQUINAS = [
  { tag: 'BR-03', nota: '10:05 · voltou a operar após troca de mandíbula', nome: 'Britador', area: 'britagem', estado: 'op', vazao: 128, prod: 386, horas: '6.214', x: 27.6, y: 49, serie: [118, 122, 126, 121, 130, 127, 124, 129, 131, 126, 128, 128] },
  { tag: 'PV-02', nota: '09:30 · tela limpa pelo operador', nome: 'Peneira', area: 'britagem', estado: 'op', vazao: 121, prod: 362, horas: '5.880', x: 41.5, y: 42, serie: [110, 114, 119, 117, 120, 116, 118, 122, 119, 121, 120, 121] },
  { tag: 'TC-05', nota: '11:40 · aguardando material da britagem', nome: 'Correia', area: 'britagem', estado: 'sb', vazao: 0, prod: 340, horas: '7.102', x: 53.8, y: 42, serie: [112, 115, 118, 116, 114, 117, 96, 60, 22, 0, 0, 0] },
  { tag: 'MM-01', nota: '11:10 · parada para troca de revestimento', nome: 'Moinho 1', area: 'moagem', estado: 'par', vazao: 0, prod: 214, horas: '9.315', x: 83.7, y: 45.9, serie: [66, 68, 65, 67, 64, 40, 0, 0, 0, 0, 0, 0] },
  { tag: 'MM-05', nota: '08:15 · inspeção de rotina concluída', nome: 'Moinho 5', area: 'moagem', estado: 'op', vazao: 64, prod: 198, horas: '8.770', x: 79.9, y: 48.2, serie: [58, 60, 61, 63, 62, 64, 66, 63, 65, 64, 63, 64] },
  { tag: 'FM-02', nota: '07:00 · início do turno sem pendências', nome: 'Filtro', area: 'moagem', estado: 'op', vazao: 58, prod: 176, horas: '4.402', x: 89.2, y: 52, serie: [50, 52, 55, 54, 56, 57, 55, 58, 57, 59, 58, 58] },
]
// Aproximação da foto em cada área: escala e ponto de origem.
const AREAS = [
  { id: 'geral', nome: 'Geral', zoom: 'scale(1.35)', origem: '54% 52%' },
  { id: 'britagem', nome: 'Britagem', zoom: 'scale(2)', origem: '28% 48%' },
  { id: 'moagem', nome: 'Moagem', zoom: 'scale(2.2)', origem: '84% 50%' },
]
const ESTADO = {
  op: ['Operando', 'bg-emerald-400/10 text-emerald-300', 'ring-emerald-300'],
  sb: ['Aguardando', 'bg-amber-300/15 text-amber-300', 'ring-amber-300'],
  par: ['Parado', 'bg-rose-400/15 text-rose-300', 'ring-rose-300'],
}
const TURNOS = [['Turno A', true], ['Turno B', true], ['Turno C', false]]
const LINHA_USINA = [
  { tag: 'Britagem', blocos: [['op', 62], ['sb', 12], ['op', 26]] },
  { tag: 'Moagem', blocos: [['op', 45], ['par', 30], ['op', 25]] },
  { tag: 'Expedição', blocos: [['op', 30], ['sb', 20], ['op', 50]] },
]

// Gráfico de área da vazão (12 leituras, uma a cada 10 minutos).
function AreaChart({ serie }) {
  // A escala acompanha a própria série, para a variação aparecer mesmo quando a vazão é estável.
  const lo = Math.max(0, Math.min(...serie) - 15)
  const hi = Math.max(...serie) + 10
  const pts = serie.map((v, i) => `${(i / (serie.length - 1)) * 100},${38 - ((v - lo) / (hi - lo)) * 32}`)
  const linha = `M${pts.join(' L')}`
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-24 w-full" aria-hidden="true">
      <defs>
        <linearGradient id="vazao-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-nyx-light)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-nyx-light)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${linha} L100,40 L0,40 Z`} fill="url(#vazao-area)" />
      <path d={linha} fill="none" stroke="var(--color-nyx-light)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  )
}

function PlantPanelScreen() {
  const [area, setArea] = useState('geral')
  const [tag, setTag] = useState('BR-03')
  const zona = AREAS.find((a) => a.id === area)
  const lista = area === 'geral' ? MAQUINAS : MAQUINAS.filter((m) => m.area === area)
  const maq = MAQUINAS.find((m) => m.tag === tag)
  const [estado, estadoCor, anel] = ESTADO[maq.estado]

  function escolherArea(id) {
    setArea(id)
    if (id !== 'geral' && maq.area !== id) setTag(MAQUINAS.find((m) => m.area === id).tag)
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-alice/60">Turnos de hoje:</span>
        {TURNOS.map(([nome, ok]) => (
          <span key={nome} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${ok ? 'bg-emerald-400/10 text-emerald-300' : 'bg-alice/5 text-alice/60'}`}>
            {ok ? <Check size={12} aria-hidden="true" /> : <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />}
            {nome} · {ok ? 'recebido' : 'em andamento'}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
        <Kpi label="Produção do turno" value="412 t" note="+8% sobre o anterior" tone="up" />
        <Kpi label="Meta do turno" value="450 t" note="92% atingido" />
        <Kpi label="Produtividade" value="118 t/h" note="média do turno" />
        <Kpi label="Paradas abertas" value="1" note="MM-01 · moinho 1" tone="down" />
      </div>
      <div className="grid gap-3 @3xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-alice/60">Planta</h3>
            <div className="flex rounded-full bg-night p-1" role="group" aria-label="Área da planta">
              {AREAS.map((a) => (
                <button key={a.id} type="button" aria-pressed={area === a.id} onClick={() => escolherArea(a.id)}
                  className={`min-h-8 rounded-full px-3 text-xs font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] ${area === a.id ? 'bg-nyx text-snow' : 'text-alice/65 hover:text-alice/90'}`}>
                  {a.nome}
                </button>
              ))}
            </div>
          </div>
          {/* A foto aproxima na área escolhida; o anel marca a máquina selecionada. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-night">
            <div data-zoom className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none" style={{ transform: zona.zoom, transformOrigin: zona.origem }}>
              <img src={`${PLANTA_DIR}poster.jpg`} alt="" loading="lazy" decoding="async" width="1440" height="900" className="h-full w-full object-cover" />
              <span className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ${anel} animate-pulse motion-reduce:animate-none`} style={{ left: `${maq.x}%`, top: `${maq.y}%` }} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Máquina">
            {lista.map((m) => (
              <button key={m.tag} type="button" aria-pressed={tag === m.tag} onClick={() => setTag(m.tag)}
                className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.97] ${tag === m.tag ? 'border-nyx/60 bg-nyx/15 text-alice' : 'border-alice/10 text-alice/70 hover:text-alice'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${DOT[m.estado]}`} aria-hidden="true" />
                <span className="font-mono">{m.tag}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-alice/60">{maq.tag}</p>
              <h3 className="mt-0.5 text-lg font-semibold">{maq.nome}</h3>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${estadoCor}`}>{estado}</span>
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div><dt className="text-alice/60">Vazão agora</dt><dd className="mt-1 text-base font-bold tabular-nums">{maq.vazao} t/h</dd></div>
            <div><dt className="text-alice/60">No turno</dt><dd className="mt-1 text-base font-bold tabular-nums">{maq.prod} t</dd></div>
            <div><dt className="text-alice/60">Horímetro</dt><dd className="mt-1 text-base font-bold tabular-nums">{maq.horas} h</dd></div>
          </dl>
          <p className="mt-5 text-xs text-alice/60">Vazão nas últimas 2 horas (t/h)</p>
          <motion.div key={maq.tag} className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: EASE_OUT }}
            role="img" aria-label={`Vazão de ${maq.nome} nas últimas 2 horas: de ${maq.serie[0]} para ${maq.serie[maq.serie.length - 1]} toneladas por hora`}>
            <AreaChart serie={maq.serie} />
          </motion.div>
          <div className="mt-1 flex justify-between text-[0.65rem] text-alice/60" aria-hidden="true"><span>-2h</span><span>-1h</span><span>agora</span></div>
          <div className="mt-auto pt-5">
            <div className="rounded-xl border border-alice/5 bg-prussian/40 p-3">
              <p className="text-[0.7rem] uppercase tracking-[0.12em] text-alice/60">Último registro</p>
              <p className="mt-1 text-sm text-alice/85">{maq.nota}</p>
            </div>
          </div>
        </Card>
      </div>
      <Timeline title="Linha do tempo da planta" rows={LINHA_USINA} labelWidth="w-20" />
    </div>
  )
}

/* ---------- 5. Diárias e eventos ---------- */

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
    <div className="grid gap-3 @3xl:grid-cols-[1.6fr_1fr]">
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
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-alice)" strokeOpacity="0.08" strokeWidth="8" />
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

/* ---------- 6. Planta 3D ---------- */

const PLANTA_DIR = '/demos/planta-3d/'
const PLANTA = `${PLANTA_DIR}index.html`
const PLANTA_EMBED = `${PLANTA}?embed=1`

function PlantScreen() {
  // A cena 3D pesa ~1 MB: só carrega quando a pessoa pede.
  const [load, setLoad] = useState(false)
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-alice/5 bg-night sm:aspect-[16/10]">
      {load ? (
        <iframe src={PLANTA_EMBED} title="Planta 3D interativa de uma usina de demonstração" className="h-full w-full border-0" loading="lazy" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 p-6 text-center sm:p-8">
          <img src={`${PLANTA_DIR}poster.jpg`} alt="" loading="lazy" decoding="async" width="1440" height="900" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent to-60%" aria-hidden="true" />
          <p className="relative max-w-sm text-sm font-medium text-alice/90">Uma usina inteira em 3D. Dá para girar, aproximar e clicar em cada máquina.</p>
          {/* No celular, a cena dentro da página prende o dedo e atrapalha a rolagem: abre em outra aba, em tela cheia. */}
          <a href={PLANTA} target="_blank" rel="noreferrer" className="relative inline-flex min-h-11 items-center rounded-full bg-nyx px-5 text-sm font-semibold text-snow transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] sm:hidden">Abrir planta 3D<span className="sr-only"> em outra aba</span></a>
          <button type="button" onClick={() => setLoad(true)} className="relative hidden min-h-11 items-center rounded-full bg-nyx px-5 text-sm font-semibold text-snow shadow-[0_10px_40px_-10px_rgb(24_93_241/0.8)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#1450d6] active:scale-[0.97] sm:inline-flex">Abrir planta 3D</button>
        </div>
      )}
    </div>
  )
}
