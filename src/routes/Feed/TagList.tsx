import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { Emoji } from "src/components/Emoji"
import { useTagsQuery } from "src/hooks/useTagsQuery"

type Props = {}

const TagList: React.FC<Props> = () => {
  const router = useRouter()
  const currentTag = router.query.tag || undefined
  const data = useTagsQuery()

  const handleClickTag = (value: any) => {
    // delete
    if (currentTag === value) {
      router.push({
        query: {
          ...router.query,
          tag: undefined,
        },
      })
    }
    // add
    else {
      router.push({
        query: {
          ...router.query,
          tag: value,
        },
      })
    }
  }

  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>🏷️</Emoji> Tags
      </div>
      <div className="list">
        {Object.entries(data)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([key], idx, arr) => (
          <React.Fragment key={key}>
            <a
              data-active={key === currentTag}
              onClick={() => handleClickTag(key)}
            >
              {key}
            </a>
            {idx < arr.length - 1 && <span className="sep">, </span>}
          </React.Fragment>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default TagList

const StyledWrapper = styled.div`
  .top {
    display: none;
    padding: 0.25rem;
    margin-bottom: 0.75rem;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin-bottom: 1.5rem;

    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      flex-wrap: wrap;
    }

    a {
      display: inline;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray10};
      white-space: nowrap;
      cursor: pointer;

      :hover {
        color: ${({ theme }) => theme.colors.gray12};
      }
      &[data-active="true"] {
        color: ${({ theme }) => theme.colors.gray12};
        font-weight: 600;
      }
    }

    .sep {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.gray10};
      white-space: nowrap;
    }
  }
`
