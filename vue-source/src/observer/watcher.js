import { pushTarget, popTarget } from './dep'
import { queueWatcher } from './schedular'
let id = 0
class Watcher {
  constructor(vm, exprOrFn, callback, options) {
    this.vm = vm
    this.callback = callback
    this.options = options
    this.id = id++
    // 将内部传过来的回调函数，放到getter属性上
    this.getter = exprOrFn
    this.depsId = new Set()
    this.deps = []
    this.get() // 调用get方法， 会让渲染watcher执行
  }
  addDep(dep) {
    // watcher里不能存放重复的dep， dep里不能放重复的dep
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }
  get() {
    pushTarget(this) // 把watcher存起来
    this.getter() // 渲染watcher的执行
    popTarget() // 移除watcher
  }
  update() {
    // 异步更新
    queueWatcher(this)
  }
  run() {
    this.get()
  }
}
export default Watcher
