import { mergeOptions } from '../utils'
export function initGlobalAPI(Vue) {
  Vue.options = {}

  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
  }

  Vue.mixin({
    a: 1,
    beforeCreate() {
      console.log('mixin 1')
    },
  })
  Vue.mixin({
    b: 2,
    beforeCreate() {
      console.log('mixin 2')
    },
  })

  console.log(Vue.options)
}
