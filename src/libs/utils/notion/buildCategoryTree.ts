import { TPosts } from "src/types"

export type CategoryTreeNode = {
  name: string
  fullPath: string
  count: number
  children: CategoryTreeNode[]
}

export function buildCategoryTree(posts: TPosts): CategoryTreeNode[] {
  const categoryCount: Record<string, number> = {}

  posts.forEach((post) => {
    if (!post.category) return
    post.category.forEach((cat) => {
      if (!cat) return
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })
  })

  const root: CategoryTreeNode[] = []

  Object.keys(categoryCount)
    .sort()
    .forEach((fullPath) => {
      const parts = fullPath.split("/")
      let currentLevel = root

      parts.forEach((part, index) => {
        const currentPath = parts.slice(0, index + 1).join("/")
        let existing = currentLevel.find((node) => node.name === part)

        if (!existing) {
          existing = {
            name: part,
            fullPath: currentPath,
            count: 0,
            children: [],
          }
          currentLevel.push(existing)
        }

        if (index === parts.length - 1) {
          existing.count = categoryCount[fullPath]
        }

        currentLevel = existing.children
      })
    })

  // Propagate counts: parent count = own count + sum of children
  function sumCounts(nodes: CategoryTreeNode[]): number {
    return nodes.reduce((sum, node) => {
      const childSum = sumCounts(node.children)
      node.count = node.count + childSum
      return sum + node.count
    }, 0)
  }

  sumCounts(root)

  return root
}
