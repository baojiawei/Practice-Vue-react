// 获取数组原型上的方法
let oldArrayMethods = Array.prototype
// 创建一个全新的对象，可以找到数组原型上的方法, 而且修改对象时不会影响数组原型方法
export let arrayMethods = Object.create(oldArrayMethods)

// 这7个方法全部都可以改变原数组
let methods = ['push', 'pop', 'unshift', 'sort', 'reverse', 'splice']

methods.forEach((method) => {
  // 函数劫持 AOP
  arrayMethods[method] = function (...args) {
    const ob = this.__ob__
    // 当用户调用数组方法时，会先执行我自己改造的逻辑，再执行数组默认的逻辑
    let result = oldArrayMethods[method].apply(this, args)
    let inserted
    // push unshift splice 都可以新增属性 (新增的属性可能是一个对象类型)
    // 内部还对数组中引用类型也做了一次劫持 [].push({name: 'bjw'})
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice': // 也是新增属性，可以修改，可以删除 [].splice(arr, 1, 'div')
        inserted = args.slice(2)
      default:
        break
    }
    inserted && ob.observerArray(inserted)
    ob.dep.notify() // 调用数组api会触发通知
    return result
  }
})
