import { nextTick } from '../utils/next-tick'
let queue = []
let has = {}
function flushSchedularQueue() {
  queue.forEach((watcher) => watcher.run())
  queue = []
  has = {}
}
export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    queue.push(watcher)
    has[id] = true
    // 宏任务和微任务（vue里面使用Vue.nextTick）
    // Vue.nextTick = promise / mutationObserver / setImmediate / setTimeout
    nextTick(flushSchedularQueue)
  }
}
