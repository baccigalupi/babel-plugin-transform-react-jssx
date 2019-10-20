import strictJsxTransformer from "../lib"
import { transformSync, createConfigItem } from "@babel/core"

export const transform = (input) => {
  return transformSync(input, {
    plugins: [
      createConfigItem(strictJsxTransformer)
    ]
  })
}

export const ignoreWhitespace = (str) => {
  return str.replace(/\s*/g, "")
}