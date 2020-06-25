import { mergeOptions } from '../utils/index'
export default function initMixin(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }
}