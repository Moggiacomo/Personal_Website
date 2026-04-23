export interface PublicationFigure {
  src: string;
  alt: string;
}

export interface Publication {
  slug: string;
  title: string;
  subtitle?: string;
  venue: string;
  type: string;
  year: string;
  url: string;
  abstract: string;
  image: string;
  figures?: PublicationFigure[];
  tags: string[];
}

export const FEATURED_IN_ABOUT_TAG = "Featured in About";

export const publications: Publication[] = [
  {
    slug: "building-scalable-react-applications",
    title: "Building Scalable React Applications: Best Practices and Patterns",
    subtitle: "Component Systems and Performance Architecture",
    venue: "Tech Conference 2024",
    type: "Conference Paper",
    year: "2024",
    url: "https://example.com/paper1",
    abstract:
      "An exploration of modern patterns for building maintainable React applications at scale, including state management, component architecture, and performance optimization.",
    image: "/uploads/publications/building-scalable-react-applications/cover.svg",
    figures: [
      {
        src: "/uploads/publications/building-scalable-react-applications/figure-1.svg",
        alt: "Publication cover preview for scalable React applications",
      },
      {
        src: "/uploads/publications/building-scalable-react-applications/figure-2.png",
        alt: "Publication detail figure for scalable React applications",
      },
    ],
    tags: ["Conference Paper", "2024", "React", FEATURED_IN_ABOUT_TAG],
  },
  {
    slug: "future-of-web-development",
    title: "The Future of Web Development: Trends and Predictions",
    venue: "Web Dev Journal",
    type: "Journal Article",
    year: "2023",
    url: "https://example.com/paper2",
    abstract:
      "A comprehensive analysis of emerging web technologies and their potential impact on how we build digital experiences in the coming years.",
    image: "/uploads/publications/future-of-web-development/cover.svg",
    figures: [
      {
        src: "/uploads/publications/future-of-web-development/figure-1.svg",
        alt: "Publication cover preview for future web development article",
      },
      {
        src: "/uploads/publications/future-of-web-development/figure-2.png",
        alt: "Publication detail figure for future web development article",
      },
    ],
    tags: ["Journal Article", "2023", "Web Trends", FEATURED_IN_ABOUT_TAG],
  },
  {
    slug: "optimizing-database-performance",
    title: "Optimizing Database Performance in Modern Web Applications",
    venue: "Database Systems Symposium",
    type: "Conference Paper",
    year: "2023",
    url: "https://example.com/paper3",
    abstract:
      "Techniques for improving database query performance and reducing latency in high-traffic web applications through indexing, caching, and query optimization.",
    image: "/uploads/publications/optimizing-database-performance/cover.svg",
    figures: [
      {
        src: "/uploads/publications/optimizing-database-performance/figure-1.svg",
        alt: "Publication cover preview for database performance paper",
      },
    ],
    tags: ["Conference Paper", "2023", "Databases"],
  },
  {
    slug: "accessibility-in-design-systems",
    title: "Accessibility in Design Systems: A Practical Guide",
    venue: "UX Design Magazine",
    type: "Article",
    year: "2022",
    url: "https://example.com/paper4",
    abstract:
      "Guidelines for integrating accessibility considerations into design system components, ensuring inclusive digital experiences for all users.",
    image: "/uploads/publications/accessibility-in-design-systems/cover.svg",
    figures: [
      {
        src: "/uploads/publications/accessibility-in-design-systems/figure-1.svg",
        alt: "Publication cover preview for accessibility in design systems article",
      },
    ],
    tags: ["Article", "2022", "Accessibility"],
  },
];
