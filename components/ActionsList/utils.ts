import { CategoryTreeNode, LookUpProps } from '../../services/contentful'

export const findCategoryAncestors = (lookUp: LookUpProps, nodeId?: string) => {
  if (!nodeId) return []

  const ancestors: string[] = []

  let parentId = lookUp[nodeId] && lookUp[nodeId].parentId
  while (parentId !== undefined) {
    ancestors.unshift(parentId || '')
    parentId = parentId && lookUp[parentId] && lookUp[parentId].parentId
  }
  return ancestors
}

export const findCategoryChildren = (node: CategoryTreeNode): string[] => {
  return node.elements?.map((e) => {
    if ('elements' in e) {
      return [...findCategoryChildren(e), e.categoryId]
    }
    return e.categoryId
  }) as string[]
}