import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://ufkunkaraman.com/",
    title: "Ufkun Karaman",
    description:
      "Senior DevOps Engineer, SRE & System Administrator — Kubernetes, CI/CD, Observability, Security, and Linux infrastructure guides.",
    author: "Ufkun Karaman",
    profile: "https://ufkunkaraman.com/about",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/Istanbul",
    dir: "ltr",
  },
  posts: {
    perPage: 15,
    perIndex: 8,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/ufkunkaraman/ufkunkaraman.github.io/edit/main/",
    },
    search: "pagefind",
    toc: true,
  },
  socials: [
    { name: "github", url: "https://github.com/ufkunkaraman" },
    { name: "linkedin", url: "https://www.linkedin.com/in/ufkunkaraman/" },
    { name: "mail", url: "mailto:ufkunkaraman@gmail.com" },
  ],
  shareLinks: [
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});