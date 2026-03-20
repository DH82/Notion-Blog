import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"
import { sql } from "src/libs/neon"

function getIpHash(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"]
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : forwarded?.[0]) ||
    req.socket.remoteAddress ||
    "unknown"
  return crypto.createHash("sha256").update(ip).digest("hex")
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { path } = req.body
    if (!path || typeof path !== "string") {
      return res.status(400).json({ error: "path is required" })
    }

    const ipHash = getIpHash(req)

    const recent = await sql`
      SELECT 1 FROM page_views
      WHERE page_path = ${path}
        AND ip_hash = ${ipHash}
        AND viewed_at >= DATE_TRUNC('day', NOW() AT TIME ZONE 'Asia/Seoul') AT TIME ZONE 'Asia/Seoul'
      LIMIT 1
    `

    if (recent.length > 0) {
      return res.status(200).json({ success: true, deduplicated: true })
    }

    await sql`INSERT INTO page_views (page_path, ip_hash) VALUES (${path}, ${ipHash})`
    return res.status(201).json({ success: true })
  }

  if (req.method === "GET") {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayResult, totalResult] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM page_views WHERE viewed_at >= ${today.toISOString()}`,
      sql`SELECT COUNT(*)::int AS count FROM page_views`,
    ])

    return res.status(200).json({
      today: todayResult[0].count,
      total: totalResult[0].count,
    })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
