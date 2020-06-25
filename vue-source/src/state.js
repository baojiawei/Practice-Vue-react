import { observer } from './observer/index'
import { proxy } from './utils/index'
export function initState(vm) {
  const options = vm.$options
  if (options.props) {
    initProps(vm)
  }
  if (options.methods) {
    initMethods(vm)
  }
  if (options.data) {
    initData(vm)
  }
}

function initProps(vm) {}

function initMethods(vm) {}

function initData(vm) {
  // 数据响应式原理
  let data = vm.$options.data // 用户传入的数据
  // vm._data是监测后的数据
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 为了让用户更好的使用，我希望可以直接vm.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  // 观测数据
  observer(data) // 观测这个数据
}
