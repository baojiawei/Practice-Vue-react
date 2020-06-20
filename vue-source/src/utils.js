/**
 * 判断数据是不是对象
 */
export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}
/**
 * 取值时代理数据
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newValue) {
      vm[source][key] = newValue
    }
  })
}
/**
 * 定义属性不可被枚举
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
export function def(data, key, value) {
  Object.defineProperty(data, key, {
    enumerable: false, // 不可枚举
    configurable: false, // 不可配置
    value
  })
}