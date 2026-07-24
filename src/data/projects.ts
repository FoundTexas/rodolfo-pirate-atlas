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
    title: 'SAS Viya Consulting Work',
    eyebrow: 'Technical consulting · SAS',
    category: 'Consulting & Data',
    year: '2026—present',
    summary: 'Consulting work connecting SAS Viya platform operations, governed analytics, data preparation and clear technical communication.',
    challenge: 'Data and platform work only creates value when the environment is operable, the information is trustworthy and the result can be explained to the people using it.',
    approach: [
      'Prepared and validated semi-structured data with SAS programming, regular expressions and repeatable quality checks.',
      'Built analytical tables and prepared data for CAS and Visual Analytics storytelling.',
      'Worked with users, groups, folders, permissions, CASLIBs and practical SAS Viya operating workflows.',
      'Used web interfaces, command-line concepts, REST APIs and automation-oriented tooling to make administration more repeatable.',
      'Translated implementation details into presentations, demos and stakeholder-ready documentation.'
    ],
    result: 'A consulting practice spanning the route from platform setup and governance to trustworthy analysis and understandable delivery.',
    stack: ['SAS Viya', 'SAS Programming', 'CAS', 'Visual Analytics', 'REST APIs', 'Data Validation'],
    color: '#49d9c3',
    visual: 'data',
    featured: true,
    confidentiality: 'This case study combines portfolio exercises and generalized consulting capabilities. It contains no confidential customer configuration or proprietary data.'
  },
  {
    slug: 'gbm-cloud-backend',
    title: 'Cloud-Native Financial Backend',
    eyebrow: 'Professional experience · GBM',
    category: 'Cloud & Backend',
    year: '2024—2026',
    summary: 'Backend services for financial modules built with serverless AWS components, .NET APIs, Python and DynamoDB.',
    challenge: 'Business-critical modules required maintainable services, dependable data access and better operational visibility across cloud processes.',
    approach: [
      'Built AWS Lambda functions in Python and C# and implemented REST endpoints in .NET.',
      'Integrated DynamoDB through custom data-access components and maintainable abstractions.',
      'Deployed serverless services and required AWS resources using Infrastructure as Code.',
      'Created CloudWatch dashboards and used logs to improve diagnosis and observability.'
    ],
    result: 'Improved API reliability, data handling and visibility across backend processes while working within a regulated financial environment.',
    stack: ['AWS Lambda', '.NET', 'C#', 'Python', 'DynamoDB', 'CloudWatch', 'IaC'],
    color: '#ffb44a',
    visual: 'cloud',
    featured: true,
    confidentiality: 'Architecture and wording are intentionally generalized. No proprietary code, metrics or internal identifiers are shown.'
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
