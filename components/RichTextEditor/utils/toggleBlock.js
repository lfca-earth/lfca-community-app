import { Transforms, Editor, Element } from "slate"

import { isBlockActiveWithinSelection } from "./isBlockActiveWithinSelection"
import { DEFAULT_ELEMENT_TYPE, LIST_TYPES } from "../config"

export function toggleBlock(editor, format) {
  const isActive = isBlockActiveWithinSelection(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties = {
    type: isActive ? DEFAULT_ELEMENT_TYPE : isList ? "list-item" : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}