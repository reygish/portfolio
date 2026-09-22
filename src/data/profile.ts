import type { Profile } from './types';

// Edit this file to update your personal info. No component changes needed.
export const profile: Profile = {
  name: 'Daniel Regis Febrianto',
  headline: 'Computer Science · Intelligent Systems (AI)',
  bio: 'Computer Science undergraduate at Bina Nusantara University, streaming in Intelligent Systems. I teach hands-on coding to hundreds of students as a laboratory assistant, keep university exam and enrollment databases running as a DBA, and publish research on retrieval-augmented generation. I like building things end to end — from CNN inference to microservices to the interface on top.',
  location: 'Jakarta, Indonesia',
  email: 'danielregisf@gmail.com',
  // Drop a photo at public/portrait.jpg (a head-and-shoulders shot works best).
  // Until then the core just shows particles.
  portrait: '/portrait.jpg',
  cv: '/CV.pdf',
  education: {
    institution: 'Bina Nusantara University',
    degree: 'Undergraduate in Computer Science',
    focus: 'Intelligent Systems (AI)',
    gpa: '3.85 / 4.00',
    period: 'Expected 2028',
    location: 'West Jakarta, Jakarta',
  },
  certifications: ['Microsoft Certified: Azure AI Fundamentals'],
  socials: [
    { label: 'GitHub', href: 'https://github.com/reygish' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/daniel-regis-febrianto',
    },
  ],
};
