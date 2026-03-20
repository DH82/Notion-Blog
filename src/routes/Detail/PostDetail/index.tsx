import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import AdSenseCard from "src/components/AdSenseCard"
import Image from "next/image"

type Props = {}

const isPaperCategory = (categories: string[] | undefined): boolean => {
  if (!categories) return false
  return categories.some(
    (cat) => cat.startsWith("Study/") || cat.startsWith("Paper/") || cat === "Study" || cat === "Paper"
  )
}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined
  const isPaper = isPaperCategory(data.category)

  return (
    <StyledWrapper data-has-cover={!!data.thumbnail}>
      {data.thumbnail && (
        <div className="cover">
          <Image
            src={data.thumbnail}
            fill
            alt={data.title}
            css={{ objectFit: "cover", objectPosition: isPaper ? "top" : "center" }}
            priority
          />
        </div>
      )}
      <article>
        {category && (
          <div css={{ marginBottom: "0.5rem" }}>
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        {data.type[0] === "Post" && <PostHeader data={data} />}
        <div>
          <NotionRenderer recordMap={data.recordMap} />
        </div>
        {data.type[0] === "Post" && (
          <>
            <Footer />
            <AdSenseCard />
            <CommentBox data={data} />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;

  &[data-has-cover="true"] {
    padding-top: 0;
  }

  .cover {
    position: relative;
    width: calc(100% + 3rem);
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    margin-bottom: 2rem;
    padding-bottom: 33%;
    border-radius: 1.5rem 1.5rem 0 0;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.gray4};
  }

  > article {
    margin: 0 auto;
    max-width: 42rem;
  }
`
