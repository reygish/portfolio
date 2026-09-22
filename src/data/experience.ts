import type { ExperienceItem } from './types';

// Edit freely. Order is most-recent-first.
export const experience: ExperienceItem[] = [
  {
    id: 'dba-slc',
    role: 'Database Administrator Staff',
    organization: 'SLC, Bina Nusantara University',
    period: 'Jan 2026 — Present',
    summary:
      'Own exam scheduling and allocation data for laboratory subjects across six campuses, and maintain the internal web applications built on top of it.',
    highlights: [
      'Managed exam schedules and allocation for laboratory subjects across six campuses: Kemanggisan, Alam Sutera, Bekasi, Bandung, Malang, and Semarang.',
      'Optimized queries and scheduled jobs for exam schedules and student enrollment records.',
      'Maintained React / ASP.NET web applications supporting internal and external laboratory activities.',
      'Handled daily data collection requests.',
    ],
    tags: ['SQL Server', 'Query Optimization', 'React', 'ASP.NET'],
  },
  {
    id: 'la-ppti-bca',
    role: 'Laboratory Assistant',
    organization: 'PPTI BCA, Sentul',
    period: 'Aug 2025 — Dec 2025',
    summary:
      'Taught hands-on programming to BCA Scholarship students for five months.',
    highlights: [
      'Taught Algorithm and Programming (basic algorithms in C) across 3 classes every week for 5 months.',
    ],
    tags: ['C', 'Algorithms', 'Teaching'],
  },
  {
    id: 'la-slc',
    role: 'Laboratory Assistant',
    organization: 'SLC, Bina Nusantara University',
    period: 'Feb 2025 — Jan 2026',
    summary:
      'Taught 6-7 classes per semester across a wide subject range, built assessment material, shipped five mandatory development projects, and trained incoming assistants.',
    highlights: [
      'Taught subjects including Network Penetration Testing (Kali Linux), OOP and Design Patterns (Java), Databases (MySQL), Natural Language Processing, and Computer Graphics (Three.js).',
      'Built assessment cases and graded 200+ student submissions to a consistent standard.',
      'Built and presented 5 mandatory development projects (TPA): a Unity game, a Tauri + React desktop app, a Go + React web app over gRPC, a Kubernetes/Docker DevOps project, and a LibGDX + Kotlin + Firebase mobile game — each spanning 2 weeks to 1 month.',
      'Qualified to teach 83% of 235 SLC-managed subjects.',
      'Averaged 99% student satisfaction across surveys.',
      'Served as New Assistant Recruitment Trainer and Subject Coordinator — managing trainer jobdesks, evaluating trainees, and delivering presentation material.',
      'Awarded "Best Assistant Candidate".',
    ],
    tags: ['Teaching', 'Java', 'MySQL', 'NLP', 'Three.js', 'Kali Linux'],
  },
];
