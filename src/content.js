/* =====================================================================
   ALL OF THE SITE'S WORDS LIVE HERE.
   Edit this file to change any text, link or project. Nothing else
   needs to be touched: the ride, the route map and the résumé section
   are all rendered from these objects.
   ===================================================================== */

const GH = 'https://github.com/iamsammy-ak'

export const person = {
  name: 'Abhishek Kumar',
  role: 'Computer engineer, building with AI',
  location: 'Turin, Italy',
  email: 'kumarabhishekk363@gmail.com',
  links: {
    github: GH,
    linkedin: 'https://www.linkedin.com/in/sammy4bhishek/',
    cv: './Abhishek_Kumar_CV.pdf',
  },
}

export const hero = {
  id: 'start',
  label: 'Start',
  title: 'I build AI that people can understand and use.',
  body:
    'Computer engineer and Engineering Management student at Politecnico di Torino. Three years of building with AI: more than 40 public projects and three hackathon podiums in 2026.',
  cta: 'Begin',
}

/* The stops on the road, in order. `note` is a short second paragraph:
   either a concept explained in plain terms, or a fact worth adding. */
const PLAIN = 'In plain terms'
const NOTE = 'Worth noting'

export const stops = [
  {
    id: 'foundations',
    label: 'Foundations',
    title: 'Engineering and data',
    where: 'Politecnico di Torino and Fibzio, 2022 to 2025',
    body:
      'A B.Sc. in Computer Engineering, alongside data analysis at Fibzio: Power BI dashboards on SQL Server and PostgreSQL that reduced reporting turnaround by 40% and incidents by 20%.',
    noteLabel: NOTE,
    note: 'I also trained the clients who used those dashboards. Their satisfaction scores rose by 25%.',
  },
  {
    id: 'ai-daily',
    label: 'Building with AI',
    title: 'Three years of building with AI',
    where: 'Delivering working solutions since 2023',
    body:
      'I use AI as an everyday engineering tool: chat assistants, coding agents, local models through Ollama, hosted models through OpenRouter, and tool servers I wrote on the Model Context Protocol.',
    noteLabel: PLAIN,
    note: 'A language model predicts useful text. The skill lies in giving it the right context and checking what comes back.',
    links: [{ text: 'All projects on GitHub', href: GH + '?tab=repositories' }],
  },
  {
    id: 'hackathons',
    label: 'Hackathons',
    title: 'Three podiums in 2026',
    where: 'Therness, Automation Hackathon and LOKI',
    body:
      'First place at Therness: defect detection across 1,551 welding samples. Second place at the Automation Hackathon: an AI supply-chain risk platform built in five hours. First place at LOKI: cityX, which turns street reports into prioritised incidents.',
    noteLabel: NOTE,
    note: 'Each project went from an open brief to a working product within the event.',
  },
  {
    id: 'under-the-hood',
    label: 'AI systems',
    title: 'How AI systems work',
    where: 'Eleven open-source systems, each one benchmarked',
    body:
      'I built the components of an agent stack from first principles: retrieval, knowledge graphs, memory, multi-agent orchestration, tool servers and evaluation. One of them reduced wrong answers from 27.5% to 4.3% against a standard baseline on a synthetic benchmark.',
    noteLabel: PLAIN,
    note: 'Retrieval lets a model look things up before it answers, like an open-book exam. Most wrong answers come from a poor lookup, not a poor model.',
    links: [{ text: 'Architecture teardown', href: GH + '/ai-architecture-teardown' }],
  },
  {
    id: 'responsible',
    label: 'Responsible use',
    title: 'Responsible use',
    where: 'Privacy, verification and human oversight',
    body:
      'A security proxy that masks personal data and detects prompt injection. A retrieval pipeline that checks every claim against its source and abstains when uncertain. An evaluation gate that blocks regressions before release.',
    noteLabel: PLAIN,
    note: 'Three habits cover most of the risk: do not share what you would not email, verify anything you will act on, and keep a person responsible for the final decision.',
    links: [{ text: 'Security proxy', href: GH + '/inter-agent-security-proxy' }],
  },
  {
    id: 'departments',
    label: 'Business functions',
    title: 'AI across business functions',
    where: 'Ten working assistants',
    body:
      'Recruiting, market intelligence, supply chain, procurement, operations, research, real estate, startup finance, security and project planning. Each is a working assistant with its own repository.',
    noteLabel: PLAIN,
    note: 'The same pattern applies in every function: gather the relevant documents, ask a precise question, then review the draft.',
    links: [{ text: 'View the projects', href: '#projects' }],
  },
  {
    id: 'microsoft',
    label: 'Microsoft stack',
    title: 'The Microsoft stack',
    where: 'Microsoft 365 Copilot, Copilot Studio and Power Platform',
    body:
      'Copilot Studio for agents, Power Platform for automation and apps, Power BI and DAX for reporting, and SQL Server for data. I also built an MCP server that lets an AI agent operate Microsoft Project through 51 tools.',
    noteLabel: PLAIN,
    note: 'Copilot is most useful where the work already happens: summarising a thread in Teams, drafting in Word, analysing a sheet in Excel.',
    links: [{ text: 'Microsoft Project server', href: GH + '/ms-project-mcp' }],
  },
  {
    id: 'products',
    label: 'Products',
    title: 'Products in use',
    where: 'From a research notebook to a safety app',
    body:
      'A local-first research notebook that answers from your documents with clickable citations. A personal-safety app for Android. A professor directory covering more than 5,400 staff records. A bus-stop aid for hearing-impaired passengers.',
    noteLabel: NOTE,
    note: 'Each was designed for people outside technology: students, commuters and residents.',
    links: [{ text: 'Research notebook', href: GH + '/mynotebooklm' }],
  },
  {
    id: 'people',
    label: 'Leadership',
    title: 'Leading people',
    where: 'President of PISA since 2023',
    body:
      'I lead the Politecnico Indian Students Association, which represents more than 1,000 students. I organised a Red Bull-sponsored chess tournament for over 400 players, led a volunteer team of ten at AIESEC, and delivered an MVP with a six-person cross-functional team at OpenSky VR.',
    noteLabel: NOTE,
    note: 'At this scale the work is mostly communication: plans people can follow, and reasons they can accept.',
  },
  {
    id: 'method',
    label: 'Approach',
    title: 'How I work',
    where: 'The same four steps on every project',
    steps: [
      { name: 'Start from the task.', text: 'Understand the work before choosing a tool.' },
      { name: 'Build a working version early.', text: 'A prototype on real data settles most questions.' },
      { name: 'Make it dependable.', text: 'Verification, privacy and a clear owner.' },
      { name: 'Explain it.', text: 'Document, demonstrate, and train the people who will use it.' },
    ],
  },
]

export const destination = {
  id: 'arrive',
  label: 'Contact',
  title: 'Thank you for your time.',
  body:
    'I am based in Turin and available remotely. I am interested in roles that bring AI into everyday work: adoption, training, product and data.',
}

/* ---------------------------------------------------------------------
   The résumé section below the ride.
   --------------------------------------------------------------------- */

const repo = (name, text, tech) => ({ name, text, tech, href: `${GH}/${name}` })

export const projectGroups = [
  {
    title: 'AI systems',
    note: 'The components of an agent stack, each with its own benchmark.',
    items: [
      repo('ai-architecture-teardown', 'How the eleven systems fit together: reference architecture, 16 decision records and a cost-per-task model.', 'Python'),
      repo('semantic-cache-gateway', 'OpenAI-compatible gateway with exact and semantic caching, complexity routing and per-tenant budgets.', 'Python'),
      repo('inter-agent-security-proxy', 'Masks personal data, detects prompt injection and enforces least-privilege tool policies between agents.', 'Python'),
      repo('durable-agent-state-machine', 'Durable runtime for agent workflows. Chaos-tested with 200 process kills: zero lost runs, zero duplicates.', 'Python'),
      repo('typed-multi-agent-swarm', 'Supervisor-led Researcher, Coder, Executor and Reviewer agents with typed hand-offs and voting.', 'Python'),
      repo('hybrid-rerank-retrieval', 'Hybrid search on a CPU: BM25 from scratch, dense retrieval, fusion and cross-encoder reranking.', 'Python'),
      repo('graphrag-knowledge-pipeline', 'Turns documents into a knowledge graph and answers multi-hop questions, citing every edge.', 'Python'),
      repo('self-correcting-agentic-rag', 'Verifies every claim against its citation and abstains when unsure. Wrong answers: 27.5% to 4.3%.', 'Python'),
      repo('three-tier-agent-memory', 'Long-term memory for agents: scratchpad, compressed episodes and versioned facts.', 'Python'),
      repo('raw-mcp-tool-server', 'Model Context Protocol server on raw JSON-RPC, with scoped permissions and a sandbox.', 'Python'),
      repo('context-assembler-engine', 'Builds prompts under a hard token budget and explains every cut it makes.', 'Python'),
      repo('trajectory-eval-gate', 'Grades agent runs step by step and blocks pull requests that regress.', 'Python'),
    ],
  },
  {
    title: 'AI for business functions',
    note: 'One working assistant per function.',
    items: [
      repo('recruitflow-ai', 'HR: anonymised CV screening, job matching and interview scheduling, with a human in the loop.', 'Python'),
      repo('marketpulse-ai', 'Marketing: monitors competitor news, clusters trends and writes cited executive briefings.', 'Python'),
      repo('supplychainiq', 'Supply chain: predicts late deliveries, finds bottlenecks and scores supplier risk.', 'Python'),
      repo('dealsense-ai', 'Procurement: compares supplier quotes on total cost and drafts counter-offers.', 'Python'),
      repo('opsmind-ai', 'Operations: KPI anomaly detection and process mining that suggest Lean improvements.', 'Python'),
      repo('researchpilot-ai', 'Research: reads papers and datasets and writes reports with checked citations.', 'Python'),
      repo('venturelens-ai', 'Finance: unit economics, market sizing and an investment memo for any business idea.', 'Python'),
      repo('proptech-vision', 'Real estate: yields, cash flow, location scoring and AI-written risk memos.', 'Python'),
      repo('omni-pilot', 'Security: AI copilot for threat analysis and Italian NIS2 compliance reports.', 'TypeScript'),
      repo('projectpilot-ai', 'Project management: AI-assisted planning and tracking platform.', 'TypeScript'),
    ],
  },
  {
    title: 'AI tools and Microsoft integrations',
    note: 'Tools for daily use, and integrations with Microsoft products.',
    items: [
      repo('mynotebooklm', 'Local-first research notebook: chat with PDFs, web pages and videos, with clickable citations.', 'Python'),
      repo('ms-project-mcp', 'Lets an AI agent operate desktop Microsoft Project through 51 tools: tasks, resources, baselines, earned value.', 'Python'),
      repo('retailpulse', 'End-to-end BI project: star-schema SQL Server model, DAX measures and a Power BI dashboard.', 'T-SQL'),
      repo('snap-cinema-fx', 'Chrome extension that triggers webcam effects from hand gestures in video calls.', 'JavaScript'),
      repo('finpilot-ai', 'Personal finance in the browser: bank import, forecasting, budgets and an advisor.', 'TypeScript'),
    ],
  },
  {
    title: 'Apps and platforms',
    note: 'Products built for everyday users.',
    items: [
      repo('lumin', 'Community-powered personal safety app for Android: live hazard map and one-press SOS.', 'Kotlin'),
      repo('ratemyprof', 'Professor directory and ratings for Politecnico di Torino, covering 5,400+ staff records.', 'JavaScript'),
      repo('ratemyDorm', 'Crowdsourced student-residence reviews for universities in Italy.', 'TypeScript'),
      repo('smart-stop', 'Helps hearing-impaired passengers identify an arriving bus, using two Raspberry Pis.', 'Python'),
      repo('CineSphere', 'Social network for film enthusiasts on ASP.NET Core with clean architecture.', 'TypeScript'),
      repo('SynergySimulator', 'Merger and acquisition simulator with pro-forma financials and sensitivity heatmaps.', 'TypeScript'),
      repo('StockVault', 'Stock trading simulator with live quotes, watchlists and stop-loss orders.', 'Python'),
      repo('pocket-pups', 'A companion game that runs in the browser.', 'JavaScript'),
      repo('portfolio', 'An earlier portfolio: a hand-drawn 3D sketchbook.', 'JavaScript'),
    ],
  },
]

export const experience = [
  {
    period: '2025',
    role: 'Technical Management Trainee',
    org: 'OpenSky VR Italia',
    text: 'Built a property visualisation platform with 3D walkthroughs and VR previews. Delivered the MVP in six months with a six-person team and reduced presentation time by about 30%.',
  },
  {
    period: '2023 to 2024',
    role: 'Junior Data Analyst',
    org: 'Fibzio',
    text: 'Power BI dashboards on SQL Server and PostgreSQL tracking more than ten service metrics. Reporting turnaround down 40%, incidents down 20%, and client training that raised satisfaction by 25%.',
  },
  {
    period: '2023 to present',
    role: 'President',
    org: 'Politecnico Indian Students Association',
    text: 'Lead planning and initiatives for more than 1,000 students. Organised a Red Bull-sponsored chess tournament with over 400 participants.',
  },
  {
    period: '2024',
    role: 'Logistics Coordinator',
    org: 'Torino 2025 FISU Games',
    text: 'Coordinated logistics across more than five venues, from pre-event inspections to on-site execution.',
  },
  {
    period: '2022 to 2023',
    role: 'Marketing Manager',
    org: 'AIESEC',
    text: 'Led a volunteer team of more than ten, coordinating events and tracking campaign performance.',
  },
]

export const hackathons = [
  {
    place: 'First place',
    name: 'cityX',
    event: 'LOKI Urban Monitoring Hackathon, October 2026',
    text: 'AI-powered civic platform that classifies street reports, removes duplicates and ranks them by risk, with privacy safeguards.',
  },
  {
    place: 'Second place',
    name: 'Risk Radar',
    event: 'Automation Hackathon, March 2026',
    text: 'AI supply-chain risk platform built in five hours, extracting supplier intelligence for more than 1,000 vendors.',
  },
  {
    place: 'First place',
    name: 'Weld AI',
    event: 'Therness Hackathon, February 2026',
    text: 'Analysed 1,551 welding samples across thermal video, audio and sensor data to classify six defect types.',
  },
]

export const education = [
  { title: 'M.Sc. Engineering Management', org: 'Politecnico di Torino', period: '2025 to present' },
  { title: 'B.Sc. Computer Engineering', org: 'Politecnico di Torino', period: '2022 to 2025' },
]

export const certificates = ['McKinsey Forward Program', 'INSIDE LVMH Certificate', 'CS50, Harvard']

export const toolkit = [
  {
    title: 'AI',
    items: ['LLM applications and agents', 'Retrieval (RAG)', 'Prompt design', 'Evaluation', 'Model Context Protocol', 'OpenRouter', 'Ollama', 'ChatGPT', 'Claude Code'],
  },
  {
    title: 'Microsoft',
    items: ['Microsoft 365 Copilot', 'Copilot Studio', 'Power Platform', 'Power BI and DAX', 'Power Automate', 'SQL Server', 'Microsoft Project', 'Excel'],
  },
  {
    title: 'Engineering and data',
    items: ['Python', 'SQL', 'PostgreSQL', 'TypeScript', 'React', 'Docker', 'MATLAB'],
  },
  {
    title: 'Working with people',
    items: ['AI coaching and training', 'Client training', 'Public speaking', 'Project management', 'Market research', 'JIRA, Notion, Figma'],
  },
]

export const languages = ['Hindi, native', 'English, professional', 'Italian, beginner']

/* Every stop on the road, in order: start, the stops above, arrival. */
export const route = [hero, ...stops, destination]
