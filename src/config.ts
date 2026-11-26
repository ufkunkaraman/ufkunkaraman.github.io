/**
 * Internal resolved configuration used throughout the codebase.
 *
 * Prefer editing `astro-paper.config.ts` instead of this file. This module exists to
 * apply defaults and expose a fully-resolved config shape (`ResolvedAstroPaperConfig`).
 */
import userConfig from "@/astro-paper.config";
import type { ResolvedAstroPaperConfig } from "./types/config";
import { PUBLIC_GOOGLE_SITE_VERIFICATION } from "astro:env/client";

const DEFAULT_OG_IMAGE = "default-og.jpg";

const config: ResolvedAstroPaperConfig = {
  site: {
    ...userConfig.site,
    ogImage: userConfig.site.ogImage ?? DEFAULT_OG_IMAGE,
    lang: userConfig.site.lang ?? "en",
    timezone: userConfig.site.timezone ?? "UTC",
    dir: userConfig.site.dir ?? "ltr",
    googleVerification:
      userConfig.site.googleVerification || PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    // Deprecated and unused. Not read from userConfig, so builds don't warn about it.
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    dynamicOgImage: userConfig.features?.dynamicOgImage ?? true,
    showArchives: userConfig.features?.showArchives ?? true,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
    toc: userConfig.features?.toc ?? true,
  },
  socials: userConfig.socials ?? [],
  shareLinks: userConfig.shareLinks ?? [],
};

/**
 * Giscus (GitHub Discussions) comments configuration.
 * Enable Discussions on GitHub repo and get repoId / categoryId from https://giscus.app/
 */
export const GISCUS = {
  repo: "ufkunkaraman/ufkunkaraman.github.io",
  repoId: "R_kgDOHlFeAA",
  category: "Announcements",
  categoryId: "DIC_kwDOHlFeAM4DMDW8",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
} as const;

/**
 * Cloudflare Web Analytics token.
 * Get your token from Cloudflare Dashboard -> Web Analytics -> Add a site (ufkunkaraman.com).
 */
export const CLOUDFLARE_ANALYTICS_TOKEN = "f6edd306d8bf4440b84c78a292f954c7";

export default config;
