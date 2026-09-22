import type { SkillGroup } from './types';

export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    items: [
      'C / C++',
      'Java',
      'Python',
      'Go',
      'Rust',
      'TypeScript',
      'JavaScript',
      'Swift',
      'Kotlin',
      'HTML',
      'CSS',
    ],
  },
  {
    category: 'AI / ML',
    items: [
      'Deep Learning (CNN)',
      'ResNet50',
      'Computer Vision',
      'Speech Recognition',
      'NLP',
      'LLMs',
      'RAG',
    ],
  },
  {
    category: 'Frameworks',
    items: ['React', 'Next.js', 'Nest.js', 'Express.js', 'Tauri', 'LibGDX'],
  },
  {
    category: 'Databases & Storage',
    items: [
      'SQL Server',
      'MySQL',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'Memcached',
      'Firebase',
      'Supabase',
      'MinIO',
      'ChromaDB',
    ],
  },
  {
    category: 'ORMs',
    items: ['SeaORM', 'Sequelize', 'Prisma'],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      'Docker',
      'Kubernetes',
      'Azure',
      'Terraform',
      'Ansible',
      'GitHub Actions',
      'Proxmox',
    ],
  },
  {
    category: 'Architectures',
    items: ['MVC', 'Hexagonal', 'Microservices'],
  },
  {
    category: 'Networking & Security',
    items: ['MikroTik', 'Cisco Packet Tracer', 'Kali Linux'],
  },
];
