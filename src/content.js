/* =====================================================================
   ALL OF THE SITE'S WORDS LIVE HERE.
   Edit this file to change any text, link or project. Nothing else
   needs to be touched: the ride, the route map and the résumé section
   are all rendered from these objects.
   ===================================================================== */

const GH = 'https://github.com/iamsammy-ak'

export const person = {
  name: 'Abhishek Kumar',
  role: 'AI coach and enablement',
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
  title: 'I learned AI by shipping it. I’ll coach your team the same way.',
  body:
    'I’m Abhishek Kumar, a computer engineer in Turin who has been building with AI tools for more than three years: 40+ public projects, three hackathon podiums in 2026, and agents, copilots and automations that real people use.',
  cta: 'Start the ride',
  hint: 'Scroll to ride. Every stop is a piece of evidence.',
}

/* The stops on the road, in order. `coach` is the line that ties each
   piece of evidence back to coaching a team. */
export const stops = [
  {
    id: 'foundations',
    label: 'Engineer first',
    title: 'Engineer first',
    where: 'Politecnico di Torino and Fibzio, 2022 to 2025',
    body:
      'A B.Sc. in Computer Engineering, then data analysis at Fibzio: Power BI dashboards on SQL Server and PostgreSQL that cut reporting turnaround by 40% and incidents by 20%.',
    coach:
      'I also trained the clients who used those reports, and their satisfaction rose 25%. Teaching non-technical people to trust a new tool is where I started.',
  },
  {
    id: 'ai-daily',
    label: 'Building with AI',
    title: 'Three years of building with AI',
    where: 'Shipping solutions since 2023',
    body:
      'I work with AI the way your employees will: as a daily tool. Chat assistants, coding agents, local models through Ollama, hosted models through OpenRouter, and my own tool servers on the Model Context Protocol.',
    coach:
      'I know which habits make people faster and which ones waste an afternoon, because I have formed both.',
    links: [{ text: 'See all 40+ projects on GitHub', href: GH + '?tab=repositories' }],
  },
  {
    id: 'hackathons',
    label: 'Fast under pressure',
    title: 'Fast under pressure',
    where: 'Three hackathon podiums in 2026',
    body:
      'First place at Therness: defect detection across 1,551 welding samples. Second at the Automation Hackathon: an AI supply-chain risk platform built in five hours. First at LOKI: cityX, which turns street reports into prioritised incidents.',
    coach:
      'In a workshop I can build a working answer to someone’s real problem while they watch. That is what makes people believe the tool is for them.',
  },
  {
    id: 'under-the-hood',
    label: 'AI under the hood',
    title: 'AI under the hood',
    where: 'Eleven open-source systems, each one benchmarked',
    body:
      'I built the parts of an agent stack from scratch: retrieval, knowledge graphs, memory, multi-agent orchestration, tool servers and evaluation. One of them cut wrong answers from 27.5% to 4.3% against naive RAG on a synthetic benchmark.',
    coach:
      'When someone asks why the AI got it wrong, I can give the real reason and the fix, in plain language.',
    links: [{ text: 'Read the architecture teardown', href: GH + '/ai-architecture-teardown' }],
  },
  {
    id: 'responsible',
    label: 'Safe to use at work',
    title: 'Safe to use at work',
    where: 'Privacy, verification and a human in the loop',
    body:
      'A security proxy that masks personal data and detects prompt injection. A RAG pipeline that checks every claim against its source and abstains when unsure. An evaluation gate that blocks regressions. Recruiting and approval flows that keep a person in charge.',
    coach:
      'Employees need to know what never to paste, what to double-check and when to say no to the model. I teach those rules from systems I built to enforce them.',
    links: [{ text: 'View the security proxy', href: GH + '/inter-agent-security-proxy' }],
  },
  {
    id: 'departments',
    label: 'Every department',
    title: 'A use case for every department',
    where: 'Ten working assistants for business teams',
    body:
      'Recruiting, market intelligence, supply chain, procurement, operations, research, real estate, startup finance, security and project planning. Each one is a working assistant with its own repository.',
    coach:
      'I can show HR an HR example and procurement a procurement example. People adopt AI when the demo is about their own work.',
    links: [{ text: 'Browse them below', href: '#projects' }],
  },
  {
    id: 'microsoft',
    label: 'The Microsoft stack',
    title: 'Where your people already work',
    where: 'Microsoft 365 Copilot, Copilot Studio and Power Platform',
    body:
      'I work across the Microsoft stack: Copilot Studio for agents, Power Platform for automations and apps, Power BI and DAX for reporting, SQL Server for data. I also built an MCP server that lets an AI agent drive Microsoft Project through 51 tools.',
    coach:
      'Most employees meet AI inside Word, Excel, Teams and Outlook. That is where I would start coaching, not in a separate tool.',
    links: [{ text: 'View the Microsoft Project server', href: GH + '/ms-project-mcp' }],
  },
  {
    id: 'products',
    label: 'Products people use',
    title: 'Products people use',
    where: 'From research notebooks to a safety app',
    body:
      'A local-first research notebook that answers from your documents with clickable citations. A personal-safety app for Android. A professor directory covering 5,400+ staff records. A bus-stop aid for hearing-impaired passengers.',
    coach:
      'I design for the person in front of the screen. The same instinct decides whether a training session lands.',
    links: [{ text: 'View the research notebook', href: GH + '/mynotebooklm' }],
  },
  {
    id: 'people',
    label: 'Leading people',
    title: 'Leading people',
    where: 'President of PISA since 2023',
    body:
      'I lead the Politecnico Indian Students Association, which represents 1,000+ students. I ran a Red Bull-sponsored chess tournament for 400+ players, led a ten-person volunteer team at AIESEC, and shipped an MVP with a six-person cross-functional team at OpenSky VR.',
    coach:
      'Coaching is mostly getting busy people to show up, try something new and come back. I have done that at scale.',
  },
  {
    id: 'method',
    label: 'How I’d coach',
    title: 'How I’d coach your team',
    where: 'I have not held the title of AI coach yet. This is the method I would bring.',
    steps: [
      {
        name: 'Find the work worth automating.',
        text: 'Sit with each team and map the tasks AI can take on this month.',
      },
      {
        name: 'Teach by building.',
        text: 'Hands-on sessions where people solve their own tasks with Copilot and agents.',
      },
      {
        name: 'Set the guardrails.',
        text: 'What to verify, what never to paste, when to overrule the model.',
      },
      {
        name: 'Measure and share.',
        text: 'Track hours saved and adoption, then turn early wins into playbooks.',
      },
    ],
    coach: 'Every step comes from something you passed on this road.',
  },
]

export const destination = {
  id: 'arrive',
  label: 'Let’s talk',
  title: 'Let’s get your team building with AI.',
  body:
    'I’m looking for an AI coaching and enablement role, in Turin or remote. I would be glad to walk you through any stop on this road, or run a sample session for your team.',
}

/* ---------------------------------------------------------------------
   The résumé section below the ride.
   --------------------------------------------------------------------- */

const repo = (name, text, tech) => ({ name, text, tech, href: `${GH}/${name}` })

export const projectGroups = [
  {
    title: 'AI systems, built from scratch',
    note: 'The parts of an agent stack, each with its own benchmark.',
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
    title: 'AI assistants for business teams',
    note: 'One working assistant per department.',
    items: [
      repo('recruitflow-ai', 'HR: anonymised CV screening, job matching and interview scheduling, with a human in the loop.', 'Python'),
      repo('marketpulse-ai', 'Marketing: monitors competitor news, clusters trends and writes cited executive briefings.', 'Python'),
      repo('supplychainiq', 'Supply chain: predicts late deliveries, finds bottlenecks and scores supplier risk.', 'Python'),
      repo('dealsense-ai', 'Procurement: compares supplier quotes on total cost and drafts counter-offers.', 'Python'),
      repo('opsmind-ai', 'Operations: KPI anomaly detection and process mining that suggest Lean fixes.', 'Python'),
      repo('researchpilot-ai', 'Research: reads papers and datasets and writes reports with checked citations.', 'Python'),
      repo('venturelens-ai', 'Finance: unit economics, market sizing and an investment memo for any business idea.', 'Python'),
      repo('proptech-vision', 'Real estate: yields, cash flow, location scoring and AI-written risk memos.', 'Python'),
      repo('omni-pilot', 'Security: AI copilot for threat analysis and Italian NIS2 compliance reports.', 'TypeScript'),
      repo('projectpilot-ai', 'Project management: AI-assisted planning and tracking platform.', 'TypeScript'),
    ],
  },
  {
    title: 'AI tools and Microsoft integrations',
    note: 'Things I use myself, and things that plug AI into Microsoft products.',
    items: [
      repo('mynotebooklm', 'Local-first research notebook: chat with PDFs, web pages and videos, with clickable citations.', 'Python'),
      repo('ms-project-mcp', 'Lets an AI agent drive desktop Microsoft Project through 51 tools: tasks, resources, baselines, earned value.', 'Python'),
      repo('retailpulse', 'End-to-end BI project: star-schema SQL Server model, DAX measures and a Power BI dashboard.', 'T-SQL'),
      repo('snap-cinema-fx', 'Chrome extension that triggers webcam effects from hand gestures in video calls.', 'JavaScript'),
      repo('finpilot-ai', 'A personal CFO in the browser: bank import, forecasting, budgets and an advisor.', 'TypeScript'),
    ],
  },
  {
    title: 'Apps and platforms',
    note: 'Products built for real users.',
    items: [
      repo('lumin', 'Community-powered personal safety app for Android: live hazard map and one-press SOS.', 'Kotlin'),
      repo('ratemyprof', 'Professor directory and ratings for Politecnico di Torino, covering 5,400+ staff records.', 'JavaScript'),
      repo('ratemyDorm', 'Crowdsourced student-residence reviews for universities in Italy.', 'TypeScript'),
      repo('smart-stop', 'Helps hearing-impaired passengers identify an arriving bus, using two Raspberry Pis.', 'Python'),
      repo('CineSphere', 'Social network for film lovers on ASP.NET Core with clean architecture.', 'TypeScript'),
      repo('SynergySimulator', 'Merger and acquisition simulator with pro-forma financials and sensitivity heatmaps.', 'TypeScript'),
      repo('StockVault', 'Stock trading simulator with live quotes, watchlists and stop-loss orders.', 'Python'),
      repo('pocket-pups', 'A puppy companion game that runs in the browser.', 'JavaScript'),
      repo('portfolio', 'My earlier portfolio: a hand-drawn 3D sketchbook you walk through.', 'JavaScript'),
    ],
  },
]

export const experience = [
  {
    period: '2025',
    role: 'Technical Management Trainee',
    org: 'OpenSky VR Italia',
    text: 'Built a property visualisation platform with 3D walkthroughs and VR previews. Shipped the MVP in six months with a six-person team and cut presentation time by about 30%.',
  },
  {
    period: '2023 to 2024',
    role: 'Junior Data Analyst',
    org: 'Fibzio',
    text: 'Power BI dashboards on SQL Server and PostgreSQL tracking 10+ service metrics. Reporting turnaround down 40%, incidents down 20%, and client training that raised satisfaction by 25%.',
  },
  {
    period: '2023 to now',
    role: 'President',
    org: 'Politecnico Indian Students Association',
    text: 'Lead planning and initiatives for 1,000+ students. Organised a Red Bull-sponsored chess tournament with 400+ participants.',
  },
  {
    period: '2024',
    role: 'Logistics Coordinator',
    org: 'Torino 2025 FISU Games',
    text: 'Coordinated logistics across 5+ venues, from pre-event inspections to on-site execution.',
  },
  {
    period: '2022 to 2023',
    role: 'Marketing Manager',
    org: 'AIESEC',
    text: 'Led a volunteer team of 10+, coordinating events and tracking campaign performance.',
  },
]

export const hackathons = [
  {
    place: '1st place',
    name: 'cityX',
    event: 'LOKI Urban Monitoring Hackathon, October 2026',
    text: 'AI-powered civic platform that classifies street reports, removes duplicates and ranks them by risk, with privacy safeguards.',
  },
  {
    place: '2nd place',
    name: 'Risk Radar',
    event: 'Automation Hackathon, March 2026',
    text: 'AI supply-chain risk platform built in five hours, extracting supplier intelligence for 1,000+ vendors.',
  },
  {
    place: '1st place',
    name: 'Weld AI',
    event: 'Therness Hackathon, February 2026',
    text: 'Analysed 1,551 welding samples across thermal video, audio and sensor data to classify six defect types.',
  },
]

export const education = [
  { title: 'M.Sc. Engineering Management', org: 'Politecnico di Torino', period: '2025 to now' },
  { title: 'B.Sc. Computer Engineering', org: 'Politecnico di Torino', period: '2022 to 2025' },
]

export const certificates = ['McKinsey Forward Program', 'INSIDE LVMH Certificate', 'CS50, Harvard']

export const toolkit = [
  {
    title: 'AI',
    items: ['LLM apps and agents', 'RAG and retrieval', 'Prompt design', 'Evaluation', 'Model Context Protocol', 'OpenRouter', 'Ollama', 'ChatGPT', 'Claude Code'],
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
    items: ['Public speaking', 'Project management', 'Market research', 'JIRA', 'Notion', 'Figma'],
  },
]

export const languages = ['Hindi, native', 'English, professional', 'Italian, beginner']

/* Every stop on the road, in order: start, the stops above, arrival. */
export const route = [hero, ...stops, destination]
