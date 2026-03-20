# Notion Blog

A personal blog built with [Next.js](https://nextjs.org/) and [Notion](https://www.notion.so/) as a CMS, deployed on [Vercel](https://vercel.com/).

> This project is based on [morethan-log](https://github.com/morethanmin/morethan-log) by [@morethanmin](https://github.com/morethanmin), with modifications and additional features tailored to my needs.

**Live Site:** [blog-dh0.vercel.app](https://blog-dh0.vercel.app/)

## Features

- **Notion as CMS** — Write and manage posts directly in Notion. Changes are reflected automatically.
- **Comment System** — Custom comment system powered by Neon PostgreSQL with GitHub OAuth authentication.
- **Google AdSense** — Ad integration for monetization.
- **SEO** — Dynamic sitemap (`/sitemap.xml`), RSS feed (`/feed.xml`), Open Graph image generation, Google Search Console, and Naver Search Advisor support.
- **Google Analytics** — Built-in traffic tracking.
- **Dark Mode** — Supports light, dark, and system theme.

## Modifications from morethan-log

- Added custom comment system using Neon PostgreSQL + GitHub OAuth (replacing Utterances/Cusdis)
- Added Google AdSense integration
- Added RSS feed generation (`/api/feed.xml`)
- Added dynamic sitemap with XSL stylesheet
- Added `ads.txt` for AdSense verification
- Sidebar tags limited to top 10 most used
- Various SEO and caching improvements

## Getting Started

### Prerequisites

- Node.js
- A [Notion](https://www.notion.so/) account with a duplicated [blog template](https://morethanmin.notion.site/12c38b5f459d4eb9a759f92fba6cea36?v=2e7962408e3842b2a1a801bf3546edda)
- A [Vercel](https://vercel.com/) account

### Setup

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `site.config.js` with your profile and preferences.
4. Deploy to Vercel with the following environment variables:

| Variable | Required | Description |
|---|---|---|
| `NOTION_PAGE_ID` | Yes | Notion database page ID |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | No | Google Analytics measurement ID |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | No | Google Search Console verification |
| `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` | No | Naver Search Advisor verification |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID` | No | Google AdSense publisher ID |
| `DATABASE_URL` | No | Neon PostgreSQL connection string (for comments) |
| `GITHUB_ID` | No | GitHub OAuth Client ID (for comments) |
| `GITHUB_SECRET` | No | GitHub OAuth Client Secret (for comments) |
| `TOKEN_FOR_REVALIDATE` | No | Secret token for on-demand ISR revalidation |

## Tech Stack

- **Framework:** Next.js 13
- **CMS:** Notion (via `react-notion-x`)
- **Database:** Neon PostgreSQL (serverless)
- **Auth:** NextAuth.js (GitHub provider)
- **Styling:** Emotion (CSS-in-JS)
- **Deployment:** Vercel

## License

[MIT](LICENSE) — Originally created by [@morethanmin](https://github.com/morethanmin).
