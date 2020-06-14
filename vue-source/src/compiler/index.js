// 实现模板的编译
// 模板编译原理
// 1.先把我们的代码转化成ast语法树 (1)parser解析 (正则)
// 2.标记静态树 (2) 树得遍历标记markup
// 3.通过ast产生的语法树 生成代码 => render函数 codegen
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性的
const startTagClose = /^\s*(\/?)>/ // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function start(tagName, attrs) {
  console.log('开始标签：', tagName, '属性是：', attrs)
}
function chars(text) {
  console.log('文本是：', text)
}
function end(tagName) {
  console.log('结束标签：', tagName)
}
function parseHTML(html) {
  // 不停的去解析html字符串
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
      let startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue // 如果开始标签匹配完毕后，继续下一次匹配
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    let text
    if (textEnd >= 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      advance(text.length)
      chars(text)
    }
  }
  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    let start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      }
      advance(start[0].length) // 将标签删除
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        advance(attr[0].length) // 将属性删除
        match.attrs.push({
          // 解析属性
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
      }
      if (end) {
        // 去除结束标签，前进一格并返回ast语法树
        advance(end[0].length)
        return match
      }
    }
  }
}
export function compileToFunctions(template) {
  let root = parseHTML(template)
  return function render() {}
}
