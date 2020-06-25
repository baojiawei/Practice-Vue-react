import { mergeOptions } from '../utils/index'
import initMixin from './mixin'
import initAssetRegisters from './assets'
import initExtend from './extend'
import { ASSETS_TYPE } from './const'

export function initGlobalAPI(Vue) {
  Vue.options = {}
  initMixin(Vue)

  ASSETS_TYPE.forEach((type) => {
    Vue.options[type + 's'] = {}
  })
  // _base是Vue的构造函数
  Vue.options._base = Vue

  initExtend(Vue)
  initAssetRegisters(Vue)
}
