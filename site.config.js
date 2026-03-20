const CONFIG = {
  // profile setting (required)
  profile: {
    name: "DH Lee",
    image: "/Hari.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Medical AI Reseacher",
    bio: "We may have won the war, but my home is in ruins.",
    email: "na22jho@gmail.com",
    linkedin: "donghyun-lee-8b02a8345",
    github: "DH82",
    instagram: "",
  },
  projects: [
    {
      name: `DH's Blog`,
      href: "https://github.com/DH82",
    },
  ],
  // blog setting (required)
  blog: {
    title: "DH's Blog",
    description: "Hello..?",
    scheme: "system", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://blog-dh0.vercel.app/",
  since: 2026, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: true,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: true,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  neonComments: {
    enable: true,
  },
  googleAdsense: {
    enable: true,
    config: {
      publisherId: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID || "",
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 300, // revalidate time for [slug], index
}

module.exports = { CONFIG }
