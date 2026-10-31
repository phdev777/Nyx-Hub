// Todo o texto do site fica aqui. Itens marcados com "A CONFIRMAR" dependem do Pedro e dos sócios.

export const contato = {
  // Número com DDI e DDD, só dígitos (ex.: '5563999999999'). Vazio = botões levam ao formulário.
  whatsapp: '', // A CONFIRMAR
  email: '', // A CONFIRMAR (ex.: contato@nyxhub.com.br)
  instagram: '', // A CONFIRMAR
}

export const nav = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Exemplos' },
  { href: '#por-dentro', label: 'Por dentro' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#perguntas', label: 'Perguntas' },
]

export const hero = {
  eyebrow: 'Software sob demanda',
  title: ['Software do jeito', 'que a sua operação', 'funciona.'],
  text: 'A gente cria sistemas, automações e sites sob medida. Chega de planilha, retrabalho e ferramenta que não serve pro seu dia a dia.',
  primary: 'Contar o que eu preciso',
  secondary: 'Ver exemplos',
}

// Painel ilustrativo do hero: mostra o tipo de coisa que entregamos, sem dados reais.
export const demoPanel = {
  title: 'Operação · hoje',
  rows: [
    { label: 'Relatórios do turno recebidos', done: 'Recebidos', pending: 'Recebendo…' },
    { label: 'Pedidos conferidos com o estoque', done: 'Conferidos', pending: 'Conferindo…' },
    { label: 'Manutenções da semana agendadas', done: 'Agendadas', pending: 'Agendando…' },
    { label: 'Fechamento enviado ao gestor', done: 'Enviado', pending: 'Enviando…' },
  ],
  footer: 'Tudo num painel só, em vez de planilha e WhatsApp.',
}

// Pílulas abaixo do hero: o que fazemos, só os nomes, em linguagem simples (decidido em 31/10).
export const stack = {
  label: 'O que fazemos',
  text: 'Criamos o software do jeito que a sua empresa trabalha.',
  items: [
    'Software sob medida', 'Automações', 'Agentes de IA', 'Integração com ERP',
    'Sistemas internos', 'Painéis e relatórios', 'Sistemas no celular e tablet', 'Sites',
  ],
}

export const problem = {
  index: '01',
  label: 'O problema',
  title: 'A empresa cresceu. As planilhas também.',
  text: 'Em quase toda empresa é igual: a informação nasce no papel, vira mensagem, depois planilha. E no fim do dia alguém digita tudo de novo.',
  points: [
    { title: 'Retrabalho', text: 'A mesma informação digitada duas, três vezes, por pessoas diferentes.' },
    { title: 'Informação atrasada', text: 'O gestor só descobre o problema quando o relatório chega, dias depois.' },
    { title: 'Ferramenta genérica', text: 'O sistema pronto obriga a empresa a mudar o jeito de trabalhar para caber nele.' },
  ],
}

export const services = {
  index: '02',
  label: 'O que entregamos',
  title: 'Do site ao agente de IA.',
  text: 'Antes de começar, a gente combina o que vai ser feito e quando fica pronto. Os prazos abaixo são uma média.',
  items: [
    { name: 'Site profissional', text: 'Site rápido e bonito para apresentar sua empresa e trazer novos clientes.', tag: '1 a 2 semanas' },
    { name: 'Automação', text: 'Tarefas repetidas que passam a acontecer sozinhas: relatórios, avisos e um sistema conversando com o outro.', tag: '2 a 4 semanas' },
    { name: 'Sistema interno', text: 'Painéis, cadastros e relatórios para a equipe acompanhar o dia a dia. Cada pessoa vê o que o cargo permite.', tag: '4 a 8 semanas' },
    { name: 'Agente de IA', text: 'Um assistente que atende, organiza pedidos e faz as tarefas repetitivas da equipe.', tag: 'Sob proposta' },
  ],
}

// Decidido em 31/10: nenhum cliente citado; os projetos aparecem como exemplos do que construímos.
export const projects = {
  index: '03',
  label: 'Exemplos',
  title: 'O tipo de sistema que a gente constrói.',
  text: 'Exemplos com nomes genéricos, para mostrar o tipo de problema que a gente resolve.',
  items: [
    {
      kind: 'Sistema de gestão',
      name: 'Gestão de mineração',
      problem: 'Diárias de máquinas no papel e relatórios montados à mão no fim do mês.',
      solution: 'A diária passa a ser preenchida no tablet da cabine. O gestor vê produção, metas e manutenções num painel só.',
      facts: ['Tablet em campo', 'Painel de produção', 'Manutenção preventiva'],
      image: { src: '/projetos/mineradora-tablet-2.jpg', alt: 'Operador registrando a diária no tablet fixado na parede da cabine da usina' },
    },
    {
      kind: 'Sistema de gestão',
      name: 'Gestão de usina',
      problem: 'O que acontecia em cada turno ficava espalhado em várias planilhas.',
      solution: 'O operador registra o turno no sistema e os relatórios saem prontos. E dá para ver a usina inteira em 3D.',
      facts: ['Planta 3D', 'Registro por turno', 'Relatórios'],
    },
    {
      kind: 'Portal',
      name: 'Portal de um grupo de empresas',
      problem: 'Cada empresa do grupo com um sistema e um login diferentes.',
      solution: 'Um endereço só, com uma senha só. Cada pessoa vê as empresas que o cargo dela permite.',
      facts: ['Uma senha só', 'Várias empresas', 'Acesso por cargo'],
    },
    {
      kind: 'Site',
      name: 'Site profissional',
      problem: 'Sem site, quem procurava o serviço na internet não encontrava o profissional.',
      solution: 'Site próprio, rápido no celular, com apresentação dos serviços e contato direto.',
      facts: ['Feito para celular', 'Contato direto'],
    },
  ],
}

export const showcase = {
  index: '04',
  label: 'Por dentro',
  title: 'Veja como fica por dentro.',
  text: 'Telas de exemplo, com nomes e números fictícios: produção, manutenção, central de operações, diárias e até uma usina em 3D.',
}

export const process = {
  index: '05',
  label: 'Como funciona',
  title: 'Quatro passos, sem enrolação.',
  steps: [
    { title: 'Conversa', text: 'Você conta o problema. A gente entende como a operação funciona hoje.' },
    { title: 'Proposta fechada', text: 'O que vai ser feito, o prazo e o preço, tudo por escrito antes de começar.' },
    { title: 'Construção', text: 'Você vê e testa o sistema enquanto ele é feito, não só no final.' },
    { title: 'Entrega e suporte', text: 'Colocamos no ar, treinamos a equipe e o suporte fica combinado na proposta.' },
  ],
}

export const fit = {
  index: '06',
  label: 'Pra quem é',
  title: 'Somos uma boa escolha se…',
  yes: [
    'Sua equipe perde horas com planilha e retrabalho.',
    'Nenhum sistema pronto se encaixa no seu processo.',
    'Você quer falar direto com quem constrói.',
    'Precisa de algo que funcione no celular ou no tablet.',
  ],
  no: [
    'Você procura o preço mais baixo, sem olhar a qualidade.',
    'Precisa de uma solução pronta, sem ajustar nada ao seu processo.',
    'Quer só um orçamento para comparar, sem intenção de fazer.',
  ],
}

export const faq = {
  index: '07',
  label: 'Perguntas',
  title: 'Perguntas frequentes.',
  items: [
    { q: 'Quanto custa um projeto?', a: 'Depende do tamanho. Depois da primeira conversa, enviamos uma proposta com o que vai ser feito, o prazo e o preço fechado. Sem cobrança por hora.' },
    { q: 'Quanto tempo leva?', a: 'Em geral, um site sai em 1 a 2 semanas. Sistemas levam de 4 a 8 semanas na primeira versão. O prazo exato vai na proposta.' },
    { q: 'Funciona no celular e no tablet?', a: 'Sim. Pensamos no celular e no tablet desde o início, inclusive para sistemas usados em campo.' },
    { q: 'E depois que entrega?', a: 'O suporte fica combinado na proposta: corrigimos o que aparecer e evoluímos o sistema conforme a empresa cresce.' },
    { q: 'Meus dados ficam seguros?', a: 'Sim. Cada pessoa vê só o que o cargo dela permite, e essa regra vale no sistema inteiro, não só na tela.' },
  ],
}

export const finalCta = {
  title: 'O que mais toma tempo da sua equipe hoje?',
  text: 'Conta pra gente em uma frase. A gente responde com o próximo passo, sem compromisso.',
}

export const form = {
  nome: 'Nome',
  necessidade: 'O que você quer resolver?',
  necessidadeAjuda: 'Uma frase basta.',
  enviarWhatsapp: 'Continuar no WhatsApp',
  enviarEmail: 'Abrir e-mail',
  ajudaWhatsapp: 'A mensagem abre pronta no WhatsApp. É só tocar em enviar.',
  ajudaEmail: 'A mensagem abre pronta no seu e-mail. É só enviar.',
  vazio: 'Preencha seu nome e o que você quer resolver.',
  semContato: 'Nosso contato direto ainda está sendo configurado. Volte em breve.',
}
