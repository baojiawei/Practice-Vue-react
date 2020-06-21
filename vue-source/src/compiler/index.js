// 实现模板的编译
// 模板编译原理
// 1.先把我们的代码转化成ast语法树 (1)parser解析 (正则)
// 2.标记静态树 (2) 树得遍历标记markup
// 3.通过ast产生的语法树 生成代码 => render函数 codegen
import { parseHTML } from './parser-html'
import { generate } from './generate'

export function compileToFunctions(template) {
  // 解析html字符串 将html字符串 => ast语法树
  let root = parseHTML(template)
  // 需要将ast语法树生成最终的render函数 就是字符串拼接(模板引擎 )
  let code = generate(root)
  // 所有的模板引擎实现，都需要new Function + with
  let renderFn = new Function(`with(this){ return ${code} }`)
  // 核心思路就是将模板转化成下面这段字符串
  // <div id="app"><p>hello {{name}}</p> hello</div>
  // 将ast树再次转化成js的语法
  // _c('div', {id: 'app'}, _c('p', undefined, _v('hello', _s(name))), _v('hello'))
  return renderFn
}
