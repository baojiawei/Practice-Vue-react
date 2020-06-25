import { isObject, def } from '../utils/index'
import { arrayMethods } from './array'
import Dep from './dep'
class Observer {
  constructor(data) {
    this.dep = new Dep() // 给数组用的dep
    // 相当于在数据上可以获取到__ob__这个属性 指代的是observer实例
    // __ob__ 是一个响应式的标识，对象数组都有
    def(data, '__ob__', this)
    if (Array.isArray(data)) {
      // 重写数组方法，函数劫持, 改变数组本身的方法，加入监控
      // 通过原型链 向上查找
      data.__proto__ = arrayMethods
      this.observerArray(data)
    } else {
      this.walk(data) // 对数据一步步处理
    }
  }

  observerArray(data) {
    for (let i = 0; i < data.length; i++) {
      observer(data[i])
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
  let dep = new Dep()
  let childOb = observer(value) // 如果传入的值还是一个对象的话，就做递归循环监测
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        // 如果当前有watcher
        dep.depend() // 意味着我要将watcher存起来
        if (childOb) {
          childOb.dep.depend() // 收集了数组的相关依赖
          // 如果数组里还有数组
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) {
      if (newValue === value) {
        return
      }
      observer(newValue) // 监控当前设置的值，有可能用户给了一个新值还是对象
      value = newValue
      dep.notify() // 通知依赖的watcher来进行下一个更新操作
    },
  })
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i] // 将数组中的每一个都取出来，数据变化后，也会去更新视图
    // 数组中的依赖收集
    current.__ob__ && current.__ob__.dep.depend()
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}

export function observer(data) {
  // 对象就是使用defineProperty 来实现响应式原理

  // 如果这个数据不是对象 或者是null 那就不用监控了
  if (!isObject(data)) {
    return
  }

  if (data.__ob__ instanceof Observer) {
    // 防止对象被重复观测
    return
  }
  // 对数据进行defineProperty
  return new Observer(data) // 可以看到当前数据是否被观测过
}
