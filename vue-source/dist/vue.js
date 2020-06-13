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

  // 获取数组原型上的方法
  var oldArrayMethods = Array.prototype; // 创建一个全新的对象，可以找到数组原型上的方法, 而且修改对象时不会影响数组原型方法

  var arrayMethods = Object.create(oldArrayMethods); // 这7个方法全部都可以改变原数组

  var methods = ['push', 'pop', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    // 函数劫持 AOP
    arrayMethods[method] = function () {
      var ob = this.__ob__; // 当用户调用数组方法时，会先执行我自己改造的逻辑，再执行数组默认的逻辑

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted; // push unshift splice 都可以新增属性 (新增的属性可能是一个对象类型)
      // 内部还对数组中引用类型也做了一次劫持 [].push({name: 'bjw'})

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          // 也是新增属性，可以修改，可以删除 [].splice(arr, 1, 'div')
          inserted = args.slice(2);
      }

      inserted && ob.observerArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 相当于在数据上可以获取到__ob__这个属性 指代的是observer实例
      // __ob__ 是一个响应式的标识，对象数组都有
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        // 不可枚举
        configurable: false,
        // 不可配置
        value: this
      });

      if (Array.isArray(data)) {
        // 重写数组方法，函数劫持, 改变数组本身的方法，加入监控
        // 通过原型链 向上查找
        data.__proto__ = arrayMethods;
        this.observerArray(data);
      } else {
        this.walk(data); // 对数据一步步处理
      }
    }

    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          observer(data[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(data) {
        // 对象的循环 data:{msg: 'bbb', age: 12}
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]); // 定义响应式的数据变化
        });
      }
    }]);

    return Observer;
  }(); // vue2的性能 递归重写get和set 一次性递归到底 proxy可以解决


  function defineReactive(data, key, value) {
    observer(value); // 如果传入的值还是一个对象的话，就做递归循环监测

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        observer(newValue); // 监控当前设置的值，有可能用户给了一个新值还是对象

        value = newValue;
      }
    });
  }

  function observer(data) {
    // 对象就是使用defineProperty 来实现响应式原理
    // 如果这个数据不是对象 或者是null 那就不用监控了
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__ instanceof Observer) {
      // 防止对象被重复观测
      return;
    } // 对数据进行defineProperty


    return new Observer(data); // 可以看到当前数据是否被观测过
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

    observer(data); // 观测这个数据
  }

  // 实现模板的编译
  // 模板编译原理
  // 1.先把我们的代码转化成ast语法树 (1)parser解析 (正则)
  // 2.标记静态树 (2) 树得遍历标记markup
  // 3.通过ast产生的语法树 生成代码 => render函数 codegen
  function compileToFunctions(template) {}

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // Vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 用户传入的参数

      initState(vm); // 初始化状态
      // 需要通过模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // 可能是字符串 也可以传入一个dom对象
      var vm = this;
      el = document.querySelector(el); // 获取el属性
      // 如果同时传入 template 和 render 默认会采用render抛弃template，如果都没传
      // 就使用id="app"中的模板

      var opts = vm.$options;

      if (!opts.render) {
        var template = opts.template;

        if (!template && el) {
          // 应该使用外部的模板
          template = el.outerHTML;
        }

        var render = compileToFunctions();
        opts.render = render;
      } // 走到这里说明不需要编译了，因为用户传入的就是一个render函数

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
