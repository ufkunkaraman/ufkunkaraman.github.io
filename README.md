# Ufkun Karaman — DevOps & SRE Blog

Personal technical blog and engineering notes of **Ufkun Karaman** (Senior DevOps Engineer | SRE | System Administrator), published at **[https://ufkunkaraman.com/](https://ufkunkaraman.com/)** using [Astro](https://astro.build/) and [AstroPaper](https://github.com/satnaing/astro-paper).

## Local Development

Requires **Node.js >= 22.23.4** (`v24.19.0` tested).

```bash
npm install
npm run dev      # Start local dev server at http://localhost:4321
npm run build    # Type-check, build static site, and index Pagefind search
npm run preview  # Preview the production build locally
```

## GitHub Pages Deployment (`ufkunkaraman.com`)

Deployment is automated via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

**One-time GitHub repository setup:**
1. Open **Settings → Pages** in your GitHub repository.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Ensure **Custom domain** is set to `ufkunkaraman.com` (also defined in [`public/CNAME`](public/CNAME)) and **Enforce HTTPS** is enabled.

## Enabling Giscus Comments & Cloudflare Web Analytics

Both integrations are pre-wired in [`src/config.ts`](src/config.ts):

1. **Giscus (GitHub Discussions):**
   - Enable **Discussions** in your GitHub repository settings and install the [Giscus GitHub App](https://github.com/apps/giscus).
   - Generate your configuration at [giscus.app](https://giscus.app/) and paste `repoId` and `categoryId` into `GISCUS` in [`src/config.ts`](src/config.ts).
2. **Cloudflare Web Analytics:**
   - Create a site entry for `ufkunkaraman.com` in **Cloudflare Dashboard → Web Analytics**.
   - Paste the beacon token into `CLOUDFLARE_ANALYTICS_TOKEN` in [`src/config.ts`](src/config.ts).
