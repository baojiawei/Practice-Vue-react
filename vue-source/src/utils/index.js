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
    },
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
    value,
  })
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestory',
  'destoryed',
]

let strats = {}

function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach((hook) => {
  strats[hook] = mergeHook
})

function mergeAssets(parentVal, childVal) {
  const res = Object.create(parentVal) // res.__proto__ = parentVal
  if (childVal) {
    for (let key in childVal) {
      res[key] = childVal[key]
    }
  }
  return res
}
strats.components = mergeAssets
/**
 * 合并全局属性
 * @param {*} parent
 * @param {*} child
 */
export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  // 默认的合并策略， 但是有些属性 需要有特殊的合并方式 生命周期的合并
  function mergeField(key) {
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]))
    }
    if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
      options[key] = {
        ...parent[key],
        ...child[key],
      }
    } else if (child[key] == null) {
      options[key] = parent[key]
    } else {
      options[key] = child[key]
    }
  }
  return options
}

/**
 * 是否是原始标签
 * @param {}} tagName
 */
export function isReservedTag(tagName) {
  let str = 'p,div,span,input,button'
  let obj = {}
  str.split(',').forEach(tag => {
    obj[tag] = true
  })
  return obj[tagName]
}
