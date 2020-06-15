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