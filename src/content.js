// Todo o texto do site fica aqui. Itens marcados com "A CONFIRMAR" dependem do Pedro e dos sócios.

export const contato = {
  // Número com DDI e DDD, só dígitos (ex.: '5563999999999'). Vazio = botões levam ao formulário.
  whatsapp: '', // A CONFIRMAR
  email: '', // A CONFIRMAR (ex.: contato@nyxhub.com.br)
  instagram: '', // A CONFIRMAR
}

export const nav = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#por-dentro', label: 'Por dentro' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#perguntas', label: 'Perguntas' },
]

export const hero = {
  eyebrow: 'Software sob demanda',
  title: ['Software do jeito', 'que a sua operação', 'funciona.'],
  text: 'Sistemas, automações e sites feitos sob medida para empresas que cansaram de planilha, retrabalho e ferramenta que não conversa com o dia a dia.',
  primary: 'Contar meu projeto',
  secondary: 'Ver projetos',
}

// Painel ilustrativo do hero: mostra o tipo de coisa que entregamos, sem dados reais.
export const demoPanel = {
  title: 'Operação · hoje',
  rows: [
    { label: 'Relatórios do turno recebidos', done: 'Recebidos', pending: 'Recebendo…' },
    { label: 'Pedidos conferidos com o estoque', done: 'Conferidos', pending: 'Conferindo…' },
    { label: 'Manutenções da semana agendadas', done: 'Agendadas', pending: 'Agendando…' },
    { label: 'Fechamento enviado ao gestor', done: 'Enviado', pending: 'Montando…' },
  ],
  footer: 'Antes: planilha e WhatsApp. Agora: um painel só.',
}

export const stack = [
  'React', 'Supabase', 'PostgreSQL', 'WhatsApp', 'Google Sheets', 'Excel', 'PDF',
  'Power BI', 'APIs de ERP', 'Vercel', 'Cloudflare', 'Automação com IA', 'Tablets em campo',
]

export const problem = {
  index: '01',
  label: 'O problema',
  title: 'A empresa cresceu. As planilhas também.',
  text: 'Quase toda operação chega no mesmo ponto: o dado nasce num papel, vira mensagem, depois planilha, e alguém digita tudo de novo no fim do dia.',
  points: [
    { title: 'Retrabalho', text: 'A mesma informação digitada duas, três vezes, por pessoas diferentes.' },
    { title: 'Informação atrasada', text: 'O gestor só descobre o problema quando o relatório chega, dias depois.' },
    { title: 'Ferramenta genérica', text: 'O sistema pronto obriga a empresa a mudar o processo para caber nele.' },
  ],
}

export const services = {
  index: '02',
  label: 'O que entregamos',
  title: 'Do site ao sistema completo.',
  text: 'Cada entrega tem escopo e prazo combinados antes de começar. Os prazos abaixo são referência e são fechados na proposta.',
  items: [
    { name: 'Site profissional', text: 'Site rápido e bonito para apresentar sua empresa e trazer contatos.', tag: '1 a 2 semanas' },
    { name: 'Automação', text: 'Rotinas repetitivas rodando sozinhas: relatórios, avisos, integrações entre sistemas.', tag: '2 a 4 semanas' },
    { name: 'Sistema interno', text: 'Painéis e cadastros para a equipe registrar e acompanhar a operação, inclusive em tablet.', tag: '4 a 8 semanas' },
    { name: 'Software sob medida', text: 'Produto completo, com login, permissões por cargo, relatórios e suporte.', tag: 'Sob proposta' },
  ],
}

// A CONFIRMAR: quais projetos podem aparecer e se o cliente pode ser citado pelo nome.
export const projects = {
  index: '03',
  label: 'Já em produção',
  title: 'Projetos que já entregamos.',
  text: 'Sistemas feitos pela nossa equipe e em uso todos os dias. Clientes identificados só com autorização.',
  items: [
    {
      kind: 'Sistema de gestão',
      name: 'Gestão de mineradora',
      problem: 'Diárias de máquinas no papel e relatórios montados à mão no fim do mês.',
      solution: 'Diária digital no tablet da frota, painel de produção, metas, pessoas, permissões por unidade e manutenção preventiva.',
      facts: ['Tablet em campo', 'Painel de produção', 'Manutenção preventiva'],
      // A CONFIRMAR: autorização da empresa e das pessoas que aparecem na foto.
      image: { src: '/projetos/mineradora-tablet-2.jpg', alt: 'Operador registrando a diária no tablet fixado na parede da cabine da usina' },
    },
    {
      kind: 'Sistema de gestão',
      name: 'Gestão de usina de calcário',
      problem: 'Apontamentos por turno, eventos e produção espalhados em planilhas.',
      solution: 'Apontamento do operador por turno, eventos, produção, relatórios e a usina inteira em 3D, com o material correndo pelas correias.',
      facts: ['Planta 3D', 'Apontamento por turno', 'Relatórios'],
    },
    {
      kind: 'Portal',
      name: 'Central de operações de um grupo',
      problem: 'Cada empresa do grupo com um sistema e um login diferentes.',
      solution: 'Um portal só, com login único, onde cada pessoa entra nas operações que o perfil dela permite.',
      facts: ['Login único', 'Várias empresas', 'Acesso por perfil'],
    },
    {
      kind: 'Site',
      name: 'Site profissional',
      problem: 'Profissional sem presença on-line para receber novos clientes.',
      solution: 'Site próprio, rápido no celular, com apresentação dos serviços e contato direto.',
      facts: ['Feito para celular', 'Carrega rápido', 'Contato direto'],
    },
  ],
}

export const showcase = {
  index: '04',
  label: 'Por dentro',
  title: 'Por dentro do que já entregamos.',
  text: 'Telas dos sistemas que construímos e que estão em uso hoje: produção, manutenção, central de operações, diárias e até a usina em 3D. Para proteger nossos clientes, nomes e números aqui são fictícios.',
}

export const process = {
  index: '05',
  label: 'Como funciona',
  title: 'Quatro passos, sem enrolação.',
  steps: [
    { title: 'Conversa', text: 'Você conta o problema. A gente entende como a operação funciona hoje.' },
    { title: 'Proposta fechada', text: 'Escopo, prazo e preço definidos por escrito antes de começar.' },
    { title: 'Construção', text: 'Entregas toda semana, para você ver e testar enquanto o sistema nasce.' },
    { title: 'Entrega e suporte', text: 'Colocamos no ar, treinamos a equipe e seguimos junto depois.' },
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
    'Precisa de tudo pronto amanhã, sem tempo para entender o processo.',
    'Quer só um orçamento para comparar, sem intenção de fazer.',
  ],
}

export const faq = {
  index: '07',
  label: 'Perguntas',
  title: 'Perguntas frequentes.',
  items: [
    { q: 'Quanto custa um projeto?', a: 'Depende do tamanho. Depois da primeira conversa, enviamos uma proposta com escopo, prazo e preço fechados. Sem cobrança por hora.' },
    { q: 'Quanto tempo leva?', a: 'Um site sai em 1 a 2 semanas. Sistemas levam de 4 a 8 semanas na primeira versão. O prazo exato vai na proposta.' },
    { q: 'Funciona no celular e no tablet?', a: 'Sim. Tudo é pensado para celular desde o início, inclusive sistemas usados em campo.' },
    { q: 'E depois que entrega?', a: 'Seguimos junto: corrigimos o que aparecer e evoluímos o sistema conforme a empresa cresce.' },
    { q: 'Meus dados ficam seguros?', a: 'Cada pessoa vê só o que o cargo dela permite, e a regra fica no banco de dados, não só na tela.' },
  ],
}

export const finalCta = {
  title: 'Qual tarefa você não quer repetir amanhã?',
  text: 'Conta pra gente em uma frase. A gente responde com o próximo passo.',
}
