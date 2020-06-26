import { initMixin } from './init'
import { renderMixin } from './render'
import { lifecycleMixin } from './lifecycle'
import { initGlobalAPI } from './initGlobalAPI/index'

function Vue(options) {
  // 内部要进行初始化操作
  this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)

// 初始化全局的API
initGlobalAPI(Vue)

import { compileToFunctions } from './compiler/index'
import { createElm, patch } from './vdom/patch'
let vm1 = new Vue({
  data() {
    return {
      name: 'hello',
    }
  },
})
let render1 = compileToFunctions('<div id="app" a="1" style="font-size:14px">{{name}}</div>')
let vnode = render1.call(vm1)
let el = createElm(vnode)
document.body.appendChild(el)

let vm2 = new Vue({
  data() {
    return {
      name: 'world',
      age: 11,
    }
  },
})
let render2 = compileToFunctions('<div id="aaa" b="2" style="color: green">{{age}}<span>{{name}}</span></div>')
let newVnode = render2.call(vm2)

setTimeout(() => {
  patch(vnode, newVnode)
}, 3000)

export default Vue
