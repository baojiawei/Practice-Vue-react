import { isObject, isReservedTag } from '../utils/index'

export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key
  if (key) {
    delete data.key
  }
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, children, undefined)
  } else {
    let Ctor = vm.$options.components[tag]
    return createComponent(vm, tag, data, key, children, Ctor)
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor)
  }
  data.hook = {
    init(vnode) {
      let child = vnode.componentInstance =new Ctor({_isComponent: true})
      // 组件的挂载 vm.$el
      child.$mount()
    }
  }
  return vnode(
    `vue-component-${Ctor.cid}-${tag}`,
    data,
    key,
    undefined,
    undefined,
    {
      Ctor,
      children,
    }
  )
}

export function createTextNode(vm, text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

// 虚拟节点 就是通过_c _v实现用对象描述dom的操作（对象）
// 1）将template转换为ast语法树 => 生成render方法 => 生成虚拟dom => 真实的dom
// 更新流程: 重新生成虚拟dom => 更新真实dom
function vnode(tag, data, key, children, text, componentOptions) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  }
}
