export interface ProjectFigure {
  src: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  figures?: ProjectFigure[];
  url: string;
  github: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    subtitle: "Commerce Systems and Checkout Design",
    description:
      "A full-stack e-commerce solution with real-time inventory management, payment processing, and an intuitive admin dashboard.",
    image: "/uploads/portfolio/ecommerce-platform/cover.png",
    figures: [
      {
        src: "/uploads/portfolio/ecommerce-platform/figure-1.png",
        alt: "E-Commerce Platform storefront interface",
      },
      {
        src: "/uploads/portfolio/ecommerce-platform/figure-2.png",
        alt: "E-Commerce Platform alternate figure two",
      },
      {
        src: "/uploads/portfolio/ecommerce-platform/figure-3.png",
        alt: "E-Commerce Platform alternate figure three",
      },
      {
        src: "/uploads/portfolio/ecommerce-platform/figure-4.svg",
        alt: "E-Commerce Platform blue square test figure",
      },
      {
        src: "/uploads/portfolio/ecommerce-platform/figure-5.svg",
        alt: "E-Commerce Platform tall rectangle test figure",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    subtitle: "Data Visualization and KPI Monitoring",
    description:
      "Real-time analytics dashboard for tracking user behavior and business metrics with interactive visualizations.",
    image: "/uploads/portfolio/analytics-dashboard/cover.png",
    figures: [
      {
        src: "/uploads/portfolio/analytics-dashboard/figure-1.png",
        alt: "Analytics Dashboard KPI overview",
      },
      {
        src: "/uploads/portfolio/analytics-dashboard/figure-2.png",
        alt: "Analytics Dashboard alternate figure two",
      },
      {
        src: "/uploads/portfolio/analytics-dashboard/figure-3.png",
        alt: "Analytics Dashboard alternate figure three",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["React", "D3.js", "Node.js", "MongoDB"],
  },
  {
    slug: "task-management-app",
    title: "Task Management App",
    description:
      "A collaborative task management application with real-time updates, drag-and-drop functionality, and team features.",
    image: "/uploads/portfolio/task-management-app/cover.png",
    figures: [
      {
        src: "/uploads/portfolio/task-management-app/figure-1.png",
        alt: "Task Management App board view",
      },
      {
        src: "/uploads/portfolio/task-management-app/figure-2.png",
        alt: "Task Management App alternate figure two",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Vue.js", "Firebase", "Tailwind CSS"],
  },
  {
    slug: "ai-content-generator",
    title: "AI Content Generator",
    description:
      "An AI-powered content generation tool that helps marketers create engaging copy for various platforms.",
    image: "/uploads/portfolio/ai-content-generator/cover.png",
    figures: [
      {
        src: "/uploads/portfolio/ai-content-generator/figure-1.png",
        alt: "AI Content Generator prompt workspace",
      },
    ],
    url: "https://example.com",
    github: "https://github.com",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
  },
];
