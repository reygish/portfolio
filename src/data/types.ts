export interface Project {
  id: string;
  title: string;
  summary: string;
  /** Longer description, optional. */
  description?: string;
  tags: string[];
  /** External links. */
  links?: {
    repo?: string;
    demo?: string;
  };
  /** Optional path to a preview image in /public. */
  image?: string;
  /** Highlight the most important projects. */
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  /** e.g. "2024 — Present" */
  period: string;
  summary: string;
  highlights: string[];
  tags?: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Education {
  institution: string;
  /** e.g. "Undergraduate in Computer Science" */
  degree: string;
  /** e.g. "Intelligent Systems (AI)" */
  focus?: string;
  gpa?: string;
  /** e.g. "Expected 2028" */
  period: string;
  location?: string;
}

export interface Profile {
  name: string;
  headline: string;
  /** Short intro paragraph. */
  bio: string;
  location?: string;
  email: string;
  /**
   * Path to your portrait in /public, revealed holographically inside the
   * hero core. Omit (or leave the file missing) and the core simply shows
   * particles instead — nothing breaks.
   */
  portrait?: string;
  /** Path to a CV/resume in /public, e.g. "/CV.pdf". */
  cv?: string;
  education?: Education;
  certifications?: string[];
  socials: {
    label: string;
    href: string;
  }[];
}
