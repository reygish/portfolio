import type { Project } from './types';

// NOTE: repo / demo links are intentionally left blank — add your own URLs and
// they'll render automatically. A project with no links simply shows no links.
export const projects: Project[] = [
  {
    id: 'survace',
    title: 'SurVace',
    summary:
      'A TikTok-style short-video platform built on Hexagonal Architecture and microservices, with hand sign recognition driving interaction.',
    description:
      'Full stack web application and microservices. A React and Go system structured on Hexagonal Architecture for scalability, with services connected over gRPC and gRPC-Web. Integrates a CNN-based hand sign recognition system, Redis caching, MinIO object storage, and a recommendation algorithm feeding infinite-scrolling video playback.',
    tags: ['Go', 'React', 'gRPC', 'CNN', 'Redis', 'MinIO', 'Microservices'],
    featured: true,
  },
  {
    id: 'rag-research',
    title: 'Cross-lingual Medical RAG (Research Paper)',
    summary:
      'Authored a paper evaluating RAG-enhanced local LLMs for Indonesian-to-English medical information retrieval. Accepted at ICISS2026 and published to IEEE Xplore.',
    description:
      '"Evaluating the Efficacy of RAG-Enhanced Local LLMs in Cross-lingual Medical Information Retrieval: A Case Study on Indonesian to English Retrieval." Accepted at the ICISS2026 conference and uploaded to IEEE Xplore.',
    tags: ['RAG', 'LLMs', 'ChromaDB', 'NLP', 'Research'],
    featured: true,
  },
  {
    id: 'yoshikoya',
    title: 'YoshiKoya',
    summary:
      'A high-performance desktop application built with React and Tauri (Rust), with system behaviour modelled in UML activity diagrams.',
    tags: ['Tauri', 'Rust', 'React', 'Tailwind CSS', 'UML'],
  },
  {
    id: 'grow-safari',
    title: 'Grow Safari: Infinite Lands',
    summary:
      'A 2D grid-based zoo tycoon mobile game. Engineered the core gameplay logic — movement, building — and designed the store assets.',
    tags: ['LibGDX', 'Kotlin', 'Firebase', 'Game Dev'],
  },
];
