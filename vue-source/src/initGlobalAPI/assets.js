import { ASSETS_TYPE } from './const'
export default function initAssetRegisters(Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      if(type === 'component') {
        // 进行全局注册
        // 使用extend方法 将对象变成构造函数
        // 子组件可能也有这个VueComponent.component方法
        definition = this.options._base.extend(definition)
        Vue.extend
      } else if(type === 'filter') {

      } else if(type === 'directive') {

      }
      this.options[type+'s'][id] = definition
    }
  })
}
