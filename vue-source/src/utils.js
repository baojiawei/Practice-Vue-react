/**
 * 判断数据是不是对象
 */
export function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}