// src/data/cv.ts
// Single Authoritative Source of Truth for Faycal Rafa's CV & Experience Data

export interface ExperienceItem {
  id: string;
  company: string;
  logo: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  location: string;
  type: string;
  url?: string;
  urlLabel?: string;
  summary: string;
  achievements: string[];
  skills: string[];
  concurrentNote?: string;
}

export interface SkillCategory {
  title: string;
  items: string[];
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface CvData {
  name: string;
  role: string;
  tagline: string;
  profile: string;
  phone: string;
  email: string;
  location: string;
  githubUrl: string;
  githubDisplay: string;
  portfolioUrl: string;
  portfolioDisplay: string;
  linkedinUrl: string;
  linkedinDisplay: string;
  spokenLanguages: LanguageItem[];
  skills: SkillCategory[];
  experiences: ExperienceItem[];
  flagships: {
    name: string;
    description: string;
  }[];
}

export const experiences: ExperienceItem[] = [
  {
    id: 'autoqual',
    company: 'AUTOQUAL',
    logo: '/images/logos/icons/autoqual.png',
    role: 'Technical Lead & Senior Software Engineer',
    period: '04/2026 – Present',
    startDate: '2026-04',
    endDate: 'Present',
    isCurrent: true,
    location: 'Algiers, Algeria',
    type: 'Full-time',
    summary: 'Spearheaded technical operations and end-to-end system architecture, shipping enterprise automotive service workflow platforms, automated vehicle tracking, and multi-warehouse parts inventory management across service centers.',
    achievements: [
      'Architected and shipped real-time vehicle diagnostics and service tracking portals, eliminating manual dispatch bottlenecks across regional service hubs.',
      'Designed normalized relational schemas in PostgreSQL and automated multi-warehouse parts replenishment workflows.',
      'Established team-wide engineering standards, modular API blueprints, and automated continuous deployment pipelines.'
    ],
    skills: ['TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Docker', 'Microservices', 'System Design']
  },
  {
    id: 'sabil',
    company: 'SABIL Company',
    logo: '/images/logos/icons/sabil.png',
    role: 'Senior Software Engineer',
    period: '04/2025 – 02/2026',
    startDate: '2025-04',
    endDate: '2026-02',
    location: 'Bab Ezzouar, Algiers',
    type: 'Full-time',
    url: 'https://sabil.dz/en/getapp/',
    urlLabel: 'sabil.dz Mega-App',
    summary: 'Architected and scaled high-throughput microservices powering mission-critical digital wallet transactions and multi-tenant banking operations.',
    achievements: [
      'Architected distributed, fault-tolerant microservices with NestJS and Redis handling high-concurrency payment transactions with zero transaction loss.',
      'Optimized PostgreSQL partitioning, indexing, and asynchronous event streams to achieve sub-45ms P99 transaction confirmation latencies.',
      'Engineered multi-channel payment reconciliation workflows with strict idempotency, audit trails, and automated settlement verification.'
    ],
    skills: ['NestJS', 'TypeScript', 'PostgreSQL', 'Docker', 'Redis', 'Microservices', 'Event-Driven Architecture']
  },
  {
    id: 'finnetude',
    company: 'Finnetude',
    logo: '/images/logos/icons/finnetude.png',
    role: 'Technical Lead',
    period: '08/2024 – 04/2025',
    startDate: '2024-08',
    endDate: '2025-04',
    location: 'Hydra, Algiers',
    type: 'Technical Lead',
    summary: 'Directed engineering squads across the SDLC to architect and ship real-time electronic stock trading and interactive multi-asset market simulation platforms.',
    achievements: [
      'Led a cross-functional squad of 6 engineers to architect and ship InvestMarket (real-time stock trading & portfolio platform) and ALFA+ (digital trading academy and market simulator).',
      'Decomposed monolithic legacy systems into elastic event-driven microservices, achieving fault isolation and 99.9% production uptime.',
      'Architected bidirectional WebSocket streaming infrastructure delivering sub-5ms latency for tick-by-tick order-book execution and live candlestick market feeds.'
    ],
    skills: ['TypeScript', 'NestJS', 'Node.js', 'WebSockets', 'Docker', 'PostgreSQL', 'Microservices']
  },
  {
    id: 'instaclean',
    company: 'InstaClean',
    logo: '/images/logos/icons/instaclean.png',
    role: 'Mobile Developer',
    period: '01/2024 – 07/2024',
    startDate: '2024-01',
    endDate: '2024-07',
    location: 'Cheraga, Algiers',
    type: 'Contract',
    concurrentNote: 'Concurrent with early 2024 automotive platform development',
    summary: 'Engineered an on-demand mobile car wash ordering and fleet management platform connecting service agents directly with vehicle owners.',
    achievements: [
      'Built reactive Flutter cross-platform mobile architecture featuring real-time GPS fleet tracking, automated geofencing dispatch algorithms, and offline request queuing.',
      'Engineered custom 60fps UI component interactions and persistent local caching layers resilient to unstable network conditions.',
      'Configured automated push notifications and transactional alerts using Firebase Cloud Messaging.'
    ],
    skills: ['Flutter', 'Dart', 'Android Kotlin', 'REST APIs', 'Firebase', 'Geolocation']
  },
  {
    id: 'kabri-auto',
    company: 'Kabri Auto',
    logo: '/images/logos/icons/kabri.png',
    role: 'Full-stack Developer',
    period: '01/2024 – 04/2024',
    startDate: '2024-01',
    endDate: '2024-04',
    location: 'Cheraga, Algiers',
    type: 'Contract',
    concurrentNote: 'Concurrent with early 2024 mobile application development',
    summary: 'Architected a high-volume cross-border e-commerce platform for automotive replacement parts launched in Dubai (UAE market).',
    achievements: [
      'Built parts compatibility indexing engine matching 10,000+ complex OEM vehicle specifications with aftermarket replacement inventory.',
      'Developed multi-currency checkout workflows, dynamic shipping calculation APIs, and automated multi-warehouse synchronization.'
    ],
    skills: ['TypeScript', 'PHP / Laravel', 'PostgreSQL', 'REST APIs', 'Docker']
  },
  {
    id: 'piassa-dz',
    company: 'PIASSA DZ',
    logo: '/images/logos/icons/piassa.png',
    role: 'Full-stack Developer',
    period: '10/2022 – 12/2023',
    startDate: '2022-10',
    endDate: '2023-12',
    location: 'Oued Romane, Algiers',
    type: 'Full-time',
    url: 'https://piassa.shop/',
    urlLabel: 'piassa.shop B2B SaaS',
    summary: 'Architected B2B SaaS automotive ecosystem, customer engagement CRM, and real-time supplier catalog synchronization APIs.',
    achievements: [
      'Developed high-conversion responsive client portals and mobile features for automotive suppliers and auto mechanics.',
      'Architected full-fledged CRM automating supplier quotations, purchase orders, and garage inventory alerts, cutting quotation turnaround time by 65%.',
      'Created high-throughput bidirectional synchronization APIs connecting central Piassa catalog database with distributed client POS systems.'
    ],
    skills: ['Flutter', 'PHP / Laravel', 'TypeScript', 'MySQL', 'RESTful APIs']
  },
  {
    id: 'bfln-technologies',
    company: 'SARL BFLN Technologies',
    logo: '/images/logos/icons/bfln.png',
    role: 'Full-stack Developer',
    period: '07/2019 – 09/2022',
    startDate: '2019-07',
    endDate: '2022-09',
    location: 'Oued Fayet, Algiers',
    type: 'Full-time',
    summary: 'Spearheaded development and deployment of omnichannel order tracking and call center management systems.',
    achievements: [
      'Spearheaded the complete development and rollout of an omnichannel order tracking and call center telephony routing system.',
      'Automated customer service operations, reducing manual dispatch times by 40% and eliminating logistics bottlenecks.',
      'Engineered normalized relational database schemas, complex reporting aggregation queries, and real-time operator telemetry dashboards.'
    ],
    skills: ['JavaScript', 'PHP', 'MySQL', 'Database Design', 'Linux', 'Bash']
  }
];

export const cvData: CvData = {
  name: 'FAYCAL RAFA',
  role: 'Fullstack Engineer & Technical Lead',
  tagline: 'Innovative Software Developer — Creating Efficient & Scalable Solutions',
  profile: 'Dedicated Software Developer with 6+ years of engineering experience architecting high-scale distributed microservices, fintech trading platforms, offline-first native Android apps, and responsive enterprise web platforms. Proven track record driving technical leadership, clean architecture, and reliable systems across fintech, automotive SaaS, and consumer mobile.',
  phone: '+213 540 98 02 38',
  email: 'rafafaycal@gmail.com',
  location: 'Cheraga, Algiers, Algeria',
  githubUrl: 'https://github.com/faycalrafa',
  githubDisplay: 'github.com/faycalrafa',
  portfolioUrl: 'https://faycalrafa.github.io',
  portfolioDisplay: 'faycalrafa.github.io',
  linkedinUrl: 'https://www.linkedin.com/in/faycal-rafa-89a366249',
  linkedinDisplay: 'linkedin.com/in/faycal-rafa-89a366249',
  spokenLanguages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'Fluent / Professional' },
    { name: 'French', level: 'Fluent / Professional' }
  ],
  skills: [
    {
      title: 'Languages (Code)',
      items: ['TypeScript', 'JavaScript', 'Kotlin', 'Java', 'PHP', 'Python', 'Dart', 'SQL', 'Bash']
    },
    {
      title: 'Frameworks & Tools',
      items: ['NestJS', 'Next.js', 'Node.js', 'Svelte 5', 'Jetpack Compose', 'Flutter', 'Tailwind CSS', 'Laravel', 'Docker', 'Git']
    },
    {
      title: 'Architecture & Systems',
      items: ['Microservices', 'Distributed Systems', 'Event-Driven', 'LiteRT-LM', 'WebSockets', 'Clean Architecture', 'Offline-First']
    },
    {
      title: 'Databases & Storage',
      items: ['PostgreSQL', 'Redis', 'MySQL', 'MongoDB', 'SQLite', 'Database Optimization']
    }
  ],
  flagships: [
    {
      name: 'BookReader Pro',
      description: 'Offline-first Android novel reader with native TTS engine and AndroidX Media3 player'
    },
    {
      name: 'TextMorph',
      description: 'System-wide on-device AI assistant with multi-engine local LLM inference (LiteRT-LM, llama.cpp, OpenAI APIs)'
    }
  ],
  experiences
};
