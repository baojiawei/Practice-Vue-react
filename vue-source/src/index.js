import {initMixin} from './init'
function Vue(options) {
  // 内部要进行初始化操作
  this._init(options)
}

initMixin(Vue)
export default Vue
