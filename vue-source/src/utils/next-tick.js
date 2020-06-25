let callbacks =[]
let waiting = false
function flushCallback() {
  callbacks.forEach(callback => callback())
  waiting = false
}
export function nextTick(cb) {
  // 多次调用nextTick 先存入数组中，之后再调用一次执行就可以了
  callbacks.push(cb)
  if(!waiting) {
    setTimeout(flushCallback, 0);
    waiting = true
  }
}