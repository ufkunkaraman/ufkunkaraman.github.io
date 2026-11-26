export interface ProjectItem {
  name: string;
  url: string;
  language: string;
  description: string;
  tags: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    name: "glowroot-exporter",
    url: "https://github.com/ufkunkaraman/glowroot-exporter",
    language: "Go",
    description: "A Glowroot APM metric exporter for Prometheus.",
    tags: ["Go", "Prometheus", "Glowroot", "Observability"],
  },
];
