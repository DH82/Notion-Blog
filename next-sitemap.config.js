const { CONFIG } = require("./site.config")

module.exports = {
  siteUrl: CONFIG.link,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false,
  // 동적 사이트맵 페이지와 충돌 방지: 정적 sitemap.xml 생성 제외
  exclude: ["/sitemap.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [`${CONFIG.link}/sitemap.xml`],
  },
}
