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

export function generate(el) {
  const children = genChildren(el) // 获取孩子节点
  let code = `_c("${el.tag}", ${el.attrs.length?genProps(el.attrs):'undefined'}
  ${children?`,${children}`: ''})
  `
  return code
}