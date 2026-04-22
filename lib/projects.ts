export interface ProjectFigure {
  src: string;
  alt: string;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  figures?: ProjectFigure[];
  url: string;
  github: string;
  tags: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and an intuitive admin dashboard.",
    image: "/project-ecommerce-1.png",
    figures: [
      {
        src: "/project-ecommerce-1.png",
        alt: "E-Commerce Platform storefront interface",
      },
      {
        src: "/project-ecommerce-2.png",
        alt: "E-Commerce Platform alternate figure two",
      },
      {
        src: "/project-ecommerce-3.png",
        alt: "E-Commerce Platform alternate figure three",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
    featured: true,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time analytics dashboard for tracking user behavior and business metrics with interactive visualizations.",
    image: "/project-analytics-1.png",
    figures: [
      {
        src: "/project-analytics-1.png",
        alt: "Analytics Dashboard KPI overview",
      },
      {
        src: "/project-analytics-2.png",
        alt: "Analytics Dashboard alternate figure two",
      },
      {
        src: "/project-analytics-3.png",
        alt: "Analytics Dashboard alternate figure three",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["React", "D3.js", "Node.js", "MongoDB"],
    featured: true,
  },
  {
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team features.",
    image: "/project-task-1.png",
    figures: [
      {
        src: "/project-task-1.png",
        alt: "Task Management App board view",
      },
      {
        src: "/project-task-2.png",
        alt: "Task Management App alternate figure two",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Vue.js", "Firebase", "Tailwind CSS"],
    featured: false,
  },
  {
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps marketers create engaging copy for various platforms.",
    image: "/project-ai-1.png",
    figures: [
      {
        src: "/project-ai-1.png",
        alt: "AI Content Generator prompt workspace",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    featured: false,
  },
];
