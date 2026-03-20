import type { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "../../apis/notion-client/getPosts"
import { CONFIG } from "site.config"

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await getPosts().catch(() => [])
  const base = CONFIG.link.replace(/\/$/, "")

  const urls = [
    { loc: base, priority: "1.0" },
    ...posts.map((post) => ({
      loc: `${base}/${post.slug.replace(/^\//, "")}`,
      priority: "0.7",
    })),
  ]

  const lastmod = new Date().toISOString()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ loc, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=600"
  )
  res.removeHeader("ETag")
  res.removeHeader("Last-Modified")
  res.status(200).send(xml)
}
