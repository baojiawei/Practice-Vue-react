export function patch(oldVnode, vnode) {
  // 判断是更新还是渲染
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const oldElm = oldVnode // div id="app"
    const parentElm = oldElm.parentNode // body
    let el = createElm(vnode)
    parentElm.insertBefore(el, oldElm.nextSibling)
    parentElm.removeChild(oldElm)
    return el
  }
}

function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  // 是标签就创建标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)
    children.forEach((child) => {
      return vnode.el.appendChild(createElm(child))
    })
  } else {
    // 虚拟dom上映射着真实dom，方便后续更新操作
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
  // 如果不是标签就是文本
}
// 添加相应的属性
function updateProperties(vnode) {
  let newProps = vnode.data || {}
  let el = vnode.el
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}
