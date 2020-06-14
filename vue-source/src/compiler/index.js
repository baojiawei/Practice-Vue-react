// 实现模板的编译
// 模板编译原理
// 1.先把我们的代码转化成ast语法树 (1)parser解析 (正则)
// 2.标记静态树 (2) 树得遍历标记markup
// 3.通过ast产生的语法树 生成代码 => render函数 codegen
import { parseHTML } from './parser-html'
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
// 处理属性 拼接成属性的字符串
function genProps(attrs) {
  let str = ''
  for(let i=0;i<attrs.length;i++) {
    let attr = attrs[i]
    if(attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str+=`${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if(node.type === 1) {
    return generate(node)
  } else {
    let text = node.text
    let tokens = []
    let match, index
    // 只要是全局匹配 就需要将lastIndex的偏移量置为0
    let lastIndex = defaultTagRE.lastIndex = 0
    while(match = defaultTagRE.exec(text)) {
      index = match.index
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if(lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    // a {{name}} b{{age}} c
    // _v("a"+_s(name)+"b"+_s(age)+"c")
    // 正则 lastIndex问题
    return `_v(${tokens.join('+')})`
  }
}

function genChildren(el) {
  let children =  el.children
  if(children && children.length>0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false
  }
}
function generate(el) {
  const children = genChildren(el) // 获取孩子节点
  let code = `_c("${el.tag}", ${el.attrs.length?genProps(el.attrs):'undefined'}
  ${children?`,${children}`: ''})
  `
  return code
}
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
