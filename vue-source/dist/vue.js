(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * 判断数据是不是对象
   */
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.walk(data); // 对数据一步步处理
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        // 对象的循环 data:{msg: 'bbb', age: 12}
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]); // 定义响应式的数据变化
        });
      }
    }]);

    return Observe;
  }(); // vue2的性能 递归重写get和set 一次性递归到底 proxy可以解决


  function defineReactive(data, key, value) {
    observe(value); // 如果传入的值还是一个对象的话，就做递归循环监测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        observe(newValue); // 监控当前设置的值，有可能用户给了一个新值还是对象

        value = newValue;
      }
    });
  }

  function observe(data) {
    // 对象就是使用defineProperty 来实现响应式原理
    // 如果这个数据不是对象 或者是null 那就不用监控了
    if (!isObject(data)) {
      return;
    } // 对数据进行defineProperty


    return new Observe(data); // 可以看到当前数据是否被观测过
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) ;

    if (opts.methods) ;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    // 数据响应式原理
    var data = vm.$options.data; // 用户传入的数据
    // vm._data是监测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 观测数据

    observe(data); // 观测这个数据
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // Vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 用户传入的参数

      initState(vm); // 初始化状态
    };
  }

  function Vue(options) {
    // 内部要进行初始化操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
