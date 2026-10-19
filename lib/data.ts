/**
 * All page content lives here so copy changes never require touching layout.
 */

/* ------------------------------------------------------------------ services */

export type Service = {
  title: string
  body: string
  tags: string[]
}

export const services: Service[] = [
  {
    title: 'Backend & Distributed Systems',
    body: 'I design the parts that have to stay up. Event-driven services, async job pipelines, DAG-based workflow execution, retry and failure handling — built so throughput scales without the correctness going sideways.',
    tags: ['Node.js', 'Spring Boot', 'BullMQ', 'NATS', 'Kafka'],
  },
  {
    title: 'APIs & Integrations',
    body: 'REST APIs built to be consumed: versioned contracts, validation, pagination, centralised error handling, OpenAPI docs. Plus the integration layer around them — provider-agnostic adapters, webhooks, credential resolution.',
    tags: ['REST', 'OpenAPI', 'OAuth 2.0', 'Webhooks'],
  },
  {
    title: 'Full Stack Web Applications',
    body: 'End-to-end delivery, interface included. Responsive React and Angular front ends wired to my own APIs, with reusable component architecture and state that stays predictable as the product grows.',
    tags: ['React', 'Angular', 'TypeScript', 'Next.js'],
  },
  {
    title: 'Data, Auth & Cloud',
    body: 'Schema modelling, indexing and query optimisation before reaching for a cache — then Redis where it earns its place. Role- and attribute-based access control, token lifecycles, and deployment on AWS.',
    tags: ['PostgreSQL', 'Redis', 'RBAC / ABAC', 'AWS'],
  },
]

/* ---------------------------------------------------------------- experience */

export type Role = {
  company: string
  title: string
  location: string
  period: string
  current: boolean
  summary: string
  projects: {
    name: string
    kind: string
    stack: string[]
    points: string[]
  }[]
}

export const experience: Role[] = [
  {
    company: 'Asmadiya Technologies',
    title: 'Software Development Engineer',
    location: 'Pune, India',
    period: 'Sep 2024 — Present',
    current: true,
    summary:
      'Backend and full stack engineering across four production platforms — workflow automation, B2B distribution, FinTech and internal enterprise tooling.',
    projects: [
      {
        name: 'AI Workflow Automation Platform',
        kind: 'Enterprise workflow automation',
        stack: ['Node.js', 'Express.js', 'PostgreSQL', 'BullMQ', 'NATS', 'Redis'],
        points: [
          'Built a DAG-based workflow execution engine on BullMQ workers handling dependency resolution, payload construction, async tool execution and engine-level retries.',
          'Implemented NATS event communication and webhook-based execution-log streaming for decoupled processing and real-time workflow status.',
          'Designed RBAC/ABAC authorization and a reusable integration framework spanning 200+ tools, with runtime credential resolution through AWS Secrets Manager and Azure Key Vault.',
        ],
      },
      {
        name: 'Enterprise Dealer & Distribution Platform',
        kind: 'B2B / e-commerce',
        stack: ['Node.js', 'Express.js', 'PostgreSQL', 'AWS'],
        points: [
          'Built onboarding for dealers, farmers and employees across hierarchical org structures with multi-level approval and KYC workflows.',
          'Enforced organization-level access control with RBAC across territory, regional, zonal and field-management roles.',
          'Delivered the full order lifecycle — creation, approval, warehouse selection, inventory validation, fulfillment, completion — plus inventory, CMS and real-time field-agent location APIs.',
        ],
      },
      {
        name: 'FinTech API Marketplace',
        kind: 'FinTech platform',
        stack: ['Node.js', 'Express.js', 'AWS Lambda', 'API Gateway', 'S3', 'Redis'],
        points: [
          'Built API onboarding, API group management, consumption tracking and billing workflows.',
          'Deployed onboarded APIs as Lambdas fronted by AWS API Gateway, generating proxy access for purchased API groups.',
          'Implemented monthly usage accumulation supporting postpaid billing, with Redis caching for hot marketplace data.',
        ],
      },
      {
        name: 'CUG / CMS Internal Application',
        kind: 'Enterprise internal tooling',
        stack: ['Java', 'Spring Boot', 'MySQL', 'JPA'],
        points: [
          'Integrated Active Directory for enterprise authentication and user management, with OTP-based multi-factor authentication.',
          'Implemented soft-deletion and backend APIs for secure enterprise workflows.',
        ],
      },
    ],
  },
]

export const education = {
  school: 'Kamla Nehru Institute of Technology',
  degree: 'Master of Computer Applications (MCA)',
  detail: 'CGPA 8.08 / 10.0',
  location: 'Sultanpur, India',
  year: '2023',
}

/* ------------------------------------------------------------------ projects */

export type Project = {
  slug: string
  title: string
  status: 'In Progress' | 'Live' | 'Offline' | 'Archived'
  blurb: string
  points: string[]
  stack: string[]
  image: string
  /** Honest alt text: these are stock placeholders, not product screenshots. */
  imageAlt: string
  links: { label: string; href: string }[]
  note?: string
}

export const projects: Project[] = [
  {
    slug: 'code-review-platform',
    title: 'Code Review Platform',
    status: 'In Progress',
    blurb:
      'A full stack code review platform: repository management, SCM integrations, review workflows and the backend orchestration behind them.',
    points: [
      'Provider-agnostic SCM architecture covering GitHub and Bitbucket through normalized operations, capability flags, event mappings and JSONB-backed configuration.',
      'GitHub OAuth 2.0 authentication with adapter-based provider extension, so a new SCM is a new adapter rather than a new code path.',
      'React workflows for auth, provider integration, repository management, review execution and result visualisation, against Spring Boot REST APIs.',
    ],
    stack: ['React', 'Java', 'Spring Boot', 'PostgreSQL', 'OAuth 2.0'],
    image: '/img/projects/codereview.webp',
    imageAlt: '',
    links: [
      { label: 'Backend repo', href: 'https://github.com/codewithkrishan2/application-services' },
      { label: 'Frontend repo', href: 'https://github.com/codewithkrishan2/frontend' },
    ],
    note: 'Actively in development — not yet deployed.',
  },
  {
    slug: 'yasgifts',
    title: 'Yasgifts — Gift Marketplace',
    status: 'Offline',
    blurb:
      'A personalised gifting marketplace connecting customers with vendors, where I led backend development.',
    points: [
      'REST APIs for vendor onboarding, product listings, customer workflows and order processing with Django REST Framework.',
      'Order-processing workflows tying customers, products, vendors and backend services across the purchase lifecycle.',
      'Scaled to support 1000+ vendors; deployed and operated on AWS.',
    ],
    stack: ['Python', 'Django REST', 'React', 'AWS'],
    image: '/img/projects/giftstore.webp',
    imageAlt: 'Gift store web interface',
    links: [],
    note: 'Marketplace is currently offline, so there is no live demo to link.',
  },
  {
    slug: 'blog-api',
    title: 'Blog API',
    status: 'Live',
    blurb:
      'A RESTful blogging backend built to practise getting the data layer right rather than just making it work.',
    points: [
      'Layered controller / service / repository / entity architecture with clean separation of concerns.',
      'JPA and Hibernate over MySQL: entity relationships, transactions, pagination, validation and centralised exception handling.',
      'Indexing, query optimisation and Redis caching to cut database round trips on hot reads.',
    ],
    stack: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    image: '/img/projects/blog.webp',
    imageAlt: '',
    links: [{ label: 'Source', href: 'https://github.com/codewithkrishan2/blog' }],
  },
  {
    slug: 'contact-manager',
    title: 'Contact Manager',
    status: 'Live',
    blurb:
      'A server-rendered contact management app — full CRUD, authentication and image upload.',
    points: [
      'Spring MVC with Thymeleaf templates backed by MySQL for create, edit, search and delete flows.',
      'Session-based authentication with per-user data isolation.',
    ],
    stack: ['Java', 'Spring Boot', 'Thymeleaf', 'MySQL'],
    image: '/img/projects/portfolio.webp',
    imageAlt: '',
    links: [{ label: 'Source', href: 'https://github.com/codewithkrishan2/contact-manager' }],
    note: 'An early project, kept here because the fundamentals still hold up.',
  },
]

/* -------------------------------------------------------------------- skills */

export type SkillGroup = {
  name: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { name: 'Languages', items: ['JavaScript', 'TypeScript', 'Java', 'SQL', 'Python'] },
  {
    name: 'Frontend',
    items: ['React.js', 'Next.js', 'Angular', 'HTML5', 'CSS3', 'Tailwind', 'Material UI', 'Bootstrap'],
  },
  {
    name: 'Backend',
    items: ['Node.js', 'Express.js', 'Spring Boot', 'Spring MVC', 'Spring Security', 'REST APIs'],
  },
  {
    name: 'Architecture',
    items: [
      'Microservices',
      'Event-Driven Architecture',
      'Async Processing',
      'DAG Workflow Execution',
      'Distributed Systems',
      'Concurrency',
      'API Design',
    ],
  },
  {
    name: 'Databases',
    items: [
      'PostgreSQL',
      'MySQL',
      'Redis',
      'Data Modelling',
      'Indexing',
      'Query Optimisation',
      'Transactions',
    ],
  },
  { name: 'Messaging', items: ['BullMQ', 'NATS', 'Kafka', 'RabbitMQ', 'AWS SQS', 'WebSockets'] },
  {
    name: 'Security',
    items: ['RBAC', 'ABAC', 'JWT', 'OAuth 2.0', 'API Keys', 'Access / Refresh Tokens', 'OTP MFA'],
  },
  { name: 'AWS', items: ['Lambda', 'API Gateway', 'S3', 'Secrets Manager', 'EC2', 'RDS', 'CloudWatch'] },
  {
    name: 'Tooling',
    items: ['Docker', 'Git', 'GitHub Actions', 'Maven', 'Postman', 'Swagger / OpenAPI', 'CI/CD'],
  },
]

/** Logo strip for the headline stack. Only assets that exist in public/img. */
export const coreStack: { name: string; icon: string }[] = [
  { name: 'JavaScript', icon: '/img/skills/js.webp' },
  { name: 'TypeScript', icon: '/img/skills/ts.webp' },
  { name: 'Java', icon: '/img/skills/java.svg' },
  { name: 'Microservices', icon: '/img/skills/enterprise.svg' },
  { name: 'Spring Boot', icon: '/img/skills/springboot.svg' },
  { name: 'Spring', icon: '/img/skills/spring.svg' },
  { name: 'React', icon: '/img/skills/react.webp' },
  { name: 'Angular', icon: '/img/skills/angular.svg' },
  { name: 'PostgreSQL', icon: '/img/skills/postger.webp' },
  { name: 'MySQL', icon: '/img/skills/mysql.webp' },
  { name: 'Docker', icon: '/img/skills/docker.webp' },
  { name: 'Git', icon: '/img/skills/gitwhite.webp' },
  { name: 'REST API', icon: '/img/skills/Rest-api.svg' },
  { name: 'JWT', icon: '/img/skills/jwt.svg' },
  { name: 'Tailwind', icon: '/img/skills/tailwind.webp' },
  { name: 'HTML5', icon: '/img/skills/html.webp' },
  { name: 'CSS3', icon: '/img/skills/css.webp' },
  { name: 'Material UI', icon: '/img/skills/mui.webp' },
  { name: 'Bootstrap', icon: '/img/skills/bootstrap.svg' },
  { name: 'Maven', icon: '/img/skills/maven.svg' },
  { name: 'Postman', icon: '/img/skills/postman.svg' },
  { name: 'Swagger', icon: '/img/skills/swagger.svg' },
  { name: 'IntelliJ IDEA', icon: '/img/skills/intellijidea.svg' },
  { name: 'Eclipse', icon: '/img/skills/eclipse.svg' },
]
