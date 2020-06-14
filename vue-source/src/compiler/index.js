// 实现模板的编译
// 模板编译原理
// 1.先把我们的代码转化成ast语法树 (1)parser解析 (正则)
// 2.标记静态树 (2) 树得遍历标记markup
// 3.通过ast产生的语法树 生成代码 => render函数 codegen
import { parseHTML } from './parser-html'

export function compileToFunctions(template) {
  let root = parseHTML(template)
  console.log(root)
  return function render() {}
}
