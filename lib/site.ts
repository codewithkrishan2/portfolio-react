export const site = {
  name: 'Krishan Kant Singh Gautam',
  shortName: 'Krishan Kant',
  /**
   * The handle is a search target in its own right — people look up
   * "codewithkrishan". It needs to exist as readable text on the page, not only
   * inside profile URLs, and as `alternateName` in the Person schema.
   */
  handle: 'codewithkrishan',
  title: 'Full Stack Software Engineer',
  url: 'https://codewithkrishan.netlify.app',
  email: 'kksg1999@gmail.com',
  phone: '+91 83930 39145',
  phoneHref: '+918393039145',
  location: 'Pune, Maharashtra, India',
  city: 'Pune',
  region: 'Maharashtra',
  country: 'IN',
  resumeUrl:
    'https://drive.google.com/drive/folders/17foKswAgLRhAUcA-zkbVKlB6wQwCzqSf?usp=sharing',
  description:
    'Krishan Kant Singh Gautam (codewithkrishan) is a Full Stack Software Engineer in Pune, India. I build event-driven backends and REST APIs with Java, Spring Boot, Node.js, PostgreSQL and AWS — and the React interfaces on top of them.',
  /** Shorter variant for cards and feeds, where long descriptions get cut. */
  tagline: 'Full Stack Software Engineer in Pune — event-driven backends, REST APIs and React.',
  socials: {
    github: 'https://github.com/codewithkrishan2',
    linkedin: 'https://www.linkedin.com/in/codewithkrishan/',
    instagram: 'https://www.instagram.com/krishan_kant_singh_gautam/',
  },
  employer: {
    name: 'Asmadiya Technologies',
    location: 'Pune, India',
  },
  education: {
    name: 'Kamla Nehru Institute of Technology',
    location: 'Sultanpur, India',
  },
  analytics: {
    ga4: 'G-BYXC5FRJS1',
    clarity: 'kgnyj2mcz2',
  },
} as const

/** Subjects the Person schema claims expertise in. Feeds `knowsAbout`. */
export const expertise = [
  'Java',
  'Spring Boot',
  'Spring Security',
  'Node.js',
  'Express.js',
  'TypeScript',
  'React',
  'Next.js',
  'Angular',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'BullMQ',
  'NATS',
  'Apache Kafka',
  'Microservices',
  'Event-Driven Architecture',
  'Distributed Systems',
  'REST API Design',
  'OAuth 2.0',
  'Role-Based Access Control',
  'AWS Lambda',
  'Amazon Web Services',
  'Docker',
] as const

/**
 * Navigation.
 *
 * Hrefs are root-relative (`/#about`, not `#about`) because the header also
 * renders on /work and /work/<slug>, where those sections do not exist — a bare
 * hash would be a dead link there. Work points at a real route, which also
 * gives crawlers a path off the homepage.
 */
export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/#services', label: 'What I Do' },
  { href: '/#experience', label: 'Experience' },
  { href: '/work', label: 'Work' },
  { href: '/#skills', label: 'Skills' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const
