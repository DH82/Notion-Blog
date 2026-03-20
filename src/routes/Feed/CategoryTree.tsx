import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Emoji } from "src/components/Emoji"
import { useCategoryTreeQuery } from "src/hooks/useCategoryTreeQuery"
import { CategoryTreeNode } from "src/libs/utils/notion"
import { DEFAULT_CATEGORY } from "src/constants"

type TreeNodeProps = {
  node: CategoryTreeNode
  depth: number
  currentCategory: string
  onSelect: (fullPath: string) => void
}

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  currentCategory,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(
    currentCategory.startsWith(node.fullPath)
  )
  const hasChildren = node.children.length > 0
  const isActive = currentCategory === node.fullPath

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div className="tree-node">
      <a
        className="tree-item"
        data-active={isActive}
        style={{ paddingLeft: `${depth * 0.75 + 0.25}rem` }}
        onClick={() => onSelect(node.fullPath)}
      >
        {hasChildren && (
          <span className="toggle" onClick={handleToggle}>
            {expanded ? "▼" : "▶"}
          </span>
        )}
        {!hasChildren && <span className="toggle-placeholder" />}
        <span className="name">{node.name}</span>
        <span className="count">{node.count}</span>
      </a>
      {hasChildren && expanded && (
        <div className="children">
          {node.children.map((child) => (
            <TreeNode
              key={child.fullPath}
              node={child}
              depth={depth + 1}
              currentCategory={currentCategory}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const CategoryTree: React.FC = () => {
  const router = useRouter()
  const tree = useCategoryTreeQuery()
  const currentCategory =
    `${router.query.category || ``}` || DEFAULT_CATEGORY

  const totalCount = tree.reduce((sum, node) => sum + node.count, 0)

  const handleSelect = (fullPath: string) => {
    if (currentCategory === fullPath) {
      router.push({
        query: { ...router.query, category: undefined },
      })
    } else {
      router.push({
        query: { ...router.query, category: fullPath },
      })
    }
  }

  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>📂</Emoji> Categories
      </div>
      <div className="list">
        <a
          className="tree-item all-item"
          data-active={currentCategory === DEFAULT_CATEGORY}
          onClick={() =>
            router.push({ query: { ...router.query, category: undefined } })
          }
        >
          <span className="name">All</span>
          <span className="count">{totalCount}</span>
        </a>
        {tree.map((node) => (
          <TreeNode
            key={node.fullPath}
            node={node}
            depth={0}
            currentCategory={currentCategory}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </StyledWrapper>
  )
}

export default CategoryTree

const StyledWrapper = styled.div`
  margin-bottom: 1rem;

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
    gap: 0.25rem;
    overflow: scroll;

    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .tree-item {
    display: flex;
    align-items: center;
    padding: 0.25rem;
    padding-right: 1rem;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray10};
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;

    :hover {
      background-color: ${({ theme }) => theme.colors.gray4};
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
    }

    .toggle {
      font-size: 0.625rem;
      width: 1rem;
      text-align: center;
      flex-shrink: 0;
      cursor: pointer;
    }

    .toggle-placeholder {
      width: 1rem;
      flex-shrink: 0;
    }

    .name {
      flex: 1;
    }

    .count {
      margin-left: 0.5rem;
      font-size: 0.75rem;
      color: ${({ theme }) => theme.colors.gray8};
    }
  }

  .all-item {
    padding-left: 0.25rem;
  }

  /* Mobile: flat horizontal layout */
  @media (max-width: 1023px) {
    .tree-node .children {
      display: contents;
    }

    .tree-item {
      .toggle {
        display: none;
      }
      .toggle-placeholder {
        display: none;
      }
      .count {
        display: none;
      }
    }
  }
`
