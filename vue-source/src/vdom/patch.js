export function patch(oldVnode, vnode) {
  if (!oldVnode) {
    // 这个是组件的挂载 vm.$mount()
    return createElm(vnode)
  } else {
    // 判断是更新还是渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
      const oldElm = oldVnode // div id="app"
      const parentElm = oldElm.parentNode // body
      let el = createElm(vnode)
      parentElm.insertBefore(el, oldElm.nextSibling)
      parentElm.removeChild(oldElm)
      return el
    } else {
      // 标签不一致，直接替换即可
      if (oldVnode.tag !== vnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
      }
      // 文本都没有tag，如果内容不一致，直接替换文本
      if (!oldVnode.tag) {
        if (oldVnode.text !== vnode.text) {
          oldVnode.el.textContent = vnode.text
        }
      }
      // 标签一致并且不是文本（比对属性是否一致）
      let el = (vnode.el = oldVnode.el)
      updateProperties(vnode, oldVnode.data)
    }
  }
}

export function createElm(vnode) {
  let { tag, children, key, data, text } = vnode
  // 是标签就创建标签
  if (typeof tag === 'string') {
    // 实例化组件
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el
    }
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
function createComponent(vnode) {
  let i = vnode.data
  if ((i = i.hook) && (i = i.init)) {
    i(vnode)
  }
  if (vnode.componentInstance) {
    return true
  }
}
// 添加相应的属性
function updateProperties(vnode,oldProps={}) {
  let newProps = vnode.data || {}
  let el = vnode.el
  // 如果老的属性中有，新的属性中没有，在真实dom上将这个属性删除掉
  let newStyle = newProps.style || {}
  let oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }
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
