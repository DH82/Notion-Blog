import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { sql } from "src/libs/neon"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { postId } = req.query
    if (!postId || typeof postId !== "string") {
      return res.status(400).json({ error: "postId is required" })
    }

    const comments = await sql`
      SELECT id, post_id, author_name, author_image, author_github, content, created_at, updated_at
      FROM comments
      WHERE post_id = ${postId}
      ORDER BY created_at ASC
    `
    return res.status(200).json(comments)
  }

  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: "Login required" })
    }

    const { postId, content } = req.body
    if (!postId || !content) {
      return res.status(400).json({ error: "postId and content are required" })
    }

    const user = session.user as any
    const comment = await sql`
      INSERT INTO comments (post_id, author_name, author_image, author_github, content)
      VALUES (${postId}, ${user.name}, ${user.image}, ${user.github}, ${content})
      RETURNING *
    `
    return res.status(201).json(comment[0])
  }

  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user) {
      return res.status(401).json({ error: "Login required" })
    }

    const { id } = req.query
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "id is required" })
    }

    const user = session.user as any
    const existing = await sql`
      SELECT author_github FROM comments WHERE id = ${parseInt(id)}
    `
    if (existing.length === 0) {
      return res.status(404).json({ error: "Comment not found" })
    }
    if (existing[0].author_github !== user.github) {
      return res.status(403).json({ error: "Not authorized" })
    }

    await sql`DELETE FROM comments WHERE id = ${parseInt(id)}`
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: "Method not allowed" })
}
