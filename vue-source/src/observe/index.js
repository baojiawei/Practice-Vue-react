import { isObject } from '../utils'
class Observe {
  constructor(data) {
    this.walk(data) // 对数据一步步处理
  }
  walk(data) {
    // 对象的循环 data:{msg: 'bbb', age: 12}
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]) // 定义响应式的数据变化
    })
  }
}
// vue2的性能 递归重写get和set 一次性递归到底 proxy可以解决
function defineReactive(data, key, value) {
  observe(value) // 如果传入的值还是一个对象的话，就做递归循环监测
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) {
        return
      }
      observe(newValue) // 监控当前设置的值，有可能用户给了一个新值还是对象
      value = newValue
    },
  })
}

export function observe(data) {
  // 对象就是使用defineProperty 来实现响应式原理

  // 如果这个数据不是对象 或者是null 那就不用监控了
  if (!isObject(data)) {
    return
  }
  // 对数据进行defineProperty
  return new Observe(data) // 可以看到当前数据是否被观测过
}
