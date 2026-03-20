import { useEffect, useState } from "react"
import { useSession, signIn } from "next-auth/react"
import styled from "@emotion/styled"
import { TPost } from "src/types"

type Comment = {
  id: number
  post_id: string
  author_name: string
  author_image: string | null
  author_github: string | null
  content: string
  created_at: string
}

type Props = {
  data: TPost
}

const CommentBox: React.FC<Props> = ({ data }) => {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${data.id}`)
      if (res.ok) {
        const json = await res.json()
        setComments(json)
      }
    } catch (e) {
      console.error("Failed to fetch comments", e)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [data.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: data.id, content: content.trim() }),
      })
      if (res.ok) {
        setContent("")
        fetchComments()
      }
    } catch (e) {
      console.error("Failed to post comment", e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/comments?id=${commentId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        fetchComments()
      }
    } catch (e) {
      console.error("Failed to delete comment", e)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentGithub = (session?.user as any)?.github

  return (
    <StyledWrapper>
      <h3 className="comment-title">Comments ({comments.length})</h3>

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-author">
                {comment.author_image && (
                  <img
                    src={comment.author_image}
                    alt={comment.author_name}
                    className="author-avatar"
                  />
                )}
                <span className="author-name">{comment.author_name}</span>
                <span className="comment-date">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              {currentGithub && currentGithub === comment.author_github && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(comment.id)}
                >
                  삭제
                </button>
              )}
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>

      {session ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows={3}
          />
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? "작성 중..." : "댓글 작성"}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <button onClick={() => signIn("github")} className="github-login-btn">
            GitHub로 로그인하여 댓글 작성
          </button>
        </div>
      )}
    </StyledWrapper>
  )
}

export default CommentBox

const StyledWrapper = styled.div`
  margin-top: 2.5rem;

  .comment-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .comment-item {
    padding: 1rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "#f9fafb" : theme.colors.gray5};
    border: 1px solid
      ${({ theme }) =>
        theme.scheme === "light" ? "#e5e7eb" : theme.colors.gray6};
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .comment-author {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .author-name {
    font-weight: 600;
    font-size: 0.875rem;
  }

  .comment-date {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .comment-content {
    font-size: 0.9375rem;
    line-height: 1.6;
    white-space: pre-wrap;
    margin: 0;
  }

  .delete-btn {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray10};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;

    &:hover {
      color: #ef4444;
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "#fef2f2" : "rgba(239, 68, 68, 0.1)"};
    }
  }

  .comment-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    textarea {
      width: 100%;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid
        ${({ theme }) =>
          theme.scheme === "light" ? "#d1d5db" : theme.colors.gray6};
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "white" : theme.colors.gray4};
      color: ${({ theme }) => theme.colors.gray12};
      font-size: 0.9375rem;
      resize: vertical;
      font-family: inherit;

      &:focus {
        outline: none;
        border-color: ${({ theme }) =>
          theme.scheme === "light" ? "#3b82f6" : "#60a5fa"};
      }
    }

    button {
      align-self: flex-end;
      padding: 0.5rem 1.25rem;
      border-radius: 0.5rem;
      border: none;
      background-color: #3b82f6;
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;

      &:hover:not(:disabled) {
        background-color: #2563eb;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  .login-prompt {
    text-align: center;
    padding: 1.5rem;

    .github-login-btn {
      padding: 0.625rem 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid
        ${({ theme }) =>
          theme.scheme === "light" ? "#d1d5db" : theme.colors.gray6};
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "white" : theme.colors.gray5};
      color: ${({ theme }) => theme.colors.gray12};
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) =>
          theme.scheme === "light" ? "#f3f4f6" : theme.colors.gray6};
      }
    }
  }
`
