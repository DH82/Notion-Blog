import type { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "../../apis/notion-client/getPosts"
import { CONFIG } from "site.config"

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const posts = await getPosts().catch(() => [])
  const base = CONFIG.link.replace(/\/$/, "")

  const items = posts
    .filter((post) => post.status?.[0] === "Public")
    .slice(0, 50)
    .map((post) => {
      const link = `${base}/${post.slug.replace(/^\//, "")}`
      const pubDate = new Date(
        post.date?.start_date || post.createdTime
      ).toUTCString()

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>${post.summary ? `\n      <description>${escapeXml(post.summary)}</description>` : ""}${post.tags?.length ? `\n      <category>${escapeXml(post.tags.join(", "))}</category>` : ""}
    </item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(CONFIG.blog.title)}</title>
    <link>${base}</link>
    <description>${escapeXml(CONFIG.blog.description)}</description>
    <language>${CONFIG.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  res.setHeader("Content-Type", "application/xml; charset=utf-8")
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=600"
  )
  res.removeHeader("ETag")
  res.removeHeader("Last-Modified")
  res.status(200).send(xml)
}
