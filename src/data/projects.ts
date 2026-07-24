export type ProjectCategory = 'Consulting & Data' | 'Cloud & Backend' | 'Digital Products' | 'Interactive Worlds';

export interface ProjectLink {
  label: string;
  url: string;
  type?: 'live' | 'play' | 'code' | 'social';
}

export interface ProjectWebsite {
  title: string;
  url: string;
  label: string;
  summary: string;
  contribution: string;
  stack: string[];
  color: string;
}

export interface Project {
  slug: string;
  title: string;
  eyebrow: string;
  category: ProjectCategory;
  year: string;
  summary: string;
  challenge: string;
  approach: string[];
  result: string;
  stack: string[];
  color: string;
  featured?: boolean;
  links?: ProjectLink[];
  previewUrl?: string;
  websites?: ProjectWebsite[];
  confidentiality?: string;
  visual?: 'data' | 'cloud' | 'default';
}

export const websites: ProjectWebsite[] = [
  {
    title: 'Twinly Petwear',
    url: 'https://twinly-petwear.vercel.app/',
    label: 'Product & customization',
    summary: 'Matching outfits for humans and pets with a catalog and visual design-preview flow.',
    contribution: 'Product direction, front-end implementation, catalog experience, customization flow and brand integration.',
    stack: ['Astro', 'JavaScript', 'UX', 'Product'],
    color: '#ff8f87'
  },
  {
    title: 'ADI',
    url: 'https://adi.foundtexas.net/',
    label: 'Catalog & commercial flow',
    summary: 'A public catalog for uniforms, merchandise and custom textile production in Mexico.',
    contribution: 'Information architecture, responsive catalog, product presentation and direct quotation journey.',
    stack: ['Web Development', 'Catalog UX', 'Responsive Design'],
    color: '#f1d36d'
  },
  {
    title: 'Cacao Finca 17',
    url: 'https://cacao-finca-17.vercel.app/',
    label: 'Brand & product storytelling',
    summary: 'A focused website presenting the origin, quality and commercial story of Tabasco cacao.',
    contribution: 'Visual direction, responsive implementation, product storytelling and clear contact path.',
    stack: ['Astro', 'Brand Storytelling', 'Responsive Web'],
    color: '#c98f5a'
  },
  {
    title: 'Óptimo Ópticas',
    url: 'https://optimoopticas.mx/',
    label: 'E-commerce & client delivery',
    summary: 'A live optical-commerce experience combining product discovery, credibility and store information.',
    contribution: 'Public-facing implementation and product-oriented experience delivered within the Masoftcode client workflow.',
    stack: ['E-commerce', 'Catalog UX', 'Client Delivery'],
    color: '#9dc9ff'
  },
  {
    title: 'Masoftcode',
    url: 'https://masoftcode.com/',
    label: 'Studio website & full-stack work',
    summary: 'The public presence for a software, branding and infrastructure studio.',
    contribution: 'Worked in the full-stack environment behind the studio and its client delivery using Symfony, front-end frameworks, Docker and cloud tooling.',
    stack: ['Symfony', 'React', 'Angular', 'Docker', 'Google Cloud'],
    color: '#c7a6ff'
  }
];

export const projects: Project[] = [
  {
    slug: 'sas-consulting-work',
    title: 'From Raw Data to Governed Analytics',
    eyebrow: 'Technical consulting · SAS Viya',
    category: 'Consulting & Data',
    year: '2026—present',
    summary:
      'A complete analytics route built around SAS Viya: turning inconsistent semi-structured data into validated analytical tables, governed CAS resources and stakeholder-ready visual stories.',

    challenge:
      'The challenge was not simply loading data. Different sources contained nested JSON structures, inconsistent fields and business rules that had to remain traceable from ingestion to presentation. At the same time, the platform needed practical access controls, reusable resources and an operating model that other users could understand.',

    approach: [
      'Reverse-engineered semi-structured JSON sources and designed extraction rules for nested business entities.',
      'Used SAS programming and regular expressions to standardize fields, normalize records and preserve relationships across analytical tables.',
      'Created layered validation checks for required values, formats, duplicates, referential consistency and transformation results.',
      'Prepared governed data resources for CAS and Visual Analytics through CASLIBs, permissions, folders and reusable platform workflows.',
      'Connected the technical implementation to a geographic research narrative through dashboards, demos and presentation-ready documentation.',
      'Worked across the platform lifecycle, including deployment concepts, identity integration, storage, administration and post-installation validation.'
    ],

    result:
      'Produced a traceable route from irregular source data to governed analytics, combining platform administration, data engineering, validation and visual communication in one case study.',

    stack: [
      'SAS Viya',
      'SAS Programming',
      'CAS',
      'Visual Analytics',
      'Regular Expressions',
      'REST APIs',
      'Data Quality',
      'Platform Administration'
    ],

    color: '#49d9c3',
    visual: 'data',
    featured: true,

    confidentiality:
      'The implementation is presented through anonymized architecture, synthetic data and generalized platform workflows. No customer information or proprietary configuration is included.'
  },
  {
    slug: 'gbm-cloud-backend',
    title: 'Engineering Below the Financial Interface',
    eyebrow: 'Cloud-native backend · GBM',
    category: 'Cloud & Backend',
    year: '2024—2026',
    summary:
      'Cloud-native backend services supporting financial product modules through serverless processing, maintainable APIs, dependable data access and operational visibility.',

    challenge:
      'Financial functionality depends on systems users rarely see. Services needed to process business-critical operations reliably, integrate with distributed cloud resources and remain diagnosable when an execution failed somewhere between an API request, a serverless function and its data layer.',

    approach: [
      'Developed AWS Lambda functions in Python and C# for event-driven and request-based backend workflows.',
      'Built and maintained REST APIs with .NET 8, separating business logic, application services and cloud integrations.',
      'Created reusable DynamoDB access components to make queries, writes and domain mappings easier to maintain.',
      'Defined and deployed cloud resources through Infrastructure as Code to reduce manual configuration and improve environment consistency.',
      'Worked with containerized services and delivery workflows involving ECS, ECR and automated pipelines.',
      'Used structured logs, CloudWatch dashboards and execution traces to investigate failures across distributed services.',
      'Improved resilience through validation, controlled error handling and clearer operational signals.'
    ],

    result:
      'Strengthened the invisible layer behind financial experiences: services became easier to evolve, cloud resources more repeatable to deploy and production behavior easier to diagnose.',

    stack: [
      'AWS Lambda',
      '.NET 8',
      'C#',
      'Python',
      'DynamoDB',
      'API Gateway',
      'ECS',
      'ECR',
      'CloudWatch',
      'Infrastructure as Code',
      'CI/CD'
    ],

    color: '#ffb44a',
    visual: 'cloud',
    featured: true,

    confidentiality:
      'The case study focuses on engineering responsibilities and generalized architectural patterns. It excludes proprietary code, financial data, internal identifiers and confidential metrics.'
  },
  {
    slug: 'web-applications',
    title: 'Web Applications & Client Sites',
    eyebrow: 'Public products · client delivery',
    category: 'Digital Products',
    year: '2023—present',
    summary: 'Five public websites spanning independent products, catalogs, e-commerce, brand storytelling and software-studio delivery.',
    challenge: 'Each business needed a different path from attention to action: exploring a catalog, understanding a product, customizing an idea, purchasing or starting a conversation.',
    approach: [
      'Designed responsive information structures around the actual commercial journey of each project.',
      'Connected brand direction with usable catalogs, product content and clear calls to action.',
      'Adapted implementation choices to independent products, small businesses and client-delivery constraints.',
      'Deployed and iterated public experiences that can be opened and evaluated directly.'
    ],
    result: 'A compact collection of live web work showing product thinking, front-end delivery and the ability to adapt technology to different businesses.',
    stack: ['Astro', 'JavaScript', 'Symfony', 'React', 'Angular', 'Responsive UX', 'E-commerce'],
    color: '#f1d36d',
    featured: true,
    websites,
    links: websites.map((site) => ({ label: site.title, url: site.url, type: 'live' as const }))
  },
  {
    slug: 'foundtexas-interactive-worlds',
    title: 'FoundTexas Interactive Worlds',
    eyebrow: 'Playable work and game jams',
    category: 'Interactive Worlds',
    year: '2019—present',
    summary: 'A public archive of games, prototypes and collaborations exploring mechanics, narrative, performance and rapid production.',
    challenge: 'Game jams and small teams require a strong playable idea, fast technical decisions and close collaboration across programming, art, design and audio.',
    approach: [
      'Built gameplay systems and interactive prototypes with Unity, C# and other game-development tools.',
      'Explored puzzle-platforming, strategy, narrative interaction, action systems and replay mechanics.',
      'Collaborated in multidisciplinary teams under short production timelines.',
      'Published playable builds and experiments through itch.io.'
    ],
    result: 'A body of public, playable work that complements backend and consulting experience with tangible interactive software.',
    stack: ['Unity', 'C#', 'URP', 'Shaders', 'Gameplay Systems', 'Game Jams'],
    color: '#f369c8',
    featured: true,
    previewUrl: 'https://foundtexas.itch.io/',
    links: [
      { label: 'FoundTexas profile', url: 'https://foundtexas.itch.io/', type: 'play' },
      { label: 'Planet Crash', url: 'https://foundtexas.itch.io/planet-crash', type: 'play' },
      { label: 'Flare Tale', url: 'https://foundtexas.itch.io/flare-tale', type: 'play' },
      { label: 'Diary Drama', url: 'https://foundtexas.itch.io/diary-drama', type: 'play' },
      { label: 'Probability Clones', url: 'https://foundtexas.itch.io/probab', type: 'play' },
      { label: 'YAOCALLI', url: 'https://foundtexas.itch.io/yaocalli', type: 'play' }
    ]
  },
  {
    slug: 'word-games-performance',
    title: 'Mobile Game Performance',
    eyebrow: 'Professional experience · Word Games Studio',
    category: 'Interactive Worlds',
    year: '2022—2023',
    summary: 'Unity gameplay and rendering work focused on maintaining visual quality and responsive mechanics on lower-end devices.',
    challenge: 'The game needed scalable mechanics and improved visuals without sacrificing performance on constrained mobile hardware.',
    approach: [
      'Created reusable gameplay mechanics and contributed to level design in Unity.',
      'Improved visual presentation using URP and shader-based techniques.',
      'Profiled and optimized scenes with low-end devices in mind.',
      'Balanced technical constraints with the intended player experience.'
    ],
    result: 'Achieved stable 60 FPS on low-end devices while improving overall performance and visual quality.',
    stack: ['Unity', 'C#', 'URP', 'Shaders', 'Optimization', 'Level Design'],
    color: '#9ee06f'
  }
];

export const featuredProjects = projects.filter((project) => project.featured);

export const categoryCopy: Record<ProjectCategory, { number: string; subtitle: string }> = {
  'Consulting & Data': {
    number: '01',
    subtitle: 'Platforms, governed data and decisions people can trust.'
  },
  'Cloud & Backend': {
    number: '02',
    subtitle: 'Reliable systems below the waterline.'
  },
  'Digital Products': {
    number: '03',
    subtitle: 'Useful experiences that reach real people.'
  },
  'Interactive Worlds': {
    number: '04',
    subtitle: 'Software people can explore and play.'
  }
};
