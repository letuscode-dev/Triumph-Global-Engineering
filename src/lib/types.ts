export type ServiceCategory = "borehole" | "irrigation" | "solar" | "water";

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  icon: string; // lucide icon name
  excerpt: string;
  description: string;
  benefits: string[];
  process: { step: string; detail: string }[];
  image: string;
  gallery: string[];
  keywords: string[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ServiceCategory;
  serviceType: string;
  location: string;
  completedAt: string; // ISO date
  description: string;
  cover: string;
  images: string[];
  video?: string;
  beforeImage?: string;
  afterImage?: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  quote: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string; // markdown-ish plain text paragraphs
  cover: string;
  author: string;
  publishedAt: string; // ISO date
  readMinutes: number;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface MediaItem {
  id: string;
  type: "image" | "video";
  src: string;
  caption: string;
  category: ServiceCategory;
}

export interface Lead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  location?: string;
  service?: string;
  budget?: string;
  message: string;
  status: "new" | "contacted" | "quoted" | "won" | "lost";
  source: "quote" | "contact";
  createdAt: string;
}
