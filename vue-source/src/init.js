import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // Vue的内部 $options 就是用户传递的所有参数
    const vm = this
    // 将用户传递的和全局的进行一个合并
    vm.$options = mergeOptions(vm.constructor.options, options) // 用户传入的参数
    callHook(vm, 'beforeCreate')
    initState(vm) // 初始化状态
    callHook(vm, 'created')
    // 需要通过模板渲染
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    // 可能是字符串 也可以传入一个dom对象
    const vm = this
    el = document.querySelector(el) // 获取el属性
    // 如果同时传入 template 和 render 默认会采用render抛弃template，如果都没传
    // 就使用id="app"中的模板
    const options = vm.$options
    if (!options.render) {
      let template = options.template
      if (!template && el) {
        // 应该使用外部的模板
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }

    // 走到这里说明不需要编译了，因为用户传入的就是一个render函数
    // 渲染当前组件 挂载这个组件
    mountComponent(vm, el)
  }
}
