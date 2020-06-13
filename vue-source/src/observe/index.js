import { isObject } from '../utils'
import { arrayMethods } from './array'
class Observe {
  constructor(data) {
    // 相当于在数据上可以获取到__ob__这个属性 指代的是observe实例
    // __ob__ 是一个响应式的标识，对象数组都有
    Object.defineProperty(data, '__ob__', {
      enumerable: false, // 不可枚举
      configurable: false, // 不可配置
      value: this
    })
    if (Array.isArray(data)) {
      // 重写数组方法，函数劫持, 改变数组本身的方法，加入监控
      // 通过原型链 向上查找
      data.__proto__ = arrayMethods
      this.observeArray(data)
    } else {
      this.walk(data) // 对数据一步步处理
    }
  }

  observeArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
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

  if(data.__ob__ instanceof Observe) { // 防止对象被重复观测
    return
  }
  // 对数据进行defineProperty
  return new Observe(data) // 可以看到当前数据是否被观测过
}
