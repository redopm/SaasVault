import { THEMES } from './themes';

export interface Template {
  id: string;
  title: string;
  category: 'B2B SaaS' | 'D2C / E-commerce' | 'AI & DeepTech' | 'Fintech' | 'Agencies' | 'Other';
  thumbnailUrl: string;
  isPro: boolean;
  defaultTheme: string;
  defaultFont: string;
  slides: any[];
}

// ─── MASTER SLIDE BLOCKS (YC / Sentinel quality) ────────────────────────────

const masterSaaS: any[] = [
  {
    type: 'title', companyName: '[Company]',
    tagline: 'The operating system for modern B2B teams.',
    tag: 'B2B SaaS · AI'
  },
  {
    type: 'split', tag: 'THE PROBLEM', title: 'Enterprise Ops Are Broken',
    content: 'Mid-market companies lose 40% of revenue to tool fragmentation and manual syncs every quarter.',
    items: [
      '$140K/year lost per team from siloed data (McKinsey, 2024)',
      'Average of 14 disconnected tools per ops team — zero integration',
      '68% of decisions delayed by lack of real-time cross-tool data'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'split', tag: 'THE SOLUTION', title: 'One Platform. One Source of Truth.',
    content: 'Connect your entire stack in 2 clicks. Automate 80% of ops workflows with zero code required.',
    items: [
      'Native integrations with 300+ tools (Salesforce, HubSpot, Jira)',
      'AI-powered workflow automation — no engineers needed',
      'Real-time dashboards with live data from every source',
      'SOC2 Type II certified — enterprise-grade security'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'list', tag: 'WHY NOW', title: 'The Window Is Now',
    items: [
      'GPT-4 (2023) made AI-native ops automation viable — legacy tools can\'t catch up',
      'Remote-first mandated 14-tool stacks — consolidation demand hit all-time high in 2024',
      'SOC2 Type II now required by 78% of enterprise procurement — we\'re pre-certified',
      'Series A SaaS valuations rebounding in 2025 — execution window is 18 months'
    ]
  },
  {
    type: 'list', tag: 'HOW IT WORKS', title: 'Live in 15 Minutes, Not 6 Months',
    items: [
      'Step 1: Connect your existing tools via 1-click OAuth (no engineers)',
      'Step 2: AI maps your data schema and builds your dashboard automatically',
      'Step 3: Set triggers — workflows run autonomously 24/7 in the background',
      'Step 4: Get weekly ROI impact reports delivered to your exec team'
    ]
  },
  {
    type: 'chart', tag: 'MARKET OPPORTUNITY', title: '$45B SaaS Ops Market',
    content: '24% CAGR — AI-native platforms replacing legacy point solutions by 2026.',
    chartType: 'horizontalBar',
    data: [
      { label: 'TAM — Global SaaS Ops ($B)', value: 45 },
      { label: 'SAM — Mid-Market Ops ($B)', value: 12 },
      { label: 'SOM — AI Workflows ($B)', value: 2 }
    ]
  },
  {
    type: 'metrics', tag: 'TRACTION', title: '$185K MRR. Zero Churn.',
    content: 'Growing 18% month-over-month. 100% organic — zero paid marketing.',
    metrics: [
      { label: 'MRR', value: '$185K', desc: '+18% MoM' },
      { label: 'Teams', value: '120+', desc: 'Across 4 countries' },
      { label: 'NDR', value: '114%', desc: 'Net expansion' },
      { label: 'NPS', value: '72', desc: 'World-class' }
    ]
  },
  {
    type: 'chart', tag: 'GROWTH', title: '18% MoM Growth Trajectory',
    content: 'Organic growth only. Word-of-mouth and product-led acquisition.',
    chartType: 'line',
    data: [
      { label: 'Jan', value: 40 }, { label: 'Feb', value: 58 }, { label: 'Mar', value: 75 },
      { label: 'Apr', value: 105 }, { label: 'May', value: 145 }, { label: 'Jun', value: 185 }
    ]
  },
  {
    type: 'metrics', tag: 'BUSINESS MODEL', title: 'Usage-Based SaaS — Land & Expand',
    content: 'Teams start small and expand as value compounds month over month.',
    metrics: [
      { label: 'Starter', value: '$299', desc: '/mo · 5 users' },
      { label: 'Growth', value: '$899', desc: '/mo · 25 users' },
      { label: 'Enterprise', value: '$2K+', desc: '/mo · unlimited' },
      { label: 'LTV:CAC', value: '22:1', desc: 'Class-leading' }
    ]
  },
  {
    type: 'chart', tag: 'COMPETITIVE LANDSCAPE', title: 'We Win Where It Counts',
    content: 'Time-to-value score — the #1 buying criteria for ops teams.',
    chartType: 'bar',
    data: [
      { label: '[Company]', value: 96 }, { label: 'Zapier', value: 60 },
      { label: 'Make.com', value: 52 }, { label: 'Manual Ops', value: 18 }
    ]
  },
  {
    type: 'list', tag: 'THE TEAM', title: "Operators Who've Scaled Before",
    items: [
      '[CEO Name] · CEO — Ex-Salesforce, built operations automation product to $40M ARR',
      '[CTO Name] · CTO — Ex-Stripe, led core API infrastructure team for 4 years',
      '[VP Sales] · VP Sales — Scaled Notion APAC from $0 → $8M ARR in 14 months',
      'Advisor: [Name] — Partner, Sequoia Capital (Notion, Figma, Stripe portfolio)'
    ]
  },
  {
    type: 'list', tag: 'THE ASK', title: 'Raising $2M Seed',
    items: [
      '50% Engineering — grow team from 6 → 12 engineers',
      '35% GTM & Sales — target Fortune 1000 pipeline',
      '15% Operations — 24-month runway secured',
      'Milestone: $1.5M ARR → Series A in 18 months'
    ]
  }
];

const masterD2C: any[] = [
  {
    type: 'title', companyName: '[Company]',
    tagline: 'Redefining the daily ritual for the modern, conscious consumer.',
    tag: 'D2C · Consumer Brand'
  },
  {
    type: 'split', tag: 'THE PROBLEM', title: 'The $180B Industry Is Lying to You',
    content: 'Legacy brands use 70% synthetic ingredients, greenwash their labels, and rely on dying retail channels.',
    items: [
      '73% of Gen Z distrust incumbent beauty/wellness brands (Edelman, 2024)',
      '$2.1B in consumer lawsuits filed against "natural" label fraud in 2023',
      'Retail margins eat 45% — brands are forced to cut product quality to survive'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'split', tag: 'THE SOLUTION', title: 'Radical Transparency. Radical Quality.',
    content: 'Every ingredient QR-code traceable to its source. Minimalist design Gen Z actually wants to share.',
    items: [
      '100% clean, ethically sourced ingredients (third-party verified)',
      'Carbon-neutral supply chain — B-Corp certification pending',
      'Subscription-first model — 60% of revenue is recurring',
      'TikTok-native brand — content is the product'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'list', tag: 'WHY NOW', title: 'The Window Is Now',
    items: [
      'Gen Z became the largest consumer cohort in 2024 — they buy on values, not brand legacy',
      'TikTok Shop reached $20B GMV in 2024 — DTC brands with strong content win by default',
      'Post-COVID supply chain normalization cut clean ingredient costs 35% — margins now viable',
      'FDA tightened "natural" labeling rules in 2025 — incumbents are scrambling, we\'re compliant'
    ]
  },
  {
    type: 'list', tag: 'HOW IT WORKS', title: 'Farm to Feed in 4 Steps',
    items: [
      'Step 1: Ethically sourced from 12 certified farms across 5 countries',
      'Step 2: Cold-processed to retain maximum bioactive compounds',
      'Step 3: DTC checkout with subscription upsell at 62% conversion rate',
      'Step 4: UGC engine — every buyer gets a shareable unboxing kit'
    ]
  },
  {
    type: 'chart', tag: 'MARKET OPPORTUNITY', title: '$82B Clean Beauty Market',
    content: '19% CAGR — Gen Z driving accelerating shift away from legacy brands.',
    chartType: 'horizontalBar',
    data: [
      { label: 'TAM — Global Wellness ($B)', value: 82 },
      { label: 'SAM — Clean Beauty/Nutrition ($B)', value: 18 },
      { label: 'SOM — DTC Premium Segment ($B)', value: 1.8 }
    ]
  },
  {
    type: 'metrics', tag: 'TRACTION', title: '$420K Revenue. 90-Day Track Record.',
    content: 'Launched 90 days ago. Zero paid ads in first 60 days — all organic TikTok.',
    metrics: [
      { label: 'Revenue', value: '$420K', desc: 'First 90 days' },
      { label: 'ROAS', value: '4.2x', desc: 'Blended return' },
      { label: 'Repeat Rate', value: '52%', desc: 'Within 60 days' },
      { label: 'Gross Margin', value: '74%', desc: 'After COGS' }
    ]
  },
  {
    type: 'chart', tag: 'GROWTH', title: 'Revenue Compounding Fast',
    content: 'Week-over-week growth accelerating as subscription cohorts stack.',
    chartType: 'line',
    data: [
      { label: 'Month 1', value: 35 }, { label: 'Month 2', value: 90 }, { label: 'Month 3', value: 165 },
      { label: 'Month 4', value: 260 }, { label: 'Month 5', value: 420 }
    ]
  },
  {
    type: 'metrics', tag: 'BUSINESS MODEL', title: 'Subscription-First D2C Engine',
    content: 'One-time buyers convert to subscribers at 38%. Cohort LTV compounds monthly.',
    metrics: [
      { label: 'Starter Box', value: '$35', desc: 'one-time / trial' },
      { label: 'Monthly Sub', value: '$29', desc: '/mo · save 17%' },
      { label: 'Annual Plan', value: '$249', desc: '/yr · save 30%' },
      { label: 'LTV:CAC', value: '8.5:1', desc: '18-mo cohort' }
    ]
  },
  {
    type: 'chart', tag: 'COMPETITIVE LANDSCAPE', title: 'We Win on What Buyers Care About',
    content: 'Composite score: ingredient purity + brand trust + Gen Z resonance (0–100).',
    chartType: 'bar',
    data: [
      { label: '[Company]', value: 94 }, { label: 'Glow Recipe', value: 62 },
      { label: 'Drunk Elephant', value: 55 }, { label: 'Legacy Brands', value: 28 }
    ]
  },
  {
    type: 'list', tag: 'THE TEAM', title: 'Brand Builders & Growth Operators',
    items: [
      '[CEO Name] · CEO — Ex-Glossier, built brand from $0 → $35M GMV in 2 years',
      '[CMO Name] · CMO — Grew 3 DTC brands to 7-figure revenue via TikTok strategy',
      '[COO Name] · COO — Ex-Hims & Hers, managed supply chain for 200+ SKUs globally',
      'Advisor: [Name] — General Partner, Forerunner Ventures (Warby Parker, Birchbox)'
    ]
  },
  {
    type: 'list', tag: 'THE ASK', title: 'Raising $1.5M Pre-Seed',
    items: [
      '55% Inventory & Supply Chain — scale to 10,000 units/month',
      '30% Performance Marketing — launch paid channels targeting 4x ROAS',
      '15% Team — hire Head of Community & Brand Partnerships',
      'Milestone: $2M ARR → Seed round in 12 months'
    ]
  }
];

const masterAI: any[] = [
  {
    type: 'title', companyName: '[Company]',
    tagline: 'Autonomous AI agents that replace entire enterprise workflows.',
    tag: 'AI & DeepTech'
  },
  {
    type: 'split', tag: 'THE PROBLEM', title: 'Enterprise AI Has a Reality Problem',
    content: 'Generic LLMs hallucinate 23% of the time on domain tasks — completely unacceptable for enterprise.',
    items: [
      '23% hallucination rate on domain tasks renders LLMs unusable (Stanford, 2024)',
      '$6.2M average annual cost enterprises waste on failed AI pilots',
      'GDPR & HIPAA block cloud LLMs from handling sensitive enterprise workloads'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'split', tag: 'THE SOLUTION', title: 'Domain-Specific AI. On-Premise.',
    content: 'We build custom fine-tuned models on your proprietary data — deployed in your VPC in 72 hours.',
    items: [
      'Models trained on your enterprise data — 96%+ accuracy on domain tasks',
      'On-premise VPC deployment — your data never leaves your infrastructure',
      'Self-improving feedback loop — gets smarter with every inference',
      'Full audit trails for SOC2, ISO 27001, and HIPAA compliance'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'list', tag: 'WHY NOW', title: 'The Window Is Now',
    items: [
      'Open-source LLMs (Llama 3, Mistral) now match GPT-4 quality — on-prem AI is finally viable',
      'EU AI Act (2025) mandates explainability — cloud LLMs can\'t comply, on-prem solutions can',
      'Enterprise AI budgets grew 340% in 2024 — every Fortune 500 has dedicated AI capex',
      'First-mover in domain-specific AI wins all — model quality compounds with proprietary data'
    ]
  },
  {
    type: 'list', tag: 'HOW IT WORKS', title: 'From Raw Data to AI Agent in 72 Hours',
    items: [
      'Step 1: Ingest your proprietary datasets (docs, CRM, ERP) via secure encrypted connectors',
      'Step 2: Platform fine-tunes a domain-specific model on your data in our secure cluster',
      'Step 3: Agent deployed in your VPC — one REST API endpoint, live in 72 hours',
      'Step 4: Continuous retraining loop — accuracy improves every week automatically'
    ]
  },
  {
    type: 'chart', tag: 'MARKET OPPORTUNITY', title: '$1.2T Enterprise AI Market',
    content: '38% CAGR — enterprise on-premise AI growing 4x faster than cloud alternatives.',
    chartType: 'horizontalBar',
    data: [
      { label: 'TAM — Global Enterprise AI ($B)', value: 1200 },
      { label: 'SAM — Domain AI Agents ($B)', value: 180 },
      { label: 'SOM — On-Prem VPC AI ($B)', value: 28 }
    ]
  },
  {
    type: 'metrics', tag: 'TRACTION', title: '$380K MRR. 3 Fortune 500 Pilots.',
    content: 'All pilots converted to annual contracts. Zero churn. NPS of 81.',
    metrics: [
      { label: 'MRR', value: '$380K', desc: '+28% MoM' },
      { label: 'Accuracy', value: '96.4%', desc: 'vs 77% generic LLM' },
      { label: 'Clients', value: '18', desc: 'Enterprise / F500' },
      { label: 'NPS', value: '81', desc: 'Exceptional' }
    ]
  },
  {
    type: 'chart', tag: 'GROWTH', title: '28% MoM Revenue Growth',
    content: 'Enterprise contracts average $280K ACV. Zero marketing spend to date.',
    chartType: 'line',
    data: [
      { label: 'Month 1', value: 60 }, { label: 'Month 2', value: 105 }, { label: 'Month 3', value: 160 },
      { label: 'Month 4', value: 235 }, { label: 'Month 5', value: 310 }, { label: 'Month 6', value: 380 }
    ]
  },
  {
    type: 'metrics', tag: 'BUSINESS MODEL', title: 'ACV SaaS + Usage-Based Compute',
    content: 'Customers pay for the model license + pay-per-inference at scale.',
    metrics: [
      { label: 'Model License', value: '$15K', desc: '/mo · base tier' },
      { label: 'Enterprise', value: '$45K', desc: '/mo · full stack' },
      { label: 'Compute', value: '$0.02', desc: '/ 1K tokens' },
      { label: 'LTV:CAC', value: '31:1', desc: 'Best-in-class' }
    ]
  },
  {
    type: 'chart', tag: 'COMPETITIVE LANDSCAPE', title: 'Domain Accuracy on Enterprise Tasks',
    content: 'Benchmark: finance document extraction accuracy (0–100 score).',
    chartType: 'bar',
    data: [
      { label: '[Company]', value: 96 }, { label: 'GPT-4 Fine-tuned', value: 74 },
      { label: 'Claude 3.5', value: 71 }, { label: 'Generic RAG', value: 55 }
    ]
  },
  {
    type: 'list', tag: 'THE TEAM', title: 'Deep AI Researchers, Proven Builders',
    items: [
      '[CEO Name] · CEO — Ex-DeepMind Research Lead, 8 peer-reviewed papers on domain AI',
      '[CTO Name] · CTO — Ex-NVIDIA, architected inference engine for 10M+ requests/day',
      '[VP Eng] · VP Engineering — Ex-OpenAI, built GPT-3 fine-tuning pipeline from scratch',
      'Advisor: [Name] — Co-founder, Hugging Face; 2 successful AI exits totaling $1.2B'
    ]
  },
  {
    type: 'list', tag: 'THE ASK', title: 'Raising $5M Seed',
    items: [
      '65% GPU Infrastructure & Compute — scale to 10 enterprise models in parallel',
      '25% ML Researchers & Engineers — grow ML team to 8 PhDs',
      '10% Enterprise Sales — hire 2 AEs for Fortune 500 focus',
      'Milestone: $4M ARR → Series A at $40M+ valuation in 18 months'
    ]
  }
];

const masterFintech: any[] = [
  {
    type: 'title', companyName: '[Company]',
    tagline: 'The payments infrastructure the Fortune 500 should have had 10 years ago.',
    tag: 'Fintech · B2B Payments'
  },
  {
    type: 'split', tag: 'THE PROBLEM', title: 'Global B2B Payments Are Still Broken',
    content: 'Cross-border B2B payments cost $120B/year in fees and take 3–5 days to settle — a 1970s problem.',
    items: [
      '5.2% average cross-border payment fee destroys SMB margins (World Bank, 2024)',
      'T+3 settlement times freeze $18T in working capital globally every year',
      'SWIFT rails were designed in 1973 — no API, no real-time, no developer access'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'split', tag: 'THE SOLUTION', title: 'One API. Real-Time Global Settlements.',
    content: 'Connect to our single REST API — real-time cross-border payments at 0.15% flat. 35x cheaper than SWIFT.',
    items: [
      'Real-time settlement in 140+ countries via our proprietary rail network',
      '0.15% flat fee — no FX markups, no hidden charges, no surprises ever',
      'Developer-first: full SDK in Node, Python, Go — live in 30 minutes',
      'SOC2 Type II + PCI-DSS Level 1 + FinCEN licensed in 52 jurisdictions'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'list', tag: 'WHY NOW', title: 'The Window Is Now',
    items: [
      'FedNow launched July 2023 — US real-time payment infrastructure finally exists',
      'SWIFT ISO 20022 migration created a 3-year compatibility gap — our API fills it perfectly',
      'Cross-border e-commerce hit $6.3T in 2024 — payment friction is the #1 abandonment cause',
      'Basel IV capital requirements make legacy bank FX desks 40% more expensive from 2025'
    ]
  },
  {
    type: 'list', tag: 'HOW IT WORKS', title: 'Send Money Globally in 3 Steps',
    items: [
      'Step 1: Integrate our SDK in under 30 minutes — just 2 API calls',
      'Step 2: Initiate payment — AI routes via optimal global liquidity path',
      'Step 3: Recipient receives funds in <8 seconds (vs 3–5 days on SWIFT)',
      'Step 4: Full audit trail, FX receipt, and compliance docs auto-generated'
    ]
  },
  {
    type: 'chart', tag: 'MARKET OPPORTUNITY', title: '$240B Global B2B Payments Market',
    content: '15% CAGR — API-first rails replacing legacy SWIFT infrastructure by 2027.',
    chartType: 'horizontalBar',
    data: [
      { label: 'TAM — Global B2B Payments ($B)', value: 240 },
      { label: 'SAM — Cross-Border API Payments ($B)', value: 42 },
      { label: 'SOM — SMB/Mid-Market ($B)', value: 3.5 }
    ]
  },
  {
    type: 'metrics', tag: 'TRACTION', title: '$850M GMV Processed. 25% MoM.',
    content: '18 months since launch. 420 active business customers. NRR of 128%.',
    metrics: [
      { label: 'Ann. GMV', value: '$850M', desc: 'Processed' },
      { label: 'Net Revenue', value: '$1.27M', desc: 'MRR at 0.15%' },
      { label: 'Customers', value: '420', desc: 'Active businesses' },
      { label: 'NRR', value: '128%', desc: 'Net expansion' }
    ]
  },
  {
    type: 'chart', tag: 'GROWTH', title: '25% MoM GMV Growth',
    content: 'No enterprise sales team yet. All growth is entirely product-led.',
    chartType: 'line',
    data: [
      { label: 'Q1', value: 80 }, { label: 'Q2', value: 185 },
      { label: 'Q3', value: 380 }, { label: 'Q4', value: 850 }
    ]
  },
  {
    type: 'metrics', tag: 'BUSINESS MODEL', title: 'Transaction Fee + SaaS Tiers',
    content: 'We earn from every dollar moved. Volume discounts drive enterprise expansion.',
    metrics: [
      { label: 'Base API', value: '0.15%', desc: 'per transaction' },
      { label: 'Pro Tier', value: '$999', desc: '/mo + 0.10%' },
      { label: 'Enterprise', value: '$5K+', desc: '/mo custom rail' },
      { label: 'LTV:CAC', value: '18:1', desc: '24-month view' }
    ]
  },
  {
    type: 'chart', tag: 'COMPETITIVE LANDSCAPE', title: 'Cost & Speed vs. Legacy Rails',
    content: 'Composite: settlement speed + fee efficiency + developer experience (0–100).',
    chartType: 'bar',
    data: [
      { label: '[Company]', value: 95 }, { label: 'Stripe (intl)', value: 62 },
      { label: 'Wise Business', value: 58 }, { label: 'SWIFT Wire', value: 20 }
    ]
  },
  {
    type: 'list', tag: 'THE TEAM', title: 'Ex-Regulators & Payment Rails Veterans',
    items: [
      '[CEO Name] · CEO — Ex-Visa SVP, led expansion into 18 markets ($3.2B incremental GMV)',
      '[CTO Name] · CTO — Ex-Ripple, architected On-Demand Liquidity for $8B/day volume',
      '[CLO Name] · CLO — Ex-OCC, authored FinCEN licensing framework used by 200+ fintechs',
      'Advisor: [Name] — Partner, Andreessen Horowitz (Stripe, Brex, Plaid portfolio)'
    ]
  },
  {
    type: 'list', tag: 'THE ASK', title: 'Raising $12M Series A',
    items: [
      '45% Global Liquidity Network — establish corridors in 40 new countries',
      '35% Regulatory & Compliance — secure licenses in EU, APAC, LatAm',
      '20% Engineering & Infrastructure — 99.99% uptime SLA at 10x volume',
      'Milestone: $5B GMV annualized → Series B at $120M+ valuation in 24 months'
    ]
  }
];

const masterAgency: any[] = [
  {
    type: 'title', companyName: '[Company]',
    tagline: 'World-class design and engineering, delivered as a flat monthly subscription.',
    tag: 'Productized Agency'
  },
  {
    type: 'split', tag: 'THE PROBLEM', title: 'The Agency Model Is Fundamentally Broken',
    content: 'Companies pay $25K+/mo for agencies that overpromise, underdeliver, and take 3 months to start.',
    items: [
      'Avg. agency retainer: $18K/mo — 65% goes to account managers, not makers',
      'Mean time to first deliverable from a traditional agency: 6.4 weeks (Agency Analytics)',
      'Scope creep causes 82% of agency projects to exceed budget (Clutch, 2024)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'split', tag: 'THE SOLUTION', title: 'Unlimited Work. Flat Fee. Pause Anytime.',
    content: 'Top 1% global talent — designers, developers, copywriters — delivered like SaaS. No contracts.',
    items: [
      'Unlimited concurrent design & dev requests — zero scope limits',
      'First delivery within 48 hours. Revisions within 24 hours. Always.',
      'Async-first workflow — no calls, no account managers, just results',
      'Cancel or pause anytime — zero lock-in, zero penalty'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80'
  },
  {
    type: 'list', tag: 'WHY NOW', title: 'The Window Is Now',
    items: [
      'AI tools (v0, Cursor, Midjourney) cut delivery time 60% — subscription agency margins now 80%+',
      'Post-layoff economy: 40M knowledge workers went freelance in 2023-24 — elite talent is abundant',
      'Notion, Linear, Loom created the async-first toolstack — we\'re native to how modern teams work',
      'VC-backed startups cut agency spend 45% in 2023 — they need our subscription model desperately'
    ]
  },
  {
    type: 'list', tag: 'HOW IT WORKS', title: 'Submit Request. Get Results. Repeat.',
    items: [
      'Step 1: Submit your request via Notion board (design, copy, dev, video)',
      'Step 2: Matched to a specialist within 4 hours based on request type',
      'Step 3: First draft delivered within 48 hours — guaranteed or refund',
      'Step 4: Unlimited revisions until 100% satisfied — no extra charge'
    ]
  },
  {
    type: 'chart', tag: 'MARKET OPPORTUNITY', title: '$455B Professional Services Market',
    content: '22% CAGR in subscription services — traditional agencies losing share rapidly.',
    chartType: 'horizontalBar',
    data: [
      { label: 'TAM — Global Agency Market ($B)', value: 455 },
      { label: 'SAM — Digital Services ($B)', value: 85 },
      { label: 'SOM — Subscription Agency ($B)', value: 4.2 }
    ]
  },
  {
    type: 'metrics', tag: 'TRACTION', title: '$195K MRR. 92% Client Retention.',
    content: '58 active subscribers. No outbound sales — all inbound from Twitter and referrals.',
    metrics: [
      { label: 'MRR', value: '$195K', desc: '+22% MoM' },
      { label: 'Subscribers', value: '58', desc: 'Active clients' },
      { label: 'Retention', value: '92%', desc: 'Monthly avg.' },
      { label: 'NPS', value: '74', desc: 'Exceptional' }
    ]
  },
  {
    type: 'chart', tag: 'GROWTH', title: '22% MoM Subscriber Growth',
    content: 'Zero outbound. Every new client came from content or referral.',
    chartType: 'line',
    data: [
      { label: 'Month 1', value: 8 }, { label: 'Month 2', value: 16 }, { label: 'Month 3', value: 27 },
      { label: 'Month 4', value: 39 }, { label: 'Month 5', value: 52 }, { label: 'Month 6', value: 58 }
    ]
  },
  {
    type: 'metrics', tag: 'BUSINESS MODEL', title: 'Subscription SaaS — 80%+ Gross Margins',
    content: 'Async workflows enable one operator to manage 5+ clients simultaneously.',
    metrics: [
      { label: 'Standard', value: '$2.5K', desc: '/mo · 1 stream' },
      { label: 'Pro', value: '$4.5K', desc: '/mo · 2 streams' },
      { label: 'Scale', value: '$8K', desc: '/mo · unlimited' },
      { label: 'LTV:CAC', value: '14:1', desc: 'Organic CAC=$0' }
    ]
  },
  {
    type: 'chart', tag: 'COMPETITIVE LANDSCAPE', title: 'Value Score vs. Alternatives',
    content: 'Composite: cost efficiency + delivery speed + output quality + flexibility (0–100).',
    chartType: 'bar',
    data: [
      { label: '[Company]', value: 93 }, { label: 'Design Joy / Kimp', value: 65 },
      { label: 'Freelancer', value: 50 }, { label: 'Traditional Agency', value: 32 }
    ]
  },
  {
    type: 'list', tag: 'THE TEAM', title: "Operators Who've Built and Delivered",
    items: [
      '[CEO Name] · CEO — Ex-Design Director, Figma; built productized service to $2M ARR solo',
      '[Talent Lead] · Head of Talent — Sourced 500+ elite designers for top creative studios globally',
      '[Ops Lead] · Operations — Ex-Basecamp, built async-first workflows for 200-person remote team',
      'Advisor: [Name] — Founder, Design Joy ($50K MRR); top productized service thought leader'
    ]
  },
  {
    type: 'list', tag: 'THE ASK', title: 'Raising $800K Pre-Seed',
    items: [
      '50% Talent Network — hire 20 elite specialists (design, dev, copy, video)',
      '30% Outbound Sales — SDR team targeting Series A–C startups',
      '20% Internal Tooling — build proprietary async workflow OS',
      'Milestone: $500K MRR → 200 active subscribers in 18 months'
    ]
  }
];


// ─── TEMPLATE FACTORY ──────────────────────────────────────────────────────

const masterMap = {
  'B2B SaaS': masterSaaS,
  'D2C / E-commerce': masterD2C,
  'AI & DeepTech': masterAI,
  'Fintech': masterFintech,
  'Agencies': masterAgency,
  'Other': masterSaaS
};

// Category → [themes in priority order, fonts, thumbnails, titles]
const categoryConfig: Record<string, {
  themes: string[];
  fonts: string[];
  thumbs: string[];
  names: string[];
}> = {
  'B2B SaaS': {
    themes: ['corporate_slate', 'aurora', 'midnight_vc', 'deep_ocean', 'arctic_light', 'obsidian_gold', 'silicon_sage', 'forest_venture', 'crimson_empire', 'corporate_slate'],
    fonts:   ['font-inter', 'font-outfit', 'font-roboto', 'font-montserrat', 'font-inter', 'font-outfit', 'font-roboto', 'font-montserrat', 'font-inter', 'font-outfit'],
    thumbs:  [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573164713712-03d0d1bac892?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    ],
    names: ['SaaS Velocity', 'Platform Play', 'Vertical SaaS', 'Enterprise Ops', 'Dev Tools SaaS', 'HR Tech', 'Legal Tech', 'EdTech SaaS', 'HealthTech SaaS', 'RevOps Platform'],
  },
  'D2C / E-commerce': {
    themes: ['rose_quartz', 'obsidian_gold', 'silicon_sage', 'arctic_light', 'midnight_vc', 'crimson_empire', 'forest_venture', 'aurora', 'deep_ocean', 'corporate_slate'],
    fonts:   ['font-outfit', 'font-montserrat', 'font-inter', 'font-roboto', 'font-outfit', 'font-montserrat', 'font-inter', 'font-roboto', 'font-outfit', 'font-montserrat'],
    thumbs:  [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    ],
    names: ['Skincare Brand', 'Apparel Brand', 'Footwear Brand', 'Nutrition Brand', 'Fitness Brand', 'Beauty Tech', 'Pet Products', 'Home Goods', 'Food & Bev', 'Sustainable Goods'],
  },
  'AI & DeepTech': {
    themes: ['midnight_vc', 'deep_ocean', 'aurora', 'corporate_slate', 'obsidian_gold', 'forest_venture', 'crimson_empire', 'silicon_sage', 'arctic_light', 'midnight_vc'],
    fonts:   ['font-inter', 'font-roboto', 'font-outfit', 'font-montserrat', 'font-inter', 'font-roboto', 'font-outfit', 'font-montserrat', 'font-inter', 'font-roboto'],
    thumbs:  [
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1677756119517-756a188d2d94?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    ],
    names: ['LLM Startup', 'Computer Vision', 'AI Agent Platform', 'Generative AI', 'Biotech AI', 'AI for Legal', 'AI for Finance', 'Robotics AI', 'AI Security', 'Drug Discovery AI'],
  },
  'Fintech': {
    themes: ['obsidian_gold', 'corporate_slate', 'deep_ocean', 'midnight_vc', 'silicon_sage', 'arctic_light', 'aurora', 'forest_venture', 'crimson_empire', 'obsidian_gold'],
    fonts:   ['font-montserrat', 'font-inter', 'font-roboto', 'font-outfit', 'font-montserrat', 'font-inter', 'font-roboto', 'font-outfit', 'font-montserrat', 'font-inter'],
    thumbs:  [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=800&q=80',
    ],
    names: ['Neobank', 'Payments API', 'WealthTech', 'InsurTech', 'Crypto/Web3', 'B2B Payments', 'Lending Platform', 'Treasury OS', 'Open Banking', 'BNPL Platform'],
  },
  'Agencies': {
    themes: ['silicon_sage', 'arctic_light', 'midnight_vc', 'rose_quartz', 'obsidian_gold', 'corporate_slate', 'aurora', 'forest_venture', 'deep_ocean', 'crimson_empire'],
    fonts:   ['font-roboto', 'font-outfit', 'font-inter', 'font-montserrat', 'font-roboto', 'font-outfit', 'font-inter', 'font-montserrat', 'font-roboto', 'font-outfit'],
    thumbs:  [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579389083046-e3df9c2b3325?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1561489413-985b06da5bee?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80',
    ],
    names: ['Design Agency', 'Dev Shop', 'Growth Agency', 'Content Studio', 'Performance Agency', 'Branding Agency', 'SEO/PPC Agency', 'Video Studio', 'PR Agency', 'Full-Stack Agency'],
  },
  'Other': {
    themes: ['aurora'],
    fonts: ['font-inter'],
    thumbs: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'],
    names: ['General Deck'],
  },
};

const generateTemplates = (): Template[] => {
  const templates: Template[] = [];
  let idCounter = 1;

  const categories = Object.keys(masterMap).filter(c => c !== 'Other') as Array<keyof typeof masterMap>;
  
  categories.forEach((cat) => {
    const cfg = categoryConfig[cat];
    for (let i = 0; i < 10; i++) {
      const themeKey = cfg.themes[i % cfg.themes.length];
      const fontKey  = cfg.fonts[i % cfg.fonts.length];
      const thumb    = cfg.thumbs[i % cfg.thumbs.length];
      const name     = cfg.names[i % cfg.names.length];

      // Deep copy master slides
      const baseSlides = JSON.parse(JSON.stringify(masterMap[cat]));
      if (baseSlides[0]) baseSlides[0].companyName = '[Your Company]';

      templates.push({
        id: `tpl_${idCounter}`,
        title: name,
        category: cat as Template['category'],
        thumbnailUrl: thumb,
        isPro: false,   // All templates free — downloads gated by vault credits
        defaultTheme: themeKey,
        defaultFont: fontKey,
        slides: baseSlides
      });
      idCounter++;
    }
  });

  return templates;
};

export const TEMPLATES = generateTemplates();
