import { useMemo } from "react"
import usePostsQuery from "./usePostsQuery"
import { buildCategoryTree } from "src/libs/utils/notion"

export const useCategoryTreeQuery = () => {
  const posts = usePostsQuery()
  const tree = useMemo(() => buildCategoryTree(posts), [posts])
  return tree
}
