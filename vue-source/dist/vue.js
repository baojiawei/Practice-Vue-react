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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /**
   * 判断数据是不是对象
   */
  function isObject(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  /**
   * 取值时代理数据
   * @param {*} vm 
   * @param {*} source 
   * @param {*} key 
   */

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
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
    var options = vm.$options;

    if (options.props) ;

    if (options.methods) ;

    if (options.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    // 数据响应式原理
    var data = vm.$options.data; // 用户传入的数据
    // vm._data是监测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 为了让用户更好的使用，我希望可以直接vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 观测数据


    observer(data); // 观测这个数据
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  var root = null; // ast语法树的树根

  var currentParent; // 标识当前父亲是谁

  var stack = [];
  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;

  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: ELEMENT_TYPE,
      children: [],
      attrs: attrs,
      parent: null
    };
  }

  function start(tagName, attrs) {
    // 遇到开始标签 就创建一个ast元素
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element; // 把当前元素标记成父ast树

    stack.push(element); // 将开始标签存放到栈中
  }

  function chars(text) {
    text = text.replace(/\s/g, '');

    if (text) {
      currentParent.children.push({
        text: text,
        type: TEXT_TYPE
      });
    }
  }

  function end(tagName) {
    var element = stack.pop();
    currentParent = stack[stack.length - 1];

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  }

  function parseHTML(html) {
    // 不停的去解析html字符串
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue; // 如果开始标签匹配完毕后，继续下一次匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将标签删除

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length); // 将属性删除

          match.attrs.push({
            // 解析属性
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去除结束标签，前进一格并返回ast语法树
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 处理属性 拼接成属性的字符串

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function gen(node) {
    if (node.type === 1) {
      return generate(node);
    } else {
      var text = node.text;
      var tokens = [];
      var match, index; // 只要是全局匹配 就需要将lastIndex的偏移量置为0

      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      } // a {{name}} b{{age}} c
      // _v("a"+_s(name)+"b"+_s(age)+"c")
      // 正则 lastIndex问题


      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function generate(el) {
    var children = genChildren(el); // 获取孩子节点

    var code = "_c(\"".concat(el.tag, "\", ").concat(el.attrs.length ? genProps(el.attrs) : 'undefined', "\n  ").concat(children ? ",".concat(children) : '', ")\n  ");
    return code;
  }

  function compileToFunctions(template) {
    // 解析html字符串 将html字符串 => ast语法树
    var root = parseHTML(template); // 需要将ast语法树生成最终的render函数 就是字符串拼接(模板引擎 )

    var code = generate(root); // 所有的模板引擎实现，都需要new Function + with

    var renderFn = new Function("with(this){ return ".concat(code, " }")); // 核心思路就是将模板转化成下面这段字符串
    // <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树再次转化成js的语法
    // _c('div', {id: 'app'}, _c('p', undefined, _v('hello', _s(name))), _v('hello'))

    return renderFn;
  }

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

      var options = vm.$options;

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          // 应该使用外部的模板
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        options.render = render;
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
