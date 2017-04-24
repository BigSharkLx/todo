/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	;(function () {
	  'use strict';
	  // 引入本地存储store.js
	
	  var store = __webpack_require__(1);
	  var $form_add_task = $('.add-task'),
	      deleteElement,
	      detailElement,
	      task_list = [],
	      $task_detail = $('.task-detail'),
	      task_detail_mask = $('.task-detail-mask'),
	      detailForm,
	      inputContent,
	      content,
	      task_item,
	      task_completed,
	      inputTimePicker;
	
	  init();
	  $form_add_task.on('submit', function (e) {
	    //禁用默认行为
	    e.preventDefault();
	    // 建立对象
	    var new_task = {};
	    // 获取输入框的值
	    var input = $(this).find('input[name=content]');
	    // 设置task对象的content属性为输入框的值
	    new_task.content = input.val();
	    // 如果输入为空则返回
	    if (!new_task.content) return;
	    // 增加条数
	    add_task_list(new_task);
	    // 完成后清空输入框
	    input.val(null);
	  });
	
	  function init() {
	    // 初始化得到本地存储的值
	    task_list = store.get('task_list') || [];
	    // 渲染
	    render_task_list();
	  }
	
	  // 增加条数的数组传入的参数为task对象
	  function add_task_list(new_task_item) {
	    // 将获得的包含输出值的对象推进数组
	    task_list.push(new_task_item);
	    // 更新
	    refresh_task_list();
	  }
	  // 删除条数的数组 传入的参数为当前条数的索引
	  function delete_task_list(index) {
	    // 如果传入的数字不存在则返回
	    if (index === undefined || !task_list[index]) return;
	    // 删除当前对应的索引的数组键值对
	    delete task_list[index];
	    // 更新本地的值
	    refresh_task_list();
	  }
	  // 渲染函数
	  function render_task_list() {
	    // 获取条数的容器元素
	    var $task_list = $('.task-list');
	    // 初始化将全部的输出清除
	    $task_list.html('');
	    // 遍历数组将每一条对应的html结构插入到父元素容器内
	    // 新建数组保存已经完成的事件
	    var complete_item = [];
	    for (var i = 0; i < task_list.length; i++) {
	      var item = task_list[i];
	      // 因为数组序号不连续  有的被删掉  所以遍历全部会有的空缺
	      if (!item) continue;
	      // 如果点击那么complete为true 将就数组的对应元素复制给新数组的元素
	      if (item && item.complete) {
	        complete_item[i] = item;
	      }
	      // 如果没点击就正常渲染在父元素容器最前面
	      else {
	          var module = task_list_item(task_list[i], i);
	          $task_list.prepend(module);
	        }
	    }
	    // 因为点击的元素没渲染 所以不见了 在这里重新遍历渲染在父元素容器最后面
	    for (var j = 0; j < complete_item.length; j++) {
	      if (!complete_item[j]) continue;
	      module = task_list_item(complete_item[j], j);
	      if (module) {
	        // 并且为点击的事件添加新的样式
	        module.addClass("hasCompleted");
	      }
	      // 每一条打钩的往后插入到父元素容器
	      $task_list.append(module);
	    }
	
	    // 要监听每一条的事件函数必须在渲染内操作
	    deleteElement = $('.delete');
	    detailElement = $('.detail');
	    task_item = $('.task-item');
	    task_completed = $('.task_completed');
	    // 点击删除区域调用删除函数
	    listen_delete();
	    // 点击或双击显示详情
	    listen_detail_show();
	    // 隐藏
	    listen_detail_hide();
	    // 点击切换content的值
	    listen_task_completed();
	    // 时间提醒功能函数
	    task_remind_check();
	    // 点击暂停闹铃并隐藏提醒
	    listen_confirm_know();
	  }
	  // 删除条数的函数
	  function listen_delete() {
	    deleteElement.on('click', function () {
	      // 当前删除元素的父元素的自定义属性值
	      var deletIndex = $(this).parent().data('index');
	      // 确认删除对话框
	      var tmp = confirm('确定删除？');
	      tmp ? delete_task_list(deletIndex) : null;
	    });
	  }
	  // 显示详情并渲染详情的函数
	  function listen_detail_show() {
	    detailElement.on('click', function () {
	      var detailIndex = $(this).parent().data('index');
	      $task_detail.show();
	      task_detail_mask.show();
	      render_task_detail(detailIndex);
	    });
	    task_item.on('dblclick', function () {
	      var detailIndex = $(this).data('index');
	      $task_detail.show();
	      task_detail_mask.show();
	      render_task_detail(detailIndex);
	    });
	  }
	  // 隐藏详情的函数
	  function listen_detail_hide() {
	    task_detail_mask.on('click', function () {
	      $task_detail.hide();
	      task_detail_mask.hide();
	    });
	  }
	  // 点击切换complete函数
	  function listen_task_completed() {
	    task_completed.on('click', function () {
	      var index = $(this).parent().parent().data('index');
	      var item = store.get('task_list')[index];
	      if (item.complete) {
	        // 新建complete对象并更新
	        updata_task_detail(index, { complete: false });
	      } else {
	        updata_task_detail(index, { complete: true });
	      }
	    });
	  }
	  // 点击“知道了”
	  function listen_confirm_know() {
	    $('.know').on('click', function () {
	      $('.msg').hide();
	      $('.music').get(0).pause();
	    });
	  }
	  // 时间提醒函数
	  function task_remind_check() {
	    // 循环时间
	    var itl = setInterval(function () {
	      // 遍历每一条
	      for (var i = 0; i < task_list.length; i++) {
	        var item = store.get('task_list')[i];
	        // 如果已经提醒过了或者被删除的条数就不提醒
	        if (!item || !item.remind || item.informed || item.complete) continue;
	        // 获取当地实际时间
	        var nowTime = new Date().getTime();
	        // 获取提醒的时间
	        var remindTime = new Date(item.remind).getTime();
	        // 如果那一条的时间到了
	        if (nowTime - remindTime >= 1) {
	          // 更新新增对象informed为true代表提醒过了
	          updata_task_detail(i, { informed: true });
	          // 时间就到了就显示提醒消息
	          show_message(item.content);
	        }
	      }
	    }, 300);
	  }
	
	  function show_message(content) {
	    $('.msg_content').html(content);
	    $('.msg').show();
	    // play是dom元素的方法 需要将jquery对象转化为dom对象
	    $('.music').get(0).play();
	  }
	
	  // 渲染详情函数
	  function render_task_detail(index) {
	    if (index === undefined || !task_list[index]) return;
	
	    var task = task_list[index];
	    // 详情模板
	    var tpl = '  <form class="detailForm">\n    <div class="content">\n    ' + task.content + '\n    </div>\n    <div><input class="input_content" type="text" name="content" value="' + task.content + '"></div>\n    <div class="desc">\n    <textarea name="desc">' + (task.desc || '') + '\n    </textarea>\n    </div>\n    <div class="remind">\n    <input class="time_picker"  name="remind" type="text" value="' + (task.remind || '') + '"></input>\n    </div>\n    <button class="input_submit_button" type="submit">\u66F4\u65B0</button>\n    </form>';
	
	    $task_detail.html('');
	    $task_detail.append($(tpl));
	
	    detailForm = $('.detailForm');
	    detailForm.on('submit', function (e) {
	      e.preventDefault();
	      // 新建data对象 表单提交之后task_list的值就由data决定 从而实现修改 描述 时间功能
	      var data = {};
	      // data对象的三个属性
	      data.content = $(this).find('[name=content]').val();
	      data.desc = $(this).find('[name=desc]').val();
	      data.remind = $(this).find('[name=remind]').val();
	      // 更新
	      updata_task_detail(index, data);
	      // 表单提交完后隐藏
	      $task_detail.hide();
	      task_detail_mask.hide();
	    });
	
	    // 详情上方双击后显示可输入区域 自身隐藏
	    inputContent = detailForm.find('[name=content]');
	    content = detailForm.find('.content');
	    content.on('dblclick', function () {
	      inputContent.show();
	      content.hide();
	    });
	    // 利用时间选择插件
	    inputTimePicker = $('.time_picker').datetimepicker();
	  }
	
	  // 为每一条更新函数 利用extend方法保留了原来对象又可以新增对象 第一个对象是目标对象 后面的两个是源对象
	
	  function updata_task_detail(index, data) {
	    if (index === undefined || !task_list[index]) return;
	    task_list[index] = $.extend({}, task_list[index], data);
	    refresh_task_list();
	  }
	
	  // 更新本地存储函数
	  function refresh_task_list() {
	    store.set('task_list', task_list);
	    render_task_list();
	  }
	  // 每一条数所对应的html结构  参数是传入的数组的值和对应的序列号
	  function task_list_item(data, index) {
	    if (!data || !index) return;
	    var list_item_tpl = '  <div class="task-item" data-index=' + index + '>\n    <span><input ' + (data.complete ? 'checked' : '') + ' class="task_completed" type="checkbox"></span>\n    <span class="task-content">' + data.content + '</span>\n    <span class="action delete">\u5220\u9664</span>\n    <span class="action detail">\u8BE6\u60C5</span>\n    </div>';
	    return $(list_item_tpl);
	  }
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var engine = __webpack_require__(2)
	
	var storages = __webpack_require__(4)
	var plugins = [__webpack_require__(11)]
	
	module.exports = engine.createStore(storages, plugins)


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(3)
	var slice = util.slice
	var pluck = util.pluck
	var each = util.each
	var create = util.create
	var isList = util.isList
	var isFunction = util.isFunction
	var isObject = util.isObject
	
	module.exports = {
		createStore: createStore,
	}
	
	var storeAPI = {
		version: '2.0.4',
		enabled: false,
		storage: null,
	
		// addStorage adds another storage to this store. The store
		// will use the first storage it receives that is enabled, so
		// call addStorage in the order of preferred storage.
		addStorage: function(storage) {
			if (this.enabled) { return }
			if (this._testStorage(storage)) {
				this._storage.resolved = storage
				this.enabled = true
				this.storage = storage.name
			}
		},
	
		// addPlugin will add a plugin to this store.
		addPlugin: function(plugin) {
			var self = this
	
			// If the plugin is an array, then add all plugins in the array.
			// This allows for a plugin to depend on other plugins.
			if (isList(plugin)) {
				each(plugin, function(plugin) {
					self.addPlugin(plugin)
				})
				return
			}
	
			// Keep track of all plugins we've seen so far, so that we
			// don't add any of them twice.
			var seenPlugin = pluck(this._seenPlugins, function(seenPlugin) { return (plugin === seenPlugin) })
			if (seenPlugin) {
				return
			}
			this._seenPlugins.push(plugin)
	
			// Check that the plugin is properly formed
			if (!isFunction(plugin)) {
				throw new Error('Plugins must be function values that return objects')
			}
	
			var pluginProperties = plugin.call(this)
			if (!isObject(pluginProperties)) {
				throw new Error('Plugins must return an object of function properties')
			}
	
			// Add the plugin function properties to this store instance.
			each(pluginProperties, function(pluginFnProp, propName) {
				if (!isFunction(pluginFnProp)) {
					throw new Error('Bad plugin property: '+propName+' from plugin '+plugin.name+'. Plugins should only return functions.')
				}
				self._assignPluginFnProp(pluginFnProp, propName)
			})
		},
	
		// get returns the value of the given key. If that value
		// is undefined, it returns optionalDefaultValue instead.
		get: function(key, optionalDefaultValue) {
			var data = this._storage().read(this._namespacePrefix + key)
			return this._deserialize(data, optionalDefaultValue)
		},
	
		// set will store the given value at key and returns value.
		// Calling set with value === undefined is equivalent to calling remove.
		set: function(key, value) {
			if (value === undefined) {
				return this.remove(key)
			}
			this._storage().write(this._namespacePrefix + key, this._serialize(value))
			return value
		},
	
		// remove deletes the key and value stored at the given key.
		remove: function(key) {
			this._storage().remove(this._namespacePrefix + key)
		},
	
		// each will call the given callback once for each key-value pair
		// in this store.
		each: function(callback) {
			var self = this
			this._storage().each(function(val, namespacedKey) {
				callback(self._deserialize(val), namespacedKey.replace(self._namespaceRegexp, ''))
			})
		},
	
		// clearAll will remove all the stored key-value pairs in this store.
		clearAll: function() {
			this._storage().clearAll()
		},
	
		// additional functionality that can't live in plugins
		// ---------------------------------------------------
	
		// hasNamespace returns true if this store instance has the given namespace.
		hasNamespace: function(namespace) {
			return (this._namespacePrefix == '__storejs_'+namespace+'_')
		},
	
		// namespace clones the current store and assigns it the given namespace
		namespace: function(namespace) {
			if (!this._legalNamespace.test(namespace)) {
				throw new Error('store.js namespaces can only have alhpanumerics + underscores and dashes')
			}
			// create a prefix that is very unlikely to collide with un-namespaced keys
			var namespacePrefix = '__storejs_'+namespace+'_'
			return create(this, {
				_namespacePrefix: namespacePrefix,
				_namespaceRegexp: namespacePrefix ? new RegExp('^'+namespacePrefix) : null
			})
		},
	
		// createStore creates a store.js instance with the first
		// functioning storage in the list of storage candidates,
		// and applies the the given mixins to the instance.
		createStore: function(storages, plugins) {
			return createStore(storages, plugins)
		},
	}
	
	function createStore(storages, plugins) {
		var _privateStoreProps = {
			_seenPlugins: [],
			_namespacePrefix: '',
			_namespaceRegexp: null,
			_legalNamespace: /^[a-zA-Z0-9_\-]+$/, // alpha-numeric + underscore and dash
	
			_storage: function() {
				if (!this.enabled) {
					throw new Error("store.js: No supported storage has been added! "+
						"Add one (e.g store.addStorage(require('store/storages/cookieStorage')) "+
						"or use a build with more built-in storages (e.g "+
						"https://github.com/marcuswestin/store.js/tree/master/dist/store.legacy.min.js)")
				}
				return this._storage.resolved
			},
	
			_testStorage: function(storage) {
				try {
					var testStr = '__storejs__test__'
					storage.write(testStr, testStr)
					var ok = (storage.read(testStr) === testStr)
					storage.remove(testStr)
					return ok
				} catch(e) {
					return false
				}
			},
	
			_assignPluginFnProp: function(pluginFnProp, propName) {
				var oldFn = this[propName]
				this[propName] = function pluginFn() {
					var args = slice(arguments, 0)
					var self = this
	
					// super_fn calls the old function which was overwritten by
					// this mixin.
					function super_fn() {
						if (!oldFn) { return }
						each(arguments, function(arg, i) {
							args[i] = arg
						})
						return oldFn.apply(self, args)
					}
	
					// Give mixing function access to super_fn by prefixing all mixin function
					// arguments with super_fn.
					var newFnArgs = [super_fn].concat(args)
	
					return pluginFnProp.apply(self, newFnArgs)
				}
			},
	
			_serialize: function(obj) {
				return JSON.stringify(obj)
			},
	
			_deserialize: function(strVal, defaultVal) {
				if (!strVal) { return defaultVal }
				// It is possible that a raw string value has been previously stored
				// in a storage without using store.js, meaning it will be a raw
				// string value instead of a JSON serialized string. By defaulting
				// to the raw string value in case of a JSON parse error, we allow
				// for past stored values to be forwards-compatible with store.js
				var val = ''
				try { val = JSON.parse(strVal) }
				catch(e) { val = strVal }
	
				return (val !== undefined ? val : defaultVal)
			},
		}
	
		var store = create(_privateStoreProps, storeAPI)
		each(storages, function(storage) {
			store.addStorage(storage)
		})
		each(plugins, function(plugin) {
			store.addPlugin(plugin)
		})
		return store
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {var assign = make_assign()
	var create = make_create()
	var trim = make_trim()
	var Global = (typeof window !== 'undefined' ? window : global)
	
	module.exports = {
		assign: assign,
		create: create,
		trim: trim,
		bind: bind,
		slice: slice,
		each: each,
		map: map,
		pluck: pluck,
		isList: isList,
		isFunction: isFunction,
		isObject: isObject,
		Global: Global,
	}
	
	function make_assign() {
		if (Object.assign) {
			return Object.assign
		} else {
			return function shimAssign(obj, props1, props2, etc) {
				for (var i = 1; i < arguments.length; i++) {
					each(Object(arguments[i]), function(val, key) {
						obj[key] = val
					})
				}			
				return obj
			}
		}
	}
	
	function make_create() {
		if (Object.create) {
			return function create(obj, assignProps1, assignProps2, etc) {
				var assignArgsList = slice(arguments, 1)
				return assign.apply(this, [Object.create(obj)].concat(assignArgsList))
			}
		} else {
			function F() {} // eslint-disable-line no-inner-declarations
			return function create(obj, assignProps1, assignProps2, etc) {
				var assignArgsList = slice(arguments, 1)
				F.prototype = obj
				return assign.apply(this, [new F()].concat(assignArgsList))
			}
		}
	}
	
	function make_trim() {
		if (String.prototype.trim) {
			return function trim(str) {
				return String.prototype.trim.call(str)
			}
		} else {
			return function trim(str) {
				return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
			}
		}
	}
	
	function bind(obj, fn) {
		return function() {
			return fn.apply(obj, Array.prototype.slice.call(arguments, 0))
		}
	}
	
	function slice(arr, index) {
		return Array.prototype.slice.call(arr, index || 0)
	}
	
	function each(obj, fn) {
		pluck(obj, function(key, val) {
			fn(key, val)
			return false
		})
	}
	
	function map(obj, fn) {
		var res = (isList(obj) ? [] : {})
		pluck(obj, function(v, k) {
			res[k] = fn(v, k)
			return false
		})
		return res
	}
	
	function pluck(obj, fn) {
		if (isList(obj)) {
			for (var i=0; i<obj.length; i++) {
				if (fn(obj[i], i)) {
					return obj[i]
				}
			}
		} else {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (fn(obj[key], key)) {
						return obj[key]
					}
				}
			}
		}
	}
	
	function isList(val) {
		return (val != null && typeof val != 'function' && typeof val.length == 'number')
	}
	
	function isFunction(val) {
		return val && {}.toString.call(val) === '[object Function]'
	}
	
	function isObject(val) {
		return val && {}.toString.call(val) === '[object Object]'
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		// Listed in order of usage preference
		'localStorage': __webpack_require__(5),
		'oldFF-globalStorage': __webpack_require__(6),
		'oldIE-userDataStorage': __webpack_require__(7),
		'cookieStorage': __webpack_require__(8),
		'sessionStorage': __webpack_require__(9),
		'memoryStorage': __webpack_require__(10),
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(3)
	var Global = util.Global
	
	module.exports = {
		name: 'localStorage',
		read: read,
		write: write,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	function localStorage() {
		return Global.localStorage
	}
	
	function read(key) {
		return localStorage().getItem(key)
	}
	
	function write(key, data) {
		return localStorage().setItem(key, data)
	}
	
	function each(fn) {
		for (var i = localStorage().length - 1; i >= 0; i--) {
			var key = localStorage().key(i)
			fn(read(key), key)
		}
	}
	
	function remove(key) {
		return localStorage().removeItem(key)
	}
	
	function clearAll() {
		return localStorage().clear()
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// oldFF-globalStorage provides storage for Firefox
	// versions 6 and 7, where no localStorage, etc
	// is available.
	
	var util = __webpack_require__(3)
	var Global = util.Global
	
	module.exports = {
		name: 'oldFF-globalStorage',
		read: read,
		write: write,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	var globalStorage = Global.globalStorage
	
	function read(key) {
		return globalStorage[key]
	}
	
	function write(key, data) {
		globalStorage[key] = data
	}
	
	function each(fn) {
		for (var i = globalStorage.length - 1; i >= 0; i--) {
			var key = globalStorage.key(i)
			fn(globalStorage[key], key)
		}
	}
	
	function remove(key) {
		return globalStorage.removeItem(key)
	}
	
	function clearAll() {
		each(function(key, _) {
			delete globalStorage[key]
		})
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// oldIE-userDataStorage provides storage for Internet Explorer
	// versions 6 and 7, where no localStorage, sessionStorage, etc
	// is available.
	
	var util = __webpack_require__(3)
	var Global = util.Global
	
	module.exports = {
		name: 'oldIE-userDataStorage',
		write: write,
		read: read,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	var storageName = 'storejs'
	var doc = Global.document
	var _withStorageEl = _makeIEStorageElFunction()
	var disable = (Global.navigator ? Global.navigator.userAgent : '').match(/ (MSIE 8|MSIE 9|MSIE 10)\./) // MSIE 9.x, MSIE 10.x
	
	function write(unfixedKey, data) {
		if (disable) { return }
		var fixedKey = fixKey(unfixedKey)
		_withStorageEl(function(storageEl) {
			storageEl.setAttribute(fixedKey, data)
			storageEl.save(storageName)
		})
	}
	
	function read(unfixedKey) {
		if (disable) { return }
		var fixedKey = fixKey(unfixedKey)
		var res = null
		_withStorageEl(function(storageEl) {
			res = storageEl.getAttribute(fixedKey)
		})
		return res
	}
	
	function each(callback) {
		_withStorageEl(function(storageEl) {
			var attributes = storageEl.XMLDocument.documentElement.attributes
			for (var i=attributes.length-1; i>=0; i--) {
				var attr = attributes[i]
				callback(storageEl.getAttribute(attr.name), attr.name)
			}
		})
	}
	
	function remove(unfixedKey) {
		var fixedKey = fixKey(unfixedKey)
		_withStorageEl(function(storageEl) {
			storageEl.removeAttribute(fixedKey)
			storageEl.save(storageName)
		})
	}
	
	function clearAll() {
		_withStorageEl(function(storageEl) {
			var attributes = storageEl.XMLDocument.documentElement.attributes
			storageEl.load(storageName)
			for (var i=attributes.length-1; i>=0; i--) {
				storageEl.removeAttribute(attributes[i].name)
			}
			storageEl.save(storageName)
		})
	}
	
	// Helpers
	//////////
	
	// In IE7, keys cannot start with a digit or contain certain chars.
	// See https://github.com/marcuswestin/store.js/issues/40
	// See https://github.com/marcuswestin/store.js/issues/83
	var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
	function fixKey(key) {
		return key.replace(/^\d/, '___$&').replace(forbiddenCharsRegex, '___')
	}
	
	function _makeIEStorageElFunction() {
		if (!doc || !doc.documentElement || !doc.documentElement.addBehavior) {
			return null
		}
		var scriptTag = 'script',
			storageOwner,
			storageContainer,
			storageEl
	
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			/* global ActiveXObject */
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storageEl = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storageEl = doc.createElement('div')
			storageOwner = doc.body
		}
	
		return function(storeFunction) {
			var args = [].slice.call(arguments, 0)
			args.unshift(storageEl)
			// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
			// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
			storageOwner.appendChild(storageEl)
			storageEl.addBehavior('#default#userData')
			storageEl.load(storageName)
			storeFunction.apply(this, args)
			storageOwner.removeChild(storageEl)
			return
		}
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// cookieStorage is useful Safari private browser mode, where localStorage
	// doesn't work but cookies do. This implementation is adopted from
	// https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage
	
	var util = __webpack_require__(3)
	var Global = util.Global
	var trim = util.trim
	
	module.exports = {
		name: 'cookieStorage',
		read: read,
		write: write,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	var doc = Global.document
	
	function read(key) {
		if (!key || !_has(key)) { return null }
		var regexpStr = "(?:^|.*;\\s*)" +
			escape(key).replace(/[\-\.\+\*]/g, "\\$&") +
			"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"
		return unescape(doc.cookie.replace(new RegExp(regexpStr), "$1"))
	}
	
	function each(callback) {
		var cookies = doc.cookie.split(/; ?/g)
		for (var i = cookies.length - 1; i >= 0; i--) {
			if (!trim(cookies[i])) {
				continue
			}
			var kvp = cookies[i].split('=')
			var key = unescape(kvp[0])
			var val = unescape(kvp[1])
			callback(val, key)
		}
	}
	
	function write(key, data) {
		if(!key) { return }
		doc.cookie = escape(key) + "=" + escape(data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/"
	}
	
	function remove(key) {
		if (!key || !_has(key)) {
			return
		}
		doc.cookie = escape(key) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"
	}
	
	function clearAll() {
		each(function(_, key) {
			remove(key)
		})
	}
	
	function _has(key) {
		return (new RegExp("(?:^|;\\s*)" + escape(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(doc.cookie)
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(3)
	var Global = util.Global
	
	module.exports = {
		name: 'sessionStorage',
		read: read,
		write: write,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	function sessionStorage() {
		return Global.sessionStorage
	}
	
	function read(key) {
		return sessionStorage().getItem(key)
	}
	
	function write(key, data) {
		return sessionStorage().setItem(key, data)
	}
	
	function each(fn) {
		for (var i = sessionStorage().length - 1; i >= 0; i--) {
			var key = sessionStorage().key(i)
			fn(read(key), key)
		}
	}
	
	function remove(key) {
		return sessionStorage().removeItem(key)
	}
	
	function clearAll() {
		return sessionStorage().clear()
	}


/***/ },
/* 10 */
/***/ function(module, exports) {

	// memoryStorage is a useful last fallback to ensure that the store
	// is functions (meaning store.get(), store.set(), etc will all function).
	// However, stored values will not persist when the browser navigates to
	// a new page or reloads the current page.
	
	module.exports = {
		name: 'memoryStorage',
		read: read,
		write: write,
		each: each,
		remove: remove,
		clearAll: clearAll,
	}
	
	var memoryStorage = {}
	
	function read(key) {
		return memoryStorage[key]
	}
	
	function write(key, data) {
		memoryStorage[key] = data
	}
	
	function each(callback) {
		for (var key in memoryStorage) {
			if (memoryStorage.hasOwnProperty(key)) {
				callback(memoryStorage[key], key)
			}
		}
	}
	
	function remove(key) {
		delete memoryStorage[key]
	}
	
	function clearAll(key) {
		memoryStorage = {}
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = json2Plugin
	
	function json2Plugin() {
		__webpack_require__(12)
		return {}
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	//  json2.js
	//  2016-10-28
	//  Public Domain.
	//  NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
	//  See http://www.JSON.org/js.html
	//  This code should be minified before deployment.
	//  See http://javascript.crockford.com/jsmin.html
	
	//  USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	//  NOT CONTROL.
	
	//  This file creates a global JSON object containing two methods: stringify
	//  and parse. This file provides the ES5 JSON capability to ES3 systems.
	//  If a project might run on IE8 or earlier, then this file should be included.
	//  This file does nothing on ES5 systems.
	
	//      JSON.stringify(value, replacer, space)
	//          value       any JavaScript value, usually an object or array.
	//          replacer    an optional parameter that determines how object
	//                      values are stringified for objects. It can be a
	//                      function or an array of strings.
	//          space       an optional parameter that specifies the indentation
	//                      of nested structures. If it is omitted, the text will
	//                      be packed without extra whitespace. If it is a number,
	//                      it will specify the number of spaces to indent at each
	//                      level. If it is a string (such as "\t" or "&nbsp;"),
	//                      it contains the characters used to indent at each level.
	//          This method produces a JSON text from a JavaScript value.
	//          When an object value is found, if the object contains a toJSON
	//          method, its toJSON method will be called and the result will be
	//          stringified. A toJSON method does not serialize: it returns the
	//          value represented by the name/value pair that should be serialized,
	//          or undefined if nothing should be serialized. The toJSON method
	//          will be passed the key associated with the value, and this will be
	//          bound to the value.
	
	//          For example, this would serialize Dates as ISO strings.
	
	//              Date.prototype.toJSON = function (key) {
	//                  function f(n) {
	//                      // Format integers to have at least two digits.
	//                      return (n < 10)
	//                          ? "0" + n
	//                          : n;
	//                  }
	//                  return this.getUTCFullYear()   + "-" +
	//                       f(this.getUTCMonth() + 1) + "-" +
	//                       f(this.getUTCDate())      + "T" +
	//                       f(this.getUTCHours())     + ":" +
	//                       f(this.getUTCMinutes())   + ":" +
	//                       f(this.getUTCSeconds())   + "Z";
	//              };
	
	//          You can provide an optional replacer method. It will be passed the
	//          key and value of each member, with this bound to the containing
	//          object. The value that is returned from your method will be
	//          serialized. If your method returns undefined, then the member will
	//          be excluded from the serialization.
	
	//          If the replacer parameter is an array of strings, then it will be
	//          used to select the members to be serialized. It filters the results
	//          such that only members with keys listed in the replacer array are
	//          stringified.
	
	//          Values that do not have JSON representations, such as undefined or
	//          functions, will not be serialized. Such values in objects will be
	//          dropped; in arrays they will be replaced with null. You can use
	//          a replacer function to replace those with JSON values.
	
	//          JSON.stringify(undefined) returns undefined.
	
	//          The optional space parameter produces a stringification of the
	//          value that is filled with line breaks and indentation to make it
	//          easier to read.
	
	//          If the space parameter is a non-empty string, then that string will
	//          be used for indentation. If the space parameter is a number, then
	//          the indentation will be that many spaces.
	
	//          Example:
	
	//          text = JSON.stringify(["e", {pluribus: "unum"}]);
	//          // text is '["e",{"pluribus":"unum"}]'
	
	//          text = JSON.stringify(["e", {pluribus: "unum"}], null, "\t");
	//          // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'
	
	//          text = JSON.stringify([new Date()], function (key, value) {
	//              return this[key] instanceof Date
	//                  ? "Date(" + this[key] + ")"
	//                  : value;
	//          });
	//          // text is '["Date(---current time---)"]'
	
	//      JSON.parse(text, reviver)
	//          This method parses a JSON text to produce an object or array.
	//          It can throw a SyntaxError exception.
	
	//          The optional reviver parameter is a function that can filter and
	//          transform the results. It receives each of the keys and values,
	//          and its return value is used instead of the original value.
	//          If it returns what it received, then the structure is not modified.
	//          If it returns undefined then the member is deleted.
	
	//          Example:
	
	//          // Parse the text. Values that look like ISO date strings will
	//          // be converted to Date objects.
	
	//          myData = JSON.parse(text, function (key, value) {
	//              var a;
	//              if (typeof value === "string") {
	//                  a =
	//   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
	//                  if (a) {
	//                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
	//                          +a[5], +a[6]));
	//                  }
	//              }
	//              return value;
	//          });
	
	//          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
	//              var d;
	//              if (typeof value === "string" &&
	//                      value.slice(0, 5) === "Date(" &&
	//                      value.slice(-1) === ")") {
	//                  d = new Date(value.slice(5, -1));
	//                  if (d) {
	//                      return d;
	//                  }
	//              }
	//              return value;
	//          });
	
	//  This is a reference implementation. You are free to copy, modify, or
	//  redistribute.
	
	/*jslint
	    eval, for, this
	*/
	
	/*property
	    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	    lastIndex, length, parse, prototype, push, replace, slice, stringify,
	    test, toJSON, toString, valueOf
	*/
	
	
	// Create a JSON object only if one does not already exist. We create the
	// methods in a closure to avoid creating global variables.
	
	if (typeof JSON !== "object") {
	    JSON = {};
	}
	
	(function () {
	    "use strict";
	
	    var rx_one = /^[\],:{}\s]*$/;
	    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
	    var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	    var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	
	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10
	            ? "0" + n
	            : n;
	    }
	
	    function this_value() {
	        return this.valueOf();
	    }
	
	    if (typeof Date.prototype.toJSON !== "function") {
	
	        Date.prototype.toJSON = function () {
	
	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear() + "-" +
	                        f(this.getUTCMonth() + 1) + "-" +
	                        f(this.getUTCDate()) + "T" +
	                        f(this.getUTCHours()) + ":" +
	                        f(this.getUTCMinutes()) + ":" +
	                        f(this.getUTCSeconds()) + "Z"
	                : null;
	        };
	
	        Boolean.prototype.toJSON = this_value;
	        Number.prototype.toJSON = this_value;
	        String.prototype.toJSON = this_value;
	    }
	
	    var gap;
	    var indent;
	    var meta;
	    var rep;
	
	
	    function quote(string) {
	
	// If the string contains no control characters, no quote characters, and no
	// backslash characters, then we can safely slap some quotes around it.
	// Otherwise we must also replace the offending characters with safe escape
	// sequences.
	
	        rx_escapable.lastIndex = 0;
	        return rx_escapable.test(string)
	            ? "\"" + string.replace(rx_escapable, function (a) {
	                var c = meta[a];
	                return typeof c === "string"
	                    ? c
	                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	            }) + "\""
	            : "\"" + string + "\"";
	    }
	
	
	    function str(key, holder) {
	
	// Produce a string from holder[key].
	
	        var i;          // The loop counter.
	        var k;          // The member key.
	        var v;          // The member value.
	        var length;
	        var mind = gap;
	        var partial;
	        var value = holder[key];
	
	// If the value has a toJSON method, call it to obtain a replacement value.
	
	        if (value && typeof value === "object" &&
	                typeof value.toJSON === "function") {
	            value = value.toJSON(key);
	        }
	
	// If we were called with a replacer function, then call the replacer to
	// obtain a replacement value.
	
	        if (typeof rep === "function") {
	            value = rep.call(holder, key, value);
	        }
	
	// What happens next depends on the value's type.
	
	        switch (typeof value) {
	        case "string":
	            return quote(value);
	
	        case "number":
	
	// JSON numbers must be finite. Encode non-finite numbers as null.
	
	            return isFinite(value)
	                ? String(value)
	                : "null";
	
	        case "boolean":
	        case "null":
	
	// If the value is a boolean or null, convert it to a string. Note:
	// typeof null does not produce "null". The case is included here in
	// the remote chance that this gets fixed someday.
	
	            return String(value);
	
	// If the type is "object", we might be dealing with an object or an array or
	// null.
	
	        case "object":
	
	// Due to a specification blunder in ECMAScript, typeof null is "object",
	// so watch out for that case.
	
	            if (!value) {
	                return "null";
	            }
	
	// Make an array to hold the partial results of stringifying this object value.
	
	            gap += indent;
	            partial = [];
	
	// Is the value an array?
	
	            if (Object.prototype.toString.apply(value) === "[object Array]") {
	
	// The value is an array. Stringify every element. Use null as a placeholder
	// for non-JSON values.
	
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || "null";
	                }
	
	// Join all of the elements together, separated with commas, and wrap them in
	// brackets.
	
	                v = partial.length === 0
	                    ? "[]"
	                    : gap
	                        ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
	                        : "[" + partial.join(",") + "]";
	                gap = mind;
	                return v;
	            }
	
	// If the replacer is an array, use it to select the members to be stringified.
	
	            if (rep && typeof rep === "object") {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === "string") {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (
	                                gap
	                                    ? ": "
	                                    : ":"
	                            ) + v);
	                        }
	                    }
	                }
	            } else {
	
	// Otherwise, iterate through all of the keys in the object.
	
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (
	                                gap
	                                    ? ": "
	                                    : ":"
	                            ) + v);
	                        }
	                    }
	                }
	            }
	
	// Join all of the member texts together, separated with commas,
	// and wrap them in braces.
	
	            v = partial.length === 0
	                ? "{}"
	                : gap
	                    ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
	                    : "{" + partial.join(",") + "}";
	            gap = mind;
	            return v;
	        }
	    }
	
	// If the JSON object does not yet have a stringify method, give it one.
	
	    if (typeof JSON.stringify !== "function") {
	        meta = {    // table of character substitutions
	            "\b": "\\b",
	            "\t": "\\t",
	            "\n": "\\n",
	            "\f": "\\f",
	            "\r": "\\r",
	            "\"": "\\\"",
	            "\\": "\\\\"
	        };
	        JSON.stringify = function (value, replacer, space) {
	
	// The stringify method takes a value and an optional replacer, and an optional
	// space parameter, and returns a JSON text. The replacer can be a function
	// that can replace values, or an array of strings that will select the keys.
	// A default replacer method can be provided. Use of the space parameter can
	// produce text that is more easily readable.
	
	            var i;
	            gap = "";
	            indent = "";
	
	// If the space parameter is a number, make an indent string containing that
	// many spaces.
	
	            if (typeof space === "number") {
	                for (i = 0; i < space; i += 1) {
	                    indent += " ";
	                }
	
	// If the space parameter is a string, it will be used as the indent string.
	
	            } else if (typeof space === "string") {
	                indent = space;
	            }
	
	// If there is a replacer, it must be a function or an array.
	// Otherwise, throw an error.
	
	            rep = replacer;
	            if (replacer && typeof replacer !== "function" &&
	                    (typeof replacer !== "object" ||
	                    typeof replacer.length !== "number")) {
	                throw new Error("JSON.stringify");
	            }
	
	// Make a fake root object containing our value under the key of "".
	// Return the result of stringifying the value.
	
	            return str("", {"": value});
	        };
	    }
	
	
	// If the JSON object does not yet have a parse method, give it one.
	
	    if (typeof JSON.parse !== "function") {
	        JSON.parse = function (text, reviver) {
	
	// The parse method takes a text and an optional reviver function, and returns
	// a JavaScript value if the text is a valid JSON text.
	
	            var j;
	
	            function walk(holder, key) {
	
	// The walk method is used to recursively walk the resulting structure so
	// that modifications can be made.
	
	                var k;
	                var v;
	                var value = holder[key];
	                if (value && typeof value === "object") {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }
	
	
	// Parsing happens in four stages. In the first stage, we replace certain
	// Unicode characters with escape sequences. JavaScript handles many characters
	// incorrectly, either silently deleting them, or treating them as line endings.
	
	            text = String(text);
	            rx_dangerous.lastIndex = 0;
	            if (rx_dangerous.test(text)) {
	                text = text.replace(rx_dangerous, function (a) {
	                    return "\\u" +
	                            ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }
	
	// In the second stage, we run the text against regular expressions that look
	// for non-JSON patterns. We are especially concerned with "()" and "new"
	// because they can cause invocation, and "=" because it can cause mutation.
	// But just to be safe, we want to reject all unexpected forms.
	
	// We split the second stage into 4 regexp operations in order to work around
	// crippling inefficiencies in IE's and Safari's regexp engines. First we
	// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
	// replace all simple value tokens with "]" characters. Third, we delete all
	// open brackets that follow a colon or comma or that begin the text. Finally,
	// we look to see that the remaining characters are only whitespace or "]" or
	// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.
	
	            if (
	                rx_one.test(
	                    text
	                        .replace(rx_two, "@")
	                        .replace(rx_three, "]")
	                        .replace(rx_four, "")
	                )
	            ) {
	
	// In the third stage we use the eval function to compile the text into a
	// JavaScript structure. The "{" operator is subject to a syntactic ambiguity
	// in JavaScript: it can begin a block or an object literal. We wrap the text
	// in parens to eliminate the ambiguity.
	
	                j = eval("(" + text + ")");
	
	// In the optional fourth stage, we recursively walk the new structure, passing
	// each name/value pair to a reviver function for possible transformation.
	
	                return (typeof reviver === "function")
	                    ? walk({"": j}, "")
	                    : j;
	            }
	
	// If the text is not JSON parseable, then a SyntaxError is thrown.
	
	            throw new SyntaxError("JSON.parse");
	        };
	    }
	}());

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDE2MTk2ODI3NWU1NWM2MmM5OTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2pzL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvZGlzdC9zdG9yZS5sZWdhY3kuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvc3JjL3N0b3JlLWVuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9+Ly4yLjAuNEBzdG9yZS9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly8vLi9+Ly4yLjAuNEBzdG9yZS9zdG9yYWdlcy9hbGwuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvbG9jYWxTdG9yYWdlLmpzIiwid2VicGFjazovLy8uL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL29sZEZGLWdsb2JhbFN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvb2xkSUUtdXNlckRhdGFTdG9yYWdlLmpzIiwid2VicGFjazovLy8uL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL2Nvb2tpZVN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvc2Vzc2lvblN0b3JhZ2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvbWVtb3J5U3RvcmFnZS5qcyIsIndlYnBhY2s6Ly8vLi9+Ly4yLjAuNEBzdG9yZS9wbHVnaW5zL2pzb24yLmpzIiwid2VicGFjazovLy8uL34vLjIuMC40QHN0b3JlL3BsdWdpbnMvbGliL2pzb24yLmpzIl0sIm5hbWVzIjpbInN0b3JlIiwicmVxdWlyZSIsIiRmb3JtX2FkZF90YXNrIiwiJCIsImRlbGV0ZUVsZW1lbnQiLCJkZXRhaWxFbGVtZW50IiwidGFza19saXN0IiwiJHRhc2tfZGV0YWlsIiwidGFza19kZXRhaWxfbWFzayIsImRldGFpbEZvcm0iLCJpbnB1dENvbnRlbnQiLCJjb250ZW50IiwidGFza19pdGVtIiwidGFza19jb21wbGV0ZWQiLCJpbnB1dFRpbWVQaWNrZXIiLCJpbml0Iiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJuZXdfdGFzayIsImlucHV0IiwiZmluZCIsInZhbCIsImFkZF90YXNrX2xpc3QiLCJnZXQiLCJyZW5kZXJfdGFza19saXN0IiwibmV3X3Rhc2tfaXRlbSIsInB1c2giLCJyZWZyZXNoX3Rhc2tfbGlzdCIsImRlbGV0ZV90YXNrX2xpc3QiLCJpbmRleCIsInVuZGVmaW5lZCIsIiR0YXNrX2xpc3QiLCJodG1sIiwiY29tcGxldGVfaXRlbSIsImkiLCJsZW5ndGgiLCJpdGVtIiwiY29tcGxldGUiLCJtb2R1bGUiLCJ0YXNrX2xpc3RfaXRlbSIsInByZXBlbmQiLCJqIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJsaXN0ZW5fZGVsZXRlIiwibGlzdGVuX2RldGFpbF9zaG93IiwibGlzdGVuX2RldGFpbF9oaWRlIiwibGlzdGVuX3Rhc2tfY29tcGxldGVkIiwidGFza19yZW1pbmRfY2hlY2siLCJsaXN0ZW5fY29uZmlybV9rbm93IiwiZGVsZXRJbmRleCIsInBhcmVudCIsImRhdGEiLCJ0bXAiLCJjb25maXJtIiwiZGV0YWlsSW5kZXgiLCJzaG93IiwicmVuZGVyX3Rhc2tfZGV0YWlsIiwiaGlkZSIsInVwZGF0YV90YXNrX2RldGFpbCIsInBhdXNlIiwiaXRsIiwic2V0SW50ZXJ2YWwiLCJyZW1pbmQiLCJpbmZvcm1lZCIsIm5vd1RpbWUiLCJEYXRlIiwiZ2V0VGltZSIsInJlbWluZFRpbWUiLCJzaG93X21lc3NhZ2UiLCJwbGF5IiwidGFzayIsInRwbCIsImRlc2MiLCJkYXRldGltZXBpY2tlciIsImV4dGVuZCIsInNldCIsImxpc3RfaXRlbV90cGwiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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Q0E7QUFDQTtBQUNBO0FBQ0EsWUFBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMkJBQTBCO0FBQzFCLGtEQUFpRCxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7QUFDYjtBQUNBOzs7QUFHQTs7QUFFQTs7QUFFQSxlQUFjO0FBQ2QsZUFBYztBQUNkLGVBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTJCLFlBQVk7QUFDdkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDRCQUEyQixZQUFZO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFxQjtBQUNyQjtBQUNBLHlCQUF3Qix3REFBd0Q7QUFDaEYseUJBQXdCLDBCQUEwQjtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDRCQUEyQixXQUFXO0FBQ3RDO0FBQ0E7O0FBRUE7O0FBRUEsY0FBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw2QkFBNEIsVUFBVTtBQUN0QztBQUNBOzs7QUFHQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLE9BQU87O0FBRTFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQ0FBK0I7QUFDL0I7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTRCLE1BQU07QUFDbEM7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEkiLCJmaWxlIjoiLi9kaXN0L2pzL2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDAxNjE5NjgyNzVlNTVjNjJjOTk5IiwiOyhmdW5jdGlvbigpe1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICAvLyDlvJXlhaXmnKzlnLDlrZjlgqhzdG9yZS5qc1xyXG4gIHZhciBzdG9yZSA9IHJlcXVpcmUoJ3N0b3JlJyk7XHJcbiAgdmFyICRmb3JtX2FkZF90YXNrPSQoJy5hZGQtdGFzaycpLFxyXG4gIGRlbGV0ZUVsZW1lbnQsXHJcbiAgZGV0YWlsRWxlbWVudCxcclxuICB0YXNrX2xpc3Q9W10sXHJcbiAgJHRhc2tfZGV0YWlsPSQoJy50YXNrLWRldGFpbCcpLFxyXG4gIHRhc2tfZGV0YWlsX21hc2s9JCgnLnRhc2stZGV0YWlsLW1hc2snKSxcclxuICBkZXRhaWxGb3JtLFxyXG4gIGlucHV0Q29udGVudCxcclxuICBjb250ZW50LFxyXG4gIHRhc2tfaXRlbSxcclxuICB0YXNrX2NvbXBsZXRlZCxcclxuICBpbnB1dFRpbWVQaWNrZXJcclxuICA7XHJcblxyXG4gIGluaXQoKTtcclxuICAkZm9ybV9hZGRfdGFzay5vbignc3VibWl0JyAsZnVuY3Rpb24oZSl7XHJcbiAgICAvL+emgeeUqOm7mOiupOihjOS4ulxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy8g5bu656uL5a+56LGhXHJcbiAgICB2YXIgbmV3X3Rhc2s9e307XHJcbiAgICAvLyDojrflj5bovpPlhaXmoYbnmoTlgLxcclxuICAgIHZhciBpbnB1dD0kKHRoaXMpLmZpbmQoJ2lucHV0W25hbWU9Y29udGVudF0nKTtcclxuICAgIC8vIOiuvue9rnRhc2vlr7nosaHnmoRjb250ZW505bGe5oCn5Li66L6T5YWl5qGG55qE5YC8XHJcbiAgICBuZXdfdGFzay5jb250ZW50PVxyXG4gICAgaW5wdXQudmFsKCk7XHJcbiAgICAvLyDlpoLmnpzovpPlhaXkuLrnqbrliJnov5Tlm55cclxuICAgIGlmKCFuZXdfdGFzay5jb250ZW50KSByZXR1cm47XHJcbiAgICAvLyDlop7liqDmnaHmlbBcclxuICAgIGFkZF90YXNrX2xpc3QobmV3X3Rhc2spO1xyXG4gICAgLy8g5a6M5oiQ5ZCO5riF56m66L6T5YWl5qGGXHJcbiAgICBpbnB1dC52YWwobnVsbCk7XHJcbiAgfSk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBpbml0KCl7XHJcbiAgICAvLyDliJ3lp4vljJblvpfliLDmnKzlnLDlrZjlgqjnmoTlgLxcclxuICAgIHRhc2tfbGlzdD1zdG9yZS5nZXQoJ3Rhc2tfbGlzdCcpfHxbXTtcclxuICAgIC8vIOa4suafk1xyXG4gICAgcmVuZGVyX3Rhc2tfbGlzdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8g5aKe5Yqg5p2h5pWw55qE5pWw57uE5Lyg5YWl55qE5Y+C5pWw5Li6dGFza+WvueixoVxyXG4gIGZ1bmN0aW9uIGFkZF90YXNrX2xpc3QobmV3X3Rhc2tfaXRlbSl7XHJcbiAgICAvLyDlsIbojrflvpfnmoTljIXlkKvovpPlh7rlgLznmoTlr7nosaHmjqjov5vmlbDnu4RcclxuICAgIHRhc2tfbGlzdC5wdXNoKG5ld190YXNrX2l0ZW0pO1xyXG4gICAgLy8g5pu05pawXHJcbiAgICByZWZyZXNoX3Rhc2tfbGlzdCgpO1xyXG4gIH1cclxuICAvLyDliKDpmaTmnaHmlbDnmoTmlbDnu4Qg5Lyg5YWl55qE5Y+C5pWw5Li65b2T5YmN5p2h5pWw55qE57Si5byVXHJcbiAgZnVuY3Rpb24gZGVsZXRlX3Rhc2tfbGlzdChpbmRleCl7XHJcbiAgICAvLyDlpoLmnpzkvKDlhaXnmoTmlbDlrZfkuI3lrZjlnKjliJnov5Tlm55cclxuICAgIGlmKGluZGV4PT09dW5kZWZpbmVkfHwhdGFza19saXN0W2luZGV4XSkgcmV0dXJuO1xyXG4gICAgLy8g5Yig6Zmk5b2T5YmN5a+55bqU55qE57Si5byV55qE5pWw57uE6ZSu5YC85a+5XHJcbiAgICBkZWxldGUgdGFza19saXN0W2luZGV4XTtcclxuICAgIC8vIOabtOaWsOacrOWcsOeahOWAvFxyXG4gICAgcmVmcmVzaF90YXNrX2xpc3QoKTtcclxuICB9XHJcbiAgLy8g5riy5p+T5Ye95pWwXHJcbiAgZnVuY3Rpb24gcmVuZGVyX3Rhc2tfbGlzdCgpe1xyXG4gICAgLy8g6I635Y+W5p2h5pWw55qE5a655Zmo5YWD57SgXHJcbiAgICB2YXIgJHRhc2tfbGlzdD0kKCcudGFzay1saXN0Jyk7XHJcbiAgICAvLyDliJ3lp4vljJblsIblhajpg6jnmoTovpPlh7rmuIXpmaRcclxuICAgICR0YXNrX2xpc3QuaHRtbCgnJyk7XHJcbiAgICAvLyDpgY3ljobmlbDnu4TlsIbmr4/kuIDmnaHlr7nlupTnmoRodG1s57uT5p6E5o+S5YWl5Yiw54i25YWD57Sg5a655Zmo5YaFXHJcbiAgICAvLyDmlrDlu7rmlbDnu4Tkv53lrZjlt7Lnu4/lrozmiJDnmoTkuovku7ZcclxuICAgIHZhciBjb21wbGV0ZV9pdGVtPVtdO1xyXG4gICAgZm9yKHZhciBpPTA7aTx0YXNrX2xpc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgIHZhciBpdGVtPXRhc2tfbGlzdFtpXTtcclxuICAgICAgLy8g5Zug5Li65pWw57uE5bqP5Y+35LiN6L+e57utICDmnInnmoTooqvliKDmjokgIOaJgOS7pemBjeWOhuWFqOmDqOS8muacieeahOepuue8ulxyXG4gICAgICBpZighaXRlbSkgY29udGludWU7XHJcbiAgICAgIC8vIOWmguaenOeCueWHu+mCo+S5iGNvbXBsZXRl5Li6dHJ1ZSDlsIblsLHmlbDnu4TnmoTlr7nlupTlhYPntKDlpI3liLbnu5nmlrDmlbDnu4TnmoTlhYPntKBcclxuICAgICAgaWYoaXRlbSAmJiBpdGVtLmNvbXBsZXRlKXtcclxuICAgICAgICBjb21wbGV0ZV9pdGVtW2ldPWl0ZW07XHJcbiAgICAgIH1cclxuICAgICAgLy8g5aaC5p6c5rKh54K55Ye75bCx5q2j5bi45riy5p+T5Zyo54i25YWD57Sg5a655Zmo5pyA5YmN6Z2iXHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdmFyIG1vZHVsZT10YXNrX2xpc3RfaXRlbSh0YXNrX2xpc3RbaV0saSk7XHJcbiAgICAgICAgJHRhc2tfbGlzdC5wcmVwZW5kKG1vZHVsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIOWboOS4uueCueWHu+eahOWFg+e0oOayoea4suafkyDmiYDku6XkuI3op4HkuoYg5Zyo6L+Z6YeM6YeN5paw6YGN5Y6G5riy5p+T5Zyo54i25YWD57Sg5a655Zmo5pyA5ZCO6Z2iXHJcbiAgICBmb3IodmFyIGo9MDtqPGNvbXBsZXRlX2l0ZW0ubGVuZ3RoO2orKyl7XHJcbiAgICAgIGlmKCFjb21wbGV0ZV9pdGVtW2pdKSBjb250aW51ZTtcclxuICAgICAgbW9kdWxlPXRhc2tfbGlzdF9pdGVtKGNvbXBsZXRlX2l0ZW1bal0saik7XHJcbiAgICAgIGlmKG1vZHVsZSl7XHJcbiAgICAgICAgLy8g5bm25LiU5Li654K55Ye755qE5LqL5Lu25re75Yqg5paw55qE5qC35byPXHJcbiAgICAgICAgbW9kdWxlLmFkZENsYXNzKFwiaGFzQ29tcGxldGVkXCIpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIOavj+S4gOadoeaJk+mSqeeahOW+gOWQjuaPkuWFpeWIsOeItuWFg+e0oOWuueWZqFxyXG4gICAgICAkdGFza19saXN0LmFwcGVuZChtb2R1bGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIC8vIOimgeebkeWQrOavj+S4gOadoeeahOS6i+S7tuWHveaVsOW/hemhu+WcqOa4suafk+WGheaTjeS9nFxyXG4gICAgZGVsZXRlRWxlbWVudD0kKCcuZGVsZXRlJyk7XHJcbiAgICBkZXRhaWxFbGVtZW50PSQoJy5kZXRhaWwnKTtcclxuICAgIHRhc2tfaXRlbT0kKCcudGFzay1pdGVtJyk7XHJcbiAgICB0YXNrX2NvbXBsZXRlZD0kKCcudGFza19jb21wbGV0ZWQnKTtcclxuICAgIC8vIOeCueWHu+WIoOmZpOWMuuWfn+iwg+eUqOWIoOmZpOWHveaVsFxyXG4gICAgbGlzdGVuX2RlbGV0ZSgpO1xyXG4gICAgLy8g54K55Ye75oiW5Y+M5Ye75pi+56S66K+m5oOFXHJcbiAgICBsaXN0ZW5fZGV0YWlsX3Nob3coKTtcclxuICAgIC8vIOmakOiXj1xyXG4gICAgbGlzdGVuX2RldGFpbF9oaWRlKCk7XHJcbiAgICAvLyDngrnlh7vliIfmjaJjb250ZW5055qE5YC8XHJcbiAgICBsaXN0ZW5fdGFza19jb21wbGV0ZWQoKTtcclxuICAgIC8vIOaXtumXtOaPkOmGkuWKn+iDveWHveaVsFxyXG4gICAgdGFza19yZW1pbmRfY2hlY2soKTtcclxuICAgIC8vIOeCueWHu+aaguWBnOmXuemTg+W5tumakOiXj+aPkOmGklxyXG4gICAgbGlzdGVuX2NvbmZpcm1fa25vdygpO1xyXG5cclxuICB9XHJcbiAgLy8g5Yig6Zmk5p2h5pWw55qE5Ye95pWwXHJcbiAgZnVuY3Rpb24gIGxpc3Rlbl9kZWxldGUoKXtcclxuICAgIGRlbGV0ZUVsZW1lbnQub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAvLyDlvZPliY3liKDpmaTlhYPntKDnmoTniLblhYPntKDnmoToh6rlrprkuYnlsZ7mgKflgLxcclxuICAgICAgdmFyIGRlbGV0SW5kZXg9JCh0aGlzKS5wYXJlbnQoKS5kYXRhKCdpbmRleCcpO1xyXG4gICAgICAvLyDnoa7orqTliKDpmaTlr7nor53moYZcclxuICAgICAgdmFyIHRtcD0gY29uZmlybSgn56Gu5a6a5Yig6Zmk77yfJyk7XHJcbiAgICAgIHRtcD8gZGVsZXRlX3Rhc2tfbGlzdChkZWxldEluZGV4KVxyXG4gICAgICA6XHJcbiAgICAgIG51bGw7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLy8g5pi+56S66K+m5oOF5bm25riy5p+T6K+m5oOF55qE5Ye95pWwXHJcbiAgZnVuY3Rpb24gIGxpc3Rlbl9kZXRhaWxfc2hvdygpe1xyXG4gICAgZGV0YWlsRWxlbWVudC5vbignY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgIHZhciBkZXRhaWxJbmRleD0kKHRoaXMpLnBhcmVudCgpLmRhdGEoJ2luZGV4Jyk7XHJcbiAgICAgICR0YXNrX2RldGFpbC5zaG93KCk7XHJcbiAgICAgIHRhc2tfZGV0YWlsX21hc2suc2hvdygpO1xyXG4gICAgICByZW5kZXJfdGFza19kZXRhaWwoZGV0YWlsSW5kZXgpO1xyXG5cclxuICAgIH0pO1xyXG4gICAgdGFza19pdGVtLm9uKCdkYmxjbGljaycsZnVuY3Rpb24oKXtcclxuICAgICAgdmFyIGRldGFpbEluZGV4PSQodGhpcykuZGF0YSgnaW5kZXgnKTtcclxuICAgICAgJHRhc2tfZGV0YWlsLnNob3coKTtcclxuICAgICAgdGFza19kZXRhaWxfbWFzay5zaG93KCk7XHJcbiAgICAgIHJlbmRlcl90YXNrX2RldGFpbChkZXRhaWxJbmRleCk7XHJcbiAgICB9KTtcclxuXHJcbiAgfVxyXG4gIC8vIOmakOiXj+ivpuaDheeahOWHveaVsFxyXG4gIGZ1bmN0aW9uICBsaXN0ZW5fZGV0YWlsX2hpZGUoKXtcclxuICAgIHRhc2tfZGV0YWlsX21hc2sub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAkdGFza19kZXRhaWwuaGlkZSgpO1xyXG4gICAgICB0YXNrX2RldGFpbF9tYXNrLmhpZGUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLyDngrnlh7vliIfmjaJjb21wbGV0ZeWHveaVsFxyXG4gIGZ1bmN0aW9uIGxpc3Rlbl90YXNrX2NvbXBsZXRlZCgpe1xyXG4gICAgdGFza19jb21wbGV0ZWQub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgaW5kZXg9JCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5kYXRhKCdpbmRleCcpO1xyXG4gICAgICB2YXIgaXRlbT1zdG9yZS5nZXQoJ3Rhc2tfbGlzdCcpW2luZGV4XTtcclxuICAgICAgaWYoaXRlbS5jb21wbGV0ZSl7XHJcbiAgICAgICAgLy8g5paw5bu6Y29tcGxldGXlr7nosaHlubbmm7TmlrBcclxuICAgICAgICB1cGRhdGFfdGFza19kZXRhaWwoaW5kZXgsIHtjb21wbGV0ZTpmYWxzZX0pO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgdXBkYXRhX3Rhc2tfZGV0YWlsKGluZGV4LCB7Y29tcGxldGU6dHJ1ZX0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIC8vIOeCueWHu+KAnOefpemBk+S6huKAnVxyXG4gIGZ1bmN0aW9uIGxpc3Rlbl9jb25maXJtX2tub3coKXtcclxuICAgICQoJy5rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xyXG4gICAgICAkKCcubXNnJykuaGlkZSgpO1xyXG4gICAgICAkKCcubXVzaWMnKS5nZXQoMCkucGF1c2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICAvLyDml7bpl7Tmj5DphpLlh73mlbBcclxuICBmdW5jdGlvbiB0YXNrX3JlbWluZF9jaGVjaygpe1xyXG4gICAgLy8g5b6q546v5pe26Ze0XHJcbiAgICB2YXIgaXRsPXNldEludGVydmFsKGZ1bmN0aW9uKCl7XHJcbiAgICAgIC8vIOmBjeWOhuavj+S4gOadoVxyXG4gICAgICBmb3IodmFyIGk9MDtpPHRhc2tfbGlzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgaXRlbT1zdG9yZS5nZXQoJ3Rhc2tfbGlzdCcpW2ldO1xyXG4gICAgICAgIC8vIOWmguaenOW3sue7j+aPkOmGkui/h+S6huaIluiAheiiq+WIoOmZpOeahOadoeaVsOWwseS4jeaPkOmGklxyXG4gICAgICAgIGlmKCFpdGVtfHwhaXRlbS5yZW1pbmR8fGl0ZW0uaW5mb3JtZWR8fGl0ZW0uY29tcGxldGUpIGNvbnRpbnVlO1xyXG4gICAgICAgIC8vIOiOt+WPluW9k+WcsOWunumZheaXtumXtFxyXG4gICAgICAgIHZhciBub3dUaW1lPShuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgLy8g6I635Y+W5o+Q6YaS55qE5pe26Ze0XHJcbiAgICAgICAgdmFyIHJlbWluZFRpbWU9KG5ldyBEYXRlKGl0ZW0ucmVtaW5kKSkuZ2V0VGltZSgpO1xyXG4gICAgICAgIC8vIOWmguaenOmCo+S4gOadoeeahOaXtumXtOWIsOS6hlxyXG4gICAgICAgIGlmKG5vd1RpbWUtcmVtaW5kVGltZT49MSl7XHJcbiAgICAgICAgICAvLyDmm7TmlrDmlrDlop7lr7nosaFpbmZvcm1lZOS4unRydWXku6Pooajmj5DphpLov4fkuoZcclxuICAgICAgICAgIHVwZGF0YV90YXNrX2RldGFpbChpLCB7aW5mb3JtZWQ6dHJ1ZX0pO1xyXG4gICAgICAgICAgLy8g5pe26Ze05bCx5Yiw5LqG5bCx5pi+56S65o+Q6YaS5raI5oGvXHJcbiAgICAgICAgICBzaG93X21lc3NhZ2UoaXRlbS5jb250ZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sMzAwKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNob3dfbWVzc2FnZShjb250ZW50KXtcclxuICAgICQoJy5tc2dfY29udGVudCcpLmh0bWwoY29udGVudCk7XHJcbiAgICAkKCcubXNnJykuc2hvdygpO1xyXG4gICAgLy8gcGxheeaYr2RvbeWFg+e0oOeahOaWueazlSDpnIDopoHlsIZqcXVlcnnlr7nosaHovazljJbkuLpkb23lr7nosaFcclxuICAgICQoJy5tdXNpYycpLmdldCgwKS5wbGF5KCk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gIC8vIOa4suafk+ivpuaDheWHveaVsFxyXG4gIGZ1bmN0aW9uIHJlbmRlcl90YXNrX2RldGFpbChpbmRleCl7XHJcbiAgICBpZihpbmRleD09PXVuZGVmaW5lZHx8IXRhc2tfbGlzdFtpbmRleF0pIHJldHVybjtcclxuXHJcbiAgICB2YXIgdGFzaz10YXNrX2xpc3RbaW5kZXhdO1xyXG4gICAgLy8g6K+m5oOF5qih5p2/XHJcbiAgICB2YXIgdHBsPWAgIDxmb3JtIGNsYXNzPVwiZGV0YWlsRm9ybVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgICR7dGFzay5jb250ZW50fVxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2PjxpbnB1dCBjbGFzcz1cImlucHV0X2NvbnRlbnRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJjb250ZW50XCIgdmFsdWU9XCIke3Rhc2suY29udGVudH1cIj48L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJkZXNjXCI+XHJcbiAgICA8dGV4dGFyZWEgbmFtZT1cImRlc2NcIj4ke3Rhc2suZGVzY3x8Jyd9XHJcbiAgICA8L3RleHRhcmVhPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicmVtaW5kXCI+XHJcbiAgICA8aW5wdXQgY2xhc3M9XCJ0aW1lX3BpY2tlclwiICBuYW1lPVwicmVtaW5kXCIgdHlwZT1cInRleHRcIiB2YWx1ZT1cIiR7dGFzay5yZW1pbmR8fCcnfVwiPjwvaW5wdXQ+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJpbnB1dF9zdWJtaXRfYnV0dG9uXCIgdHlwZT1cInN1Ym1pdFwiPuabtOaWsDwvYnV0dG9uPlxyXG4gICAgPC9mb3JtPmA7XHJcblxyXG4gICAgJHRhc2tfZGV0YWlsLmh0bWwoJycpO1xyXG4gICAgJHRhc2tfZGV0YWlsLmFwcGVuZCgkKHRwbCkpO1xyXG5cclxuICAgIGRldGFpbEZvcm09JCgnLmRldGFpbEZvcm0nKTtcclxuICAgIGRldGFpbEZvcm0ub24oJ3N1Ym1pdCcsZnVuY3Rpb24oZSl7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgLy8g5paw5bu6ZGF0YeWvueixoSDooajljZXmj5DkuqTkuYvlkI50YXNrX2xpc3TnmoTlgLzlsLHnlLFkYXRh5Yaz5a6aIOS7juiAjOWunueOsOS/ruaUuSDmj4/ov7Ag5pe26Ze05Yqf6IO9XHJcbiAgICAgIHZhciBkYXRhPXt9O1xyXG4gICAgICAvLyBkYXRh5a+56LGh55qE5LiJ5Liq5bGe5oCnXHJcbiAgICAgIGRhdGEuY29udGVudD0kKHRoaXMpLmZpbmQoJ1tuYW1lPWNvbnRlbnRdJykudmFsKCk7XHJcbiAgICAgIGRhdGEuZGVzYz0kKHRoaXMpLmZpbmQoJ1tuYW1lPWRlc2NdJykudmFsKCk7XHJcbiAgICAgIGRhdGEucmVtaW5kPSQodGhpcykuZmluZCgnW25hbWU9cmVtaW5kXScpLnZhbCgpO1xyXG4gICAgICAvLyDmm7TmlrBcclxuICAgICAgdXBkYXRhX3Rhc2tfZGV0YWlsKGluZGV4LCBkYXRhKTtcclxuICAgICAgLy8g6KGo5Y2V5o+Q5Lqk5a6M5ZCO6ZqQ6JePXHJcbiAgICAgICR0YXNrX2RldGFpbC5oaWRlKCk7XHJcbiAgICAgIHRhc2tfZGV0YWlsX21hc2suaGlkZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8g6K+m5oOF5LiK5pa55Y+M5Ye75ZCO5pi+56S65Y+v6L6T5YWl5Yy65Z+fIOiHqui6q+makOiXj1xyXG4gICAgaW5wdXRDb250ZW50PWRldGFpbEZvcm0uZmluZCgnW25hbWU9Y29udGVudF0nKTtcclxuICAgIGNvbnRlbnQ9ZGV0YWlsRm9ybS5maW5kKCcuY29udGVudCcpO1xyXG4gICAgY29udGVudC5vbignZGJsY2xpY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgIGlucHV0Q29udGVudC5zaG93KCk7XHJcbiAgICAgIGNvbnRlbnQuaGlkZSgpO1xyXG4gICAgfSk7XHJcbiAgICAvLyDliKnnlKjml7bpl7TpgInmi6nmj5Lku7ZcclxuICAgIGlucHV0VGltZVBpY2tlcj0kKCcudGltZV9waWNrZXInKS5kYXRldGltZXBpY2tlcigpO1xyXG5cclxuICB9XHJcblxyXG5cclxuICAvLyDkuLrmr4/kuIDmnaHmm7TmlrDlh73mlbAg5Yip55SoZXh0ZW5k5pa55rOV5L+d55WZ5LqG5Y6f5p2l5a+56LGh5Y+I5Y+v5Lul5paw5aKe5a+56LGhIOesrOS4gOS4quWvueixoeaYr+ebruagh+WvueixoSDlkI7pnaLnmoTkuKTkuKrmmK/mupDlr7nosaFcclxuXHJcbiAgZnVuY3Rpb24gdXBkYXRhX3Rhc2tfZGV0YWlsKGluZGV4LGRhdGEpe1xyXG4gICAgaWYoaW5kZXg9PT11bmRlZmluZWR8fCF0YXNrX2xpc3RbaW5kZXhdKSByZXR1cm47XHJcbiAgICB0YXNrX2xpc3RbaW5kZXhdPSQuZXh0ZW5kKHt9LHRhc2tfbGlzdFtpbmRleF0sZGF0YSk7XHJcbiAgICByZWZyZXNoX3Rhc2tfbGlzdCgpO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiAgLy8g5pu05paw5pys5Zyw5a2Y5YKo5Ye95pWwXHJcbiAgZnVuY3Rpb24gcmVmcmVzaF90YXNrX2xpc3QoKXtcclxuICAgIHN0b3JlLnNldCgndGFza19saXN0Jyx0YXNrX2xpc3QpO1xyXG4gICAgcmVuZGVyX3Rhc2tfbGlzdCgpO1xyXG4gIH1cclxuICAvLyDmr4/kuIDmnaHmlbDmiYDlr7nlupTnmoRodG1s57uT5p6EICDlj4LmlbDmmK/kvKDlhaXnmoTmlbDnu4TnmoTlgLzlkozlr7nlupTnmoTluo/liJflj7dcclxuICBmdW5jdGlvbiB0YXNrX2xpc3RfaXRlbShkYXRhLGluZGV4KXtcclxuICAgIGlmKCFkYXRhfHwhaW5kZXgpIHJldHVybjtcclxuICAgIHZhciBsaXN0X2l0ZW1fdHBsPVxyXG4gICAgYCAgPGRpdiBjbGFzcz1cInRhc2staXRlbVwiIGRhdGEtaW5kZXg9JHtpbmRleH0+XHJcbiAgICA8c3Bhbj48aW5wdXQgJHtkYXRhLmNvbXBsZXRlID8gJ2NoZWNrZWQnIDonJyB9IGNsYXNzPVwidGFza19jb21wbGV0ZWRcIiB0eXBlPVwiY2hlY2tib3hcIj48L3NwYW4+XHJcbiAgICA8c3BhbiBjbGFzcz1cInRhc2stY29udGVudFwiPiR7ZGF0YS5jb250ZW50fTwvc3Bhbj5cclxuICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uIGRlbGV0ZVwiPuWIoOmZpDwvc3Bhbj5cclxuICAgIDxzcGFuIGNsYXNzPVwiYWN0aW9uIGRldGFpbFwiPuivpuaDhTwvc3Bhbj5cclxuICAgIDwvZGl2PmAgO1xyXG4gICAgcmV0dXJuICQobGlzdF9pdGVtX3RwbCkgO1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxufSkoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2pzL2Jhc2UuanMiLCJ2YXIgZW5naW5lID0gcmVxdWlyZSgnLi4vc3JjL3N0b3JlLWVuZ2luZScpXG5cbnZhciBzdG9yYWdlcyA9IHJlcXVpcmUoJy4uL3N0b3JhZ2VzL2FsbCcpXG52YXIgcGx1Z2lucyA9IFtyZXF1aXJlKCcuLi9wbHVnaW5zL2pzb24yJyldXG5cbm1vZHVsZS5leHBvcnRzID0gZW5naW5lLmNyZWF0ZVN0b3JlKHN0b3JhZ2VzLCBwbHVnaW5zKVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+Ly4yLjAuNEBzdG9yZS9kaXN0L3N0b3JlLmxlZ2FjeS5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpXG52YXIgc2xpY2UgPSB1dGlsLnNsaWNlXG52YXIgcGx1Y2sgPSB1dGlsLnBsdWNrXG52YXIgZWFjaCA9IHV0aWwuZWFjaFxudmFyIGNyZWF0ZSA9IHV0aWwuY3JlYXRlXG52YXIgaXNMaXN0ID0gdXRpbC5pc0xpc3RcbnZhciBpc0Z1bmN0aW9uID0gdXRpbC5pc0Z1bmN0aW9uXG52YXIgaXNPYmplY3QgPSB1dGlsLmlzT2JqZWN0XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGVTdG9yZTogY3JlYXRlU3RvcmUsXG59XG5cbnZhciBzdG9yZUFQSSA9IHtcblx0dmVyc2lvbjogJzIuMC40Jyxcblx0ZW5hYmxlZDogZmFsc2UsXG5cdHN0b3JhZ2U6IG51bGwsXG5cblx0Ly8gYWRkU3RvcmFnZSBhZGRzIGFub3RoZXIgc3RvcmFnZSB0byB0aGlzIHN0b3JlLiBUaGUgc3RvcmVcblx0Ly8gd2lsbCB1c2UgdGhlIGZpcnN0IHN0b3JhZ2UgaXQgcmVjZWl2ZXMgdGhhdCBpcyBlbmFibGVkLCBzb1xuXHQvLyBjYWxsIGFkZFN0b3JhZ2UgaW4gdGhlIG9yZGVyIG9mIHByZWZlcnJlZCBzdG9yYWdlLlxuXHRhZGRTdG9yYWdlOiBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0aWYgKHRoaXMuZW5hYmxlZCkgeyByZXR1cm4gfVxuXHRcdGlmICh0aGlzLl90ZXN0U3RvcmFnZShzdG9yYWdlKSkge1xuXHRcdFx0dGhpcy5fc3RvcmFnZS5yZXNvbHZlZCA9IHN0b3JhZ2Vcblx0XHRcdHRoaXMuZW5hYmxlZCA9IHRydWVcblx0XHRcdHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2UubmFtZVxuXHRcdH1cblx0fSxcblxuXHQvLyBhZGRQbHVnaW4gd2lsbCBhZGQgYSBwbHVnaW4gdG8gdGhpcyBzdG9yZS5cblx0YWRkUGx1Z2luOiBmdW5jdGlvbihwbHVnaW4pIHtcblx0XHR2YXIgc2VsZiA9IHRoaXNcblxuXHRcdC8vIElmIHRoZSBwbHVnaW4gaXMgYW4gYXJyYXksIHRoZW4gYWRkIGFsbCBwbHVnaW5zIGluIHRoZSBhcnJheS5cblx0XHQvLyBUaGlzIGFsbG93cyBmb3IgYSBwbHVnaW4gdG8gZGVwZW5kIG9uIG90aGVyIHBsdWdpbnMuXG5cdFx0aWYgKGlzTGlzdChwbHVnaW4pKSB7XG5cdFx0XHRlYWNoKHBsdWdpbiwgZnVuY3Rpb24ocGx1Z2luKSB7XG5cdFx0XHRcdHNlbGYuYWRkUGx1Z2luKHBsdWdpbilcblx0XHRcdH0pXG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHQvLyBLZWVwIHRyYWNrIG9mIGFsbCBwbHVnaW5zIHdlJ3ZlIHNlZW4gc28gZmFyLCBzbyB0aGF0IHdlXG5cdFx0Ly8gZG9uJ3QgYWRkIGFueSBvZiB0aGVtIHR3aWNlLlxuXHRcdHZhciBzZWVuUGx1Z2luID0gcGx1Y2sodGhpcy5fc2VlblBsdWdpbnMsIGZ1bmN0aW9uKHNlZW5QbHVnaW4pIHsgcmV0dXJuIChwbHVnaW4gPT09IHNlZW5QbHVnaW4pIH0pXG5cdFx0aWYgKHNlZW5QbHVnaW4pIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHR0aGlzLl9zZWVuUGx1Z2lucy5wdXNoKHBsdWdpbilcblxuXHRcdC8vIENoZWNrIHRoYXQgdGhlIHBsdWdpbiBpcyBwcm9wZXJseSBmb3JtZWRcblx0XHRpZiAoIWlzRnVuY3Rpb24ocGx1Z2luKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQbHVnaW5zIG11c3QgYmUgZnVuY3Rpb24gdmFsdWVzIHRoYXQgcmV0dXJuIG9iamVjdHMnKVxuXHRcdH1cblxuXHRcdHZhciBwbHVnaW5Qcm9wZXJ0aWVzID0gcGx1Z2luLmNhbGwodGhpcylcblx0XHRpZiAoIWlzT2JqZWN0KHBsdWdpblByb3BlcnRpZXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1BsdWdpbnMgbXVzdCByZXR1cm4gYW4gb2JqZWN0IG9mIGZ1bmN0aW9uIHByb3BlcnRpZXMnKVxuXHRcdH1cblxuXHRcdC8vIEFkZCB0aGUgcGx1Z2luIGZ1bmN0aW9uIHByb3BlcnRpZXMgdG8gdGhpcyBzdG9yZSBpbnN0YW5jZS5cblx0XHRlYWNoKHBsdWdpblByb3BlcnRpZXMsIGZ1bmN0aW9uKHBsdWdpbkZuUHJvcCwgcHJvcE5hbWUpIHtcblx0XHRcdGlmICghaXNGdW5jdGlvbihwbHVnaW5GblByb3ApKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignQmFkIHBsdWdpbiBwcm9wZXJ0eTogJytwcm9wTmFtZSsnIGZyb20gcGx1Z2luICcrcGx1Z2luLm5hbWUrJy4gUGx1Z2lucyBzaG91bGQgb25seSByZXR1cm4gZnVuY3Rpb25zLicpXG5cdFx0XHR9XG5cdFx0XHRzZWxmLl9hc3NpZ25QbHVnaW5GblByb3AocGx1Z2luRm5Qcm9wLCBwcm9wTmFtZSlcblx0XHR9KVxuXHR9LFxuXG5cdC8vIGdldCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4ga2V5LiBJZiB0aGF0IHZhbHVlXG5cdC8vIGlzIHVuZGVmaW5lZCwgaXQgcmV0dXJucyBvcHRpb25hbERlZmF1bHRWYWx1ZSBpbnN0ZWFkLlxuXHRnZXQ6IGZ1bmN0aW9uKGtleSwgb3B0aW9uYWxEZWZhdWx0VmFsdWUpIHtcblx0XHR2YXIgZGF0YSA9IHRoaXMuX3N0b3JhZ2UoKS5yZWFkKHRoaXMuX25hbWVzcGFjZVByZWZpeCArIGtleSlcblx0XHRyZXR1cm4gdGhpcy5fZGVzZXJpYWxpemUoZGF0YSwgb3B0aW9uYWxEZWZhdWx0VmFsdWUpXG5cdH0sXG5cblx0Ly8gc2V0IHdpbGwgc3RvcmUgdGhlIGdpdmVuIHZhbHVlIGF0IGtleSBhbmQgcmV0dXJucyB2YWx1ZS5cblx0Ly8gQ2FsbGluZyBzZXQgd2l0aCB2YWx1ZSA9PT0gdW5kZWZpbmVkIGlzIGVxdWl2YWxlbnQgdG8gY2FsbGluZyByZW1vdmUuXG5cdHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZW1vdmUoa2V5KVxuXHRcdH1cblx0XHR0aGlzLl9zdG9yYWdlKCkud3JpdGUodGhpcy5fbmFtZXNwYWNlUHJlZml4ICsga2V5LCB0aGlzLl9zZXJpYWxpemUodmFsdWUpKVxuXHRcdHJldHVybiB2YWx1ZVxuXHR9LFxuXG5cdC8vIHJlbW92ZSBkZWxldGVzIHRoZSBrZXkgYW5kIHZhbHVlIHN0b3JlZCBhdCB0aGUgZ2l2ZW4ga2V5LlxuXHRyZW1vdmU6IGZ1bmN0aW9uKGtleSkge1xuXHRcdHRoaXMuX3N0b3JhZ2UoKS5yZW1vdmUodGhpcy5fbmFtZXNwYWNlUHJlZml4ICsga2V5KVxuXHR9LFxuXG5cdC8vIGVhY2ggd2lsbCBjYWxsIHRoZSBnaXZlbiBjYWxsYmFjayBvbmNlIGZvciBlYWNoIGtleS12YWx1ZSBwYWlyXG5cdC8vIGluIHRoaXMgc3RvcmUuXG5cdGVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzXG5cdFx0dGhpcy5fc3RvcmFnZSgpLmVhY2goZnVuY3Rpb24odmFsLCBuYW1lc3BhY2VkS2V5KSB7XG5cdFx0XHRjYWxsYmFjayhzZWxmLl9kZXNlcmlhbGl6ZSh2YWwpLCBuYW1lc3BhY2VkS2V5LnJlcGxhY2Uoc2VsZi5fbmFtZXNwYWNlUmVnZXhwLCAnJykpXG5cdFx0fSlcblx0fSxcblxuXHQvLyBjbGVhckFsbCB3aWxsIHJlbW92ZSBhbGwgdGhlIHN0b3JlZCBrZXktdmFsdWUgcGFpcnMgaW4gdGhpcyBzdG9yZS5cblx0Y2xlYXJBbGw6IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX3N0b3JhZ2UoKS5jbGVhckFsbCgpXG5cdH0sXG5cblx0Ly8gYWRkaXRpb25hbCBmdW5jdGlvbmFsaXR5IHRoYXQgY2FuJ3QgbGl2ZSBpbiBwbHVnaW5zXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cdC8vIGhhc05hbWVzcGFjZSByZXR1cm5zIHRydWUgaWYgdGhpcyBzdG9yZSBpbnN0YW5jZSBoYXMgdGhlIGdpdmVuIG5hbWVzcGFjZS5cblx0aGFzTmFtZXNwYWNlOiBmdW5jdGlvbihuYW1lc3BhY2UpIHtcblx0XHRyZXR1cm4gKHRoaXMuX25hbWVzcGFjZVByZWZpeCA9PSAnX19zdG9yZWpzXycrbmFtZXNwYWNlKydfJylcblx0fSxcblxuXHQvLyBuYW1lc3BhY2UgY2xvbmVzIHRoZSBjdXJyZW50IHN0b3JlIGFuZCBhc3NpZ25zIGl0IHRoZSBnaXZlbiBuYW1lc3BhY2Vcblx0bmFtZXNwYWNlOiBmdW5jdGlvbihuYW1lc3BhY2UpIHtcblx0XHRpZiAoIXRoaXMuX2xlZ2FsTmFtZXNwYWNlLnRlc3QobmFtZXNwYWNlKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdzdG9yZS5qcyBuYW1lc3BhY2VzIGNhbiBvbmx5IGhhdmUgYWxocGFudW1lcmljcyArIHVuZGVyc2NvcmVzIGFuZCBkYXNoZXMnKVxuXHRcdH1cblx0XHQvLyBjcmVhdGUgYSBwcmVmaXggdGhhdCBpcyB2ZXJ5IHVubGlrZWx5IHRvIGNvbGxpZGUgd2l0aCB1bi1uYW1lc3BhY2VkIGtleXNcblx0XHR2YXIgbmFtZXNwYWNlUHJlZml4ID0gJ19fc3RvcmVqc18nK25hbWVzcGFjZSsnXydcblx0XHRyZXR1cm4gY3JlYXRlKHRoaXMsIHtcblx0XHRcdF9uYW1lc3BhY2VQcmVmaXg6IG5hbWVzcGFjZVByZWZpeCxcblx0XHRcdF9uYW1lc3BhY2VSZWdleHA6IG5hbWVzcGFjZVByZWZpeCA/IG5ldyBSZWdFeHAoJ14nK25hbWVzcGFjZVByZWZpeCkgOiBudWxsXG5cdFx0fSlcblx0fSxcblxuXHQvLyBjcmVhdGVTdG9yZSBjcmVhdGVzIGEgc3RvcmUuanMgaW5zdGFuY2Ugd2l0aCB0aGUgZmlyc3Rcblx0Ly8gZnVuY3Rpb25pbmcgc3RvcmFnZSBpbiB0aGUgbGlzdCBvZiBzdG9yYWdlIGNhbmRpZGF0ZXMsXG5cdC8vIGFuZCBhcHBsaWVzIHRoZSB0aGUgZ2l2ZW4gbWl4aW5zIHRvIHRoZSBpbnN0YW5jZS5cblx0Y3JlYXRlU3RvcmU6IGZ1bmN0aW9uKHN0b3JhZ2VzLCBwbHVnaW5zKSB7XG5cdFx0cmV0dXJuIGNyZWF0ZVN0b3JlKHN0b3JhZ2VzLCBwbHVnaW5zKVxuXHR9LFxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdG9yZShzdG9yYWdlcywgcGx1Z2lucykge1xuXHR2YXIgX3ByaXZhdGVTdG9yZVByb3BzID0ge1xuXHRcdF9zZWVuUGx1Z2luczogW10sXG5cdFx0X25hbWVzcGFjZVByZWZpeDogJycsXG5cdFx0X25hbWVzcGFjZVJlZ2V4cDogbnVsbCxcblx0XHRfbGVnYWxOYW1lc3BhY2U6IC9eW2EtekEtWjAtOV9cXC1dKyQvLCAvLyBhbHBoYS1udW1lcmljICsgdW5kZXJzY29yZSBhbmQgZGFzaFxuXG5cdFx0X3N0b3JhZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCF0aGlzLmVuYWJsZWQpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwic3RvcmUuanM6IE5vIHN1cHBvcnRlZCBzdG9yYWdlIGhhcyBiZWVuIGFkZGVkISBcIitcblx0XHRcdFx0XHRcIkFkZCBvbmUgKGUuZyBzdG9yZS5hZGRTdG9yYWdlKHJlcXVpcmUoJ3N0b3JlL3N0b3JhZ2VzL2Nvb2tpZVN0b3JhZ2UnKSkgXCIrXG5cdFx0XHRcdFx0XCJvciB1c2UgYSBidWlsZCB3aXRoIG1vcmUgYnVpbHQtaW4gc3RvcmFnZXMgKGUuZyBcIitcblx0XHRcdFx0XHRcImh0dHBzOi8vZ2l0aHViLmNvbS9tYXJjdXN3ZXN0aW4vc3RvcmUuanMvdHJlZS9tYXN0ZXIvZGlzdC9zdG9yZS5sZWdhY3kubWluLmpzKVwiKVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXMuX3N0b3JhZ2UucmVzb2x2ZWRcblx0XHR9LFxuXG5cdFx0X3Rlc3RTdG9yYWdlOiBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YXIgdGVzdFN0ciA9ICdfX3N0b3JlanNfX3Rlc3RfXydcblx0XHRcdFx0c3RvcmFnZS53cml0ZSh0ZXN0U3RyLCB0ZXN0U3RyKVxuXHRcdFx0XHR2YXIgb2sgPSAoc3RvcmFnZS5yZWFkKHRlc3RTdHIpID09PSB0ZXN0U3RyKVxuXHRcdFx0XHRzdG9yYWdlLnJlbW92ZSh0ZXN0U3RyKVxuXHRcdFx0XHRyZXR1cm4gb2tcblx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0X2Fzc2lnblBsdWdpbkZuUHJvcDogZnVuY3Rpb24ocGx1Z2luRm5Qcm9wLCBwcm9wTmFtZSkge1xuXHRcdFx0dmFyIG9sZEZuID0gdGhpc1twcm9wTmFtZV1cblx0XHRcdHRoaXNbcHJvcE5hbWVdID0gZnVuY3Rpb24gcGx1Z2luRm4oKSB7XG5cdFx0XHRcdHZhciBhcmdzID0gc2xpY2UoYXJndW1lbnRzLCAwKVxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXNcblxuXHRcdFx0XHQvLyBzdXBlcl9mbiBjYWxscyB0aGUgb2xkIGZ1bmN0aW9uIHdoaWNoIHdhcyBvdmVyd3JpdHRlbiBieVxuXHRcdFx0XHQvLyB0aGlzIG1peGluLlxuXHRcdFx0XHRmdW5jdGlvbiBzdXBlcl9mbigpIHtcblx0XHRcdFx0XHRpZiAoIW9sZEZuKSB7IHJldHVybiB9XG5cdFx0XHRcdFx0ZWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKGFyZywgaSkge1xuXHRcdFx0XHRcdFx0YXJnc1tpXSA9IGFyZ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0cmV0dXJuIG9sZEZuLmFwcGx5KHNlbGYsIGFyZ3MpXG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBHaXZlIG1peGluZyBmdW5jdGlvbiBhY2Nlc3MgdG8gc3VwZXJfZm4gYnkgcHJlZml4aW5nIGFsbCBtaXhpbiBmdW5jdGlvblxuXHRcdFx0XHQvLyBhcmd1bWVudHMgd2l0aCBzdXBlcl9mbi5cblx0XHRcdFx0dmFyIG5ld0ZuQXJncyA9IFtzdXBlcl9mbl0uY29uY2F0KGFyZ3MpXG5cblx0XHRcdFx0cmV0dXJuIHBsdWdpbkZuUHJvcC5hcHBseShzZWxmLCBuZXdGbkFyZ3MpXG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdF9zZXJpYWxpemU6IGZ1bmN0aW9uKG9iaikge1xuXHRcdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iailcblx0XHR9LFxuXG5cdFx0X2Rlc2VyaWFsaXplOiBmdW5jdGlvbihzdHJWYWwsIGRlZmF1bHRWYWwpIHtcblx0XHRcdGlmICghc3RyVmFsKSB7IHJldHVybiBkZWZhdWx0VmFsIH1cblx0XHRcdC8vIEl0IGlzIHBvc3NpYmxlIHRoYXQgYSByYXcgc3RyaW5nIHZhbHVlIGhhcyBiZWVuIHByZXZpb3VzbHkgc3RvcmVkXG5cdFx0XHQvLyBpbiBhIHN0b3JhZ2Ugd2l0aG91dCB1c2luZyBzdG9yZS5qcywgbWVhbmluZyBpdCB3aWxsIGJlIGEgcmF3XG5cdFx0XHQvLyBzdHJpbmcgdmFsdWUgaW5zdGVhZCBvZiBhIEpTT04gc2VyaWFsaXplZCBzdHJpbmcuIEJ5IGRlZmF1bHRpbmdcblx0XHRcdC8vIHRvIHRoZSByYXcgc3RyaW5nIHZhbHVlIGluIGNhc2Ugb2YgYSBKU09OIHBhcnNlIGVycm9yLCB3ZSBhbGxvd1xuXHRcdFx0Ly8gZm9yIHBhc3Qgc3RvcmVkIHZhbHVlcyB0byBiZSBmb3J3YXJkcy1jb21wYXRpYmxlIHdpdGggc3RvcmUuanNcblx0XHRcdHZhciB2YWwgPSAnJ1xuXHRcdFx0dHJ5IHsgdmFsID0gSlNPTi5wYXJzZShzdHJWYWwpIH1cblx0XHRcdGNhdGNoKGUpIHsgdmFsID0gc3RyVmFsIH1cblxuXHRcdFx0cmV0dXJuICh2YWwgIT09IHVuZGVmaW5lZCA/IHZhbCA6IGRlZmF1bHRWYWwpXG5cdFx0fSxcblx0fVxuXG5cdHZhciBzdG9yZSA9IGNyZWF0ZShfcHJpdmF0ZVN0b3JlUHJvcHMsIHN0b3JlQVBJKVxuXHRlYWNoKHN0b3JhZ2VzLCBmdW5jdGlvbihzdG9yYWdlKSB7XG5cdFx0c3RvcmUuYWRkU3RvcmFnZShzdG9yYWdlKVxuXHR9KVxuXHRlYWNoKHBsdWdpbnMsIGZ1bmN0aW9uKHBsdWdpbikge1xuXHRcdHN0b3JlLmFkZFBsdWdpbihwbHVnaW4pXG5cdH0pXG5cdHJldHVybiBzdG9yZVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+Ly4yLjAuNEBzdG9yZS9zcmMvc3RvcmUtZW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhc3NpZ24gPSBtYWtlX2Fzc2lnbigpXG52YXIgY3JlYXRlID0gbWFrZV9jcmVhdGUoKVxudmFyIHRyaW0gPSBtYWtlX3RyaW0oKVxudmFyIEdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IGdsb2JhbClcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGFzc2lnbjogYXNzaWduLFxuXHRjcmVhdGU6IGNyZWF0ZSxcblx0dHJpbTogdHJpbSxcblx0YmluZDogYmluZCxcblx0c2xpY2U6IHNsaWNlLFxuXHRlYWNoOiBlYWNoLFxuXHRtYXA6IG1hcCxcblx0cGx1Y2s6IHBsdWNrLFxuXHRpc0xpc3Q6IGlzTGlzdCxcblx0aXNGdW5jdGlvbjogaXNGdW5jdGlvbixcblx0aXNPYmplY3Q6IGlzT2JqZWN0LFxuXHRHbG9iYWw6IEdsb2JhbCxcbn1cblxuZnVuY3Rpb24gbWFrZV9hc3NpZ24oKSB7XG5cdGlmIChPYmplY3QuYXNzaWduKSB7XG5cdFx0cmV0dXJuIE9iamVjdC5hc3NpZ25cblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gc2hpbUFzc2lnbihvYmosIHByb3BzMSwgcHJvcHMyLCBldGMpIHtcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGVhY2goT2JqZWN0KGFyZ3VtZW50c1tpXSksIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG5cdFx0XHRcdFx0b2JqW2tleV0gPSB2YWxcblx0XHRcdFx0fSlcblx0XHRcdH1cdFx0XHRcblx0XHRcdHJldHVybiBvYmpcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbWFrZV9jcmVhdGUoKSB7XG5cdGlmIChPYmplY3QuY3JlYXRlKSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZShvYmosIGFzc2lnblByb3BzMSwgYXNzaWduUHJvcHMyLCBldGMpIHtcblx0XHRcdHZhciBhc3NpZ25BcmdzTGlzdCA9IHNsaWNlKGFyZ3VtZW50cywgMSlcblx0XHRcdHJldHVybiBhc3NpZ24uYXBwbHkodGhpcywgW09iamVjdC5jcmVhdGUob2JqKV0uY29uY2F0KGFzc2lnbkFyZ3NMaXN0KSlcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0ZnVuY3Rpb24gRigpIHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8taW5uZXItZGVjbGFyYXRpb25zXG5cdFx0cmV0dXJuIGZ1bmN0aW9uIGNyZWF0ZShvYmosIGFzc2lnblByb3BzMSwgYXNzaWduUHJvcHMyLCBldGMpIHtcblx0XHRcdHZhciBhc3NpZ25BcmdzTGlzdCA9IHNsaWNlKGFyZ3VtZW50cywgMSlcblx0XHRcdEYucHJvdG90eXBlID0gb2JqXG5cdFx0XHRyZXR1cm4gYXNzaWduLmFwcGx5KHRoaXMsIFtuZXcgRigpXS5jb25jYXQoYXNzaWduQXJnc0xpc3QpKVxuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBtYWtlX3RyaW0oKSB7XG5cdGlmIChTdHJpbmcucHJvdG90eXBlLnRyaW0pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gdHJpbShzdHIpIHtcblx0XHRcdHJldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW0uY2FsbChzdHIpXG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBmdW5jdGlvbiB0cmltKHN0cikge1xuXHRcdFx0cmV0dXJuIHN0ci5yZXBsYWNlKC9eW1xcc1xcdUZFRkZcXHhBMF0rfFtcXHNcXHVGRUZGXFx4QTBdKyQvZywgJycpXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGJpbmQob2JqLCBmbikge1xuXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGZuLmFwcGx5KG9iaiwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSlcblx0fVxufVxuXG5mdW5jdGlvbiBzbGljZShhcnIsIGluZGV4KSB7XG5cdHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIsIGluZGV4IHx8IDApXG59XG5cbmZ1bmN0aW9uIGVhY2gob2JqLCBmbikge1xuXHRwbHVjayhvYmosIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG5cdFx0Zm4oa2V5LCB2YWwpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdH0pXG59XG5cbmZ1bmN0aW9uIG1hcChvYmosIGZuKSB7XG5cdHZhciByZXMgPSAoaXNMaXN0KG9iaikgPyBbXSA6IHt9KVxuXHRwbHVjayhvYmosIGZ1bmN0aW9uKHYsIGspIHtcblx0XHRyZXNba10gPSBmbih2LCBrKVxuXHRcdHJldHVybiBmYWxzZVxuXHR9KVxuXHRyZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIHBsdWNrKG9iaiwgZm4pIHtcblx0aWYgKGlzTGlzdChvYmopKSB7XG5cdFx0Zm9yICh2YXIgaT0wOyBpPG9iai5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGZuKG9ialtpXSwgaSkpIHtcblx0XHRcdFx0cmV0dXJuIG9ialtpXVxuXHRcdFx0fVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG5cdFx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0aWYgKGZuKG9ialtrZXldLCBrZXkpKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9ialtrZXldXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gaXNMaXN0KHZhbCkge1xuXHRyZXR1cm4gKHZhbCAhPSBudWxsICYmIHR5cGVvZiB2YWwgIT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsLmxlbmd0aCA9PSAnbnVtYmVyJylcbn1cblxuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWwpIHtcblx0cmV0dXJuIHZhbCAmJiB7fS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSdcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsKSB7XG5cdHJldHVybiB2YWwgJiYge30udG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBPYmplY3RdJ1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+Ly4yLjAuNEBzdG9yZS9zcmMvdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0Ly8gTGlzdGVkIGluIG9yZGVyIG9mIHVzYWdlIHByZWZlcmVuY2Vcblx0J2xvY2FsU3RvcmFnZSc6IHJlcXVpcmUoJy4vbG9jYWxTdG9yYWdlJyksXG5cdCdvbGRGRi1nbG9iYWxTdG9yYWdlJzogcmVxdWlyZSgnLi9vbGRGRi1nbG9iYWxTdG9yYWdlJyksXG5cdCdvbGRJRS11c2VyRGF0YVN0b3JhZ2UnOiByZXF1aXJlKCcuL29sZElFLXVzZXJEYXRhU3RvcmFnZScpLFxuXHQnY29va2llU3RvcmFnZSc6IHJlcXVpcmUoJy4vY29va2llU3RvcmFnZScpLFxuXHQnc2Vzc2lvblN0b3JhZ2UnOiByZXF1aXJlKCcuL3Nlc3Npb25TdG9yYWdlJyksXG5cdCdtZW1vcnlTdG9yYWdlJzogcmVxdWlyZSgnLi9tZW1vcnlTdG9yYWdlJyksXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL2FsbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ2xvY2FsU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxuZnVuY3Rpb24gbG9jYWxTdG9yYWdlKCkge1xuXHRyZXR1cm4gR2xvYmFsLmxvY2FsU3RvcmFnZVxufVxuXG5mdW5jdGlvbiByZWFkKGtleSkge1xuXHRyZXR1cm4gbG9jYWxTdG9yYWdlKCkuZ2V0SXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRyZXR1cm4gbG9jYWxTdG9yYWdlKCkuc2V0SXRlbShrZXksIGRhdGEpXG59XG5cbmZ1bmN0aW9uIGVhY2goZm4pIHtcblx0Zm9yICh2YXIgaSA9IGxvY2FsU3RvcmFnZSgpLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0dmFyIGtleSA9IGxvY2FsU3RvcmFnZSgpLmtleShpKVxuXHRcdGZuKHJlYWQoa2V5KSwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLnJlbW92ZUl0ZW0oa2V5KVxufVxuXG5mdW5jdGlvbiBjbGVhckFsbCgpIHtcblx0cmV0dXJuIGxvY2FsU3RvcmFnZSgpLmNsZWFyKClcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvbG9jYWxTdG9yYWdlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIG9sZEZGLWdsb2JhbFN0b3JhZ2UgcHJvdmlkZXMgc3RvcmFnZSBmb3IgRmlyZWZveFxuLy8gdmVyc2lvbnMgNiBhbmQgNywgd2hlcmUgbm8gbG9jYWxTdG9yYWdlLCBldGNcbi8vIGlzIGF2YWlsYWJsZS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdvbGRGRi1nbG9iYWxTdG9yYWdlJyxcblx0cmVhZDogcmVhZCxcblx0d3JpdGU6IHdyaXRlLFxuXHRlYWNoOiBlYWNoLFxuXHRyZW1vdmU6IHJlbW92ZSxcblx0Y2xlYXJBbGw6IGNsZWFyQWxsLFxufVxuXG52YXIgZ2xvYmFsU3RvcmFnZSA9IEdsb2JhbC5nbG9iYWxTdG9yYWdlXG5cbmZ1bmN0aW9uIHJlYWQoa2V5KSB7XG5cdHJldHVybiBnbG9iYWxTdG9yYWdlW2tleV1cbn1cblxuZnVuY3Rpb24gd3JpdGUoa2V5LCBkYXRhKSB7XG5cdGdsb2JhbFN0b3JhZ2Vba2V5XSA9IGRhdGFcbn1cblxuZnVuY3Rpb24gZWFjaChmbikge1xuXHRmb3IgKHZhciBpID0gZ2xvYmFsU3RvcmFnZS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdHZhciBrZXkgPSBnbG9iYWxTdG9yYWdlLmtleShpKVxuXHRcdGZuKGdsb2JhbFN0b3JhZ2Vba2V5XSwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0cmV0dXJuIGdsb2JhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuXHRlYWNoKGZ1bmN0aW9uKGtleSwgXykge1xuXHRcdGRlbGV0ZSBnbG9iYWxTdG9yYWdlW2tleV1cblx0fSlcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi8uMi4wLjRAc3RvcmUvc3RvcmFnZXMvb2xkRkYtZ2xvYmFsU3RvcmFnZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBvbGRJRS11c2VyRGF0YVN0b3JhZ2UgcHJvdmlkZXMgc3RvcmFnZSBmb3IgSW50ZXJuZXQgRXhwbG9yZXJcbi8vIHZlcnNpb25zIDYgYW5kIDcsIHdoZXJlIG5vIGxvY2FsU3RvcmFnZSwgc2Vzc2lvblN0b3JhZ2UsIGV0Y1xuLy8gaXMgYXZhaWxhYmxlLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ29sZElFLXVzZXJEYXRhU3RvcmFnZScsXG5cdHdyaXRlOiB3cml0ZSxcblx0cmVhZDogcmVhZCxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxudmFyIHN0b3JhZ2VOYW1lID0gJ3N0b3JlanMnXG52YXIgZG9jID0gR2xvYmFsLmRvY3VtZW50XG52YXIgX3dpdGhTdG9yYWdlRWwgPSBfbWFrZUlFU3RvcmFnZUVsRnVuY3Rpb24oKVxudmFyIGRpc2FibGUgPSAoR2xvYmFsLm5hdmlnYXRvciA/IEdsb2JhbC5uYXZpZ2F0b3IudXNlckFnZW50IDogJycpLm1hdGNoKC8gKE1TSUUgOHxNU0lFIDl8TVNJRSAxMClcXC4vKSAvLyBNU0lFIDkueCwgTVNJRSAxMC54XG5cbmZ1bmN0aW9uIHdyaXRlKHVuZml4ZWRLZXksIGRhdGEpIHtcblx0aWYgKGRpc2FibGUpIHsgcmV0dXJuIH1cblx0dmFyIGZpeGVkS2V5ID0gZml4S2V5KHVuZml4ZWRLZXkpXG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHN0b3JhZ2VFbC5zZXRBdHRyaWJ1dGUoZml4ZWRLZXksIGRhdGEpXG5cdFx0c3RvcmFnZUVsLnNhdmUoc3RvcmFnZU5hbWUpXG5cdH0pXG59XG5cbmZ1bmN0aW9uIHJlYWQodW5maXhlZEtleSkge1xuXHRpZiAoZGlzYWJsZSkgeyByZXR1cm4gfVxuXHR2YXIgZml4ZWRLZXkgPSBmaXhLZXkodW5maXhlZEtleSlcblx0dmFyIHJlcyA9IG51bGxcblx0X3dpdGhTdG9yYWdlRWwoZnVuY3Rpb24oc3RvcmFnZUVsKSB7XG5cdFx0cmVzID0gc3RvcmFnZUVsLmdldEF0dHJpYnV0ZShmaXhlZEtleSlcblx0fSlcblx0cmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gc3RvcmFnZUVsLlhNTERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzXG5cdFx0Zm9yICh2YXIgaT1hdHRyaWJ1dGVzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcblx0XHRcdHZhciBhdHRyID0gYXR0cmlidXRlc1tpXVxuXHRcdFx0Y2FsbGJhY2soc3RvcmFnZUVsLmdldEF0dHJpYnV0ZShhdHRyLm5hbWUpLCBhdHRyLm5hbWUpXG5cdFx0fVxuXHR9KVxufVxuXG5mdW5jdGlvbiByZW1vdmUodW5maXhlZEtleSkge1xuXHR2YXIgZml4ZWRLZXkgPSBmaXhLZXkodW5maXhlZEtleSlcblx0X3dpdGhTdG9yYWdlRWwoZnVuY3Rpb24oc3RvcmFnZUVsKSB7XG5cdFx0c3RvcmFnZUVsLnJlbW92ZUF0dHJpYnV0ZShmaXhlZEtleSlcblx0XHRzdG9yYWdlRWwuc2F2ZShzdG9yYWdlTmFtZSlcblx0fSlcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdF93aXRoU3RvcmFnZUVsKGZ1bmN0aW9uKHN0b3JhZ2VFbCkge1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gc3RvcmFnZUVsLlhNTERvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hdHRyaWJ1dGVzXG5cdFx0c3RvcmFnZUVsLmxvYWQoc3RvcmFnZU5hbWUpXG5cdFx0Zm9yICh2YXIgaT1hdHRyaWJ1dGVzLmxlbmd0aC0xOyBpPj0wOyBpLS0pIHtcblx0XHRcdHN0b3JhZ2VFbC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlc1tpXS5uYW1lKVxuXHRcdH1cblx0XHRzdG9yYWdlRWwuc2F2ZShzdG9yYWdlTmFtZSlcblx0fSlcbn1cblxuLy8gSGVscGVyc1xuLy8vLy8vLy8vL1xuXG4vLyBJbiBJRTcsIGtleXMgY2Fubm90IHN0YXJ0IHdpdGggYSBkaWdpdCBvciBjb250YWluIGNlcnRhaW4gY2hhcnMuXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcmN1c3dlc3Rpbi9zdG9yZS5qcy9pc3N1ZXMvNDBcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWFyY3Vzd2VzdGluL3N0b3JlLmpzL2lzc3Vlcy84M1xudmFyIGZvcmJpZGRlbkNoYXJzUmVnZXggPSBuZXcgUmVnRXhwKFwiWyFcXFwiIyQlJicoKSorLC9cXFxcXFxcXDo7PD0+P0BbXFxcXF1eYHt8fX5dXCIsIFwiZ1wiKVxuZnVuY3Rpb24gZml4S2V5KGtleSkge1xuXHRyZXR1cm4ga2V5LnJlcGxhY2UoL15cXGQvLCAnX19fJCYnKS5yZXBsYWNlKGZvcmJpZGRlbkNoYXJzUmVnZXgsICdfX18nKVxufVxuXG5mdW5jdGlvbiBfbWFrZUlFU3RvcmFnZUVsRnVuY3Rpb24oKSB7XG5cdGlmICghZG9jIHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50IHx8ICFkb2MuZG9jdW1lbnRFbGVtZW50LmFkZEJlaGF2aW9yKSB7XG5cdFx0cmV0dXJuIG51bGxcblx0fVxuXHR2YXIgc2NyaXB0VGFnID0gJ3NjcmlwdCcsXG5cdFx0c3RvcmFnZU93bmVyLFxuXHRcdHN0b3JhZ2VDb250YWluZXIsXG5cdFx0c3RvcmFnZUVsXG5cblx0Ly8gU2luY2UgI3VzZXJEYXRhIHN0b3JhZ2UgYXBwbGllcyBvbmx5IHRvIHNwZWNpZmljIHBhdGhzLCB3ZSBuZWVkIHRvXG5cdC8vIHNvbWVob3cgbGluayBvdXIgZGF0YSB0byBhIHNwZWNpZmljIHBhdGguICBXZSBjaG9vc2UgL2Zhdmljb24uaWNvXG5cdC8vIGFzIGEgcHJldHR5IHNhZmUgb3B0aW9uLCBzaW5jZSBhbGwgYnJvd3NlcnMgYWxyZWFkeSBtYWtlIGEgcmVxdWVzdCB0b1xuXHQvLyB0aGlzIFVSTCBhbnl3YXkgYW5kIGJlaW5nIGEgNDA0IHdpbGwgbm90IGh1cnQgdXMgaGVyZS4gIFdlIHdyYXAgYW5cblx0Ly8gaWZyYW1lIHBvaW50aW5nIHRvIHRoZSBmYXZpY29uIGluIGFuIEFjdGl2ZVhPYmplY3QoaHRtbGZpbGUpIG9iamVjdFxuXHQvLyAoc2VlOiBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvYWE3NTI1NzQodj1WUy44NSkuYXNweClcblx0Ly8gc2luY2UgdGhlIGlmcmFtZSBhY2Nlc3MgcnVsZXMgYXBwZWFyIHRvIGFsbG93IGRpcmVjdCBhY2Nlc3MgYW5kXG5cdC8vIG1hbmlwdWxhdGlvbiBvZiB0aGUgZG9jdW1lbnQgZWxlbWVudCwgZXZlbiBmb3IgYSA0MDQgcGFnZS4gIFRoaXNcblx0Ly8gZG9jdW1lbnQgY2FuIGJlIHVzZWQgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBkb2N1bWVudCAod2hpY2ggd291bGRcblx0Ly8gaGF2ZSBiZWVuIGxpbWl0ZWQgdG8gdGhlIGN1cnJlbnQgcGF0aCkgdG8gcGVyZm9ybSAjdXNlckRhdGEgc3RvcmFnZS5cblx0dHJ5IHtcblx0XHQvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAqL1xuXHRcdHN0b3JhZ2VDb250YWluZXIgPSBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKVxuXHRcdHN0b3JhZ2VDb250YWluZXIub3BlbigpXG5cdFx0c3RvcmFnZUNvbnRhaW5lci53cml0ZSgnPCcrc2NyaXB0VGFnKyc+ZG9jdW1lbnQudz13aW5kb3c8Lycrc2NyaXB0VGFnKyc+PGlmcmFtZSBzcmM9XCIvZmF2aWNvbi5pY29cIj48L2lmcmFtZT4nKVxuXHRcdHN0b3JhZ2VDb250YWluZXIuY2xvc2UoKVxuXHRcdHN0b3JhZ2VPd25lciA9IHN0b3JhZ2VDb250YWluZXIudy5mcmFtZXNbMF0uZG9jdW1lbnRcblx0XHRzdG9yYWdlRWwgPSBzdG9yYWdlT3duZXIuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0fSBjYXRjaChlKSB7XG5cdFx0Ly8gc29tZWhvdyBBY3RpdmVYT2JqZWN0IGluc3RhbnRpYXRpb24gZmFpbGVkIChwZXJoYXBzIHNvbWUgc3BlY2lhbFxuXHRcdC8vIHNlY3VyaXR5IHNldHRpbmdzIG9yIG90aGVyd3NlKSwgZmFsbCBiYWNrIHRvIHBlci1wYXRoIHN0b3JhZ2Vcblx0XHRzdG9yYWdlRWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRzdG9yYWdlT3duZXIgPSBkb2MuYm9keVxuXHR9XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHN0b3JlRnVuY3Rpb24pIHtcblx0XHR2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuXHRcdGFyZ3MudW5zaGlmdChzdG9yYWdlRWwpXG5cdFx0Ly8gU2VlIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzMTA4MSh2PVZTLjg1KS5hc3B4XG5cdFx0Ly8gYW5kIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9tczUzMTQyNCh2PVZTLjg1KS5hc3B4XG5cdFx0c3RvcmFnZU93bmVyLmFwcGVuZENoaWxkKHN0b3JhZ2VFbClcblx0XHRzdG9yYWdlRWwuYWRkQmVoYXZpb3IoJyNkZWZhdWx0I3VzZXJEYXRhJylcblx0XHRzdG9yYWdlRWwubG9hZChzdG9yYWdlTmFtZSlcblx0XHRzdG9yZUZ1bmN0aW9uLmFwcGx5KHRoaXMsIGFyZ3MpXG5cdFx0c3RvcmFnZU93bmVyLnJlbW92ZUNoaWxkKHN0b3JhZ2VFbClcblx0XHRyZXR1cm5cblx0fVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+Ly4yLjAuNEBzdG9yZS9zdG9yYWdlcy9vbGRJRS11c2VyRGF0YVN0b3JhZ2UuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gY29va2llU3RvcmFnZSBpcyB1c2VmdWwgU2FmYXJpIHByaXZhdGUgYnJvd3NlciBtb2RlLCB3aGVyZSBsb2NhbFN0b3JhZ2Vcbi8vIGRvZXNuJ3Qgd29yayBidXQgY29va2llcyBkby4gVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBhZG9wdGVkIGZyb21cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TdG9yYWdlL0xvY2FsU3RvcmFnZVxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJy4uL3NyYy91dGlsJylcbnZhciBHbG9iYWwgPSB1dGlsLkdsb2JhbFxudmFyIHRyaW0gPSB1dGlsLnRyaW1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdjb29raWVTdG9yYWdlJyxcblx0cmVhZDogcmVhZCxcblx0d3JpdGU6IHdyaXRlLFxuXHRlYWNoOiBlYWNoLFxuXHRyZW1vdmU6IHJlbW92ZSxcblx0Y2xlYXJBbGw6IGNsZWFyQWxsLFxufVxuXG52YXIgZG9jID0gR2xvYmFsLmRvY3VtZW50XG5cbmZ1bmN0aW9uIHJlYWQoa2V5KSB7XG5cdGlmICgha2V5IHx8ICFfaGFzKGtleSkpIHsgcmV0dXJuIG51bGwgfVxuXHR2YXIgcmVnZXhwU3RyID0gXCIoPzpefC4qO1xcXFxzKilcIiArXG5cdFx0ZXNjYXBlKGtleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgK1xuXHRcdFwiXFxcXHMqXFxcXD1cXFxccyooKD86W147XSg/ITspKSpbXjtdPykuKlwiXG5cdHJldHVybiB1bmVzY2FwZShkb2MuY29va2llLnJlcGxhY2UobmV3IFJlZ0V4cChyZWdleHBTdHIpLCBcIiQxXCIpKVxufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdHZhciBjb29raWVzID0gZG9jLmNvb2tpZS5zcGxpdCgvOyA/L2cpXG5cdGZvciAodmFyIGkgPSBjb29raWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0aWYgKCF0cmltKGNvb2tpZXNbaV0pKSB7XG5cdFx0XHRjb250aW51ZVxuXHRcdH1cblx0XHR2YXIga3ZwID0gY29va2llc1tpXS5zcGxpdCgnPScpXG5cdFx0dmFyIGtleSA9IHVuZXNjYXBlKGt2cFswXSlcblx0XHR2YXIgdmFsID0gdW5lc2NhcGUoa3ZwWzFdKVxuXHRcdGNhbGxiYWNrKHZhbCwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRpZigha2V5KSB7IHJldHVybiB9XG5cdGRvYy5jb29raWUgPSBlc2NhcGUoa2V5KSArIFwiPVwiICsgZXNjYXBlKGRhdGEpICsgXCI7IGV4cGlyZXM9VHVlLCAxOSBKYW4gMjAzOCAwMzoxNDowNyBHTVQ7IHBhdGg9L1wiXG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0aWYgKCFrZXkgfHwgIV9oYXMoa2V5KSkge1xuXHRcdHJldHVyblxuXHR9XG5cdGRvYy5jb29raWUgPSBlc2NhcGUoa2V5KSArIFwiPTsgZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVDsgcGF0aD0vXCJcbn1cblxuZnVuY3Rpb24gY2xlYXJBbGwoKSB7XG5cdGVhY2goZnVuY3Rpb24oXywga2V5KSB7XG5cdFx0cmVtb3ZlKGtleSlcblx0fSlcbn1cblxuZnVuY3Rpb24gX2hhcyhrZXkpIHtcblx0cmV0dXJuIChuZXcgUmVnRXhwKFwiKD86Xnw7XFxcXHMqKVwiICsgZXNjYXBlKGtleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvYy5jb29raWUpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL2Nvb2tpZVN0b3JhZ2UuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHV0aWwgPSByZXF1aXJlKCcuLi9zcmMvdXRpbCcpXG52YXIgR2xvYmFsID0gdXRpbC5HbG9iYWxcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5hbWU6ICdzZXNzaW9uU3RvcmFnZScsXG5cdHJlYWQ6IHJlYWQsXG5cdHdyaXRlOiB3cml0ZSxcblx0ZWFjaDogZWFjaCxcblx0cmVtb3ZlOiByZW1vdmUsXG5cdGNsZWFyQWxsOiBjbGVhckFsbCxcbn1cblxuZnVuY3Rpb24gc2Vzc2lvblN0b3JhZ2UoKSB7XG5cdHJldHVybiBHbG9iYWwuc2Vzc2lvblN0b3JhZ2Vcbn1cblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIHNlc3Npb25TdG9yYWdlKCkuZ2V0SXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIHdyaXRlKGtleSwgZGF0YSkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5zZXRJdGVtKGtleSwgZGF0YSlcbn1cblxuZnVuY3Rpb24gZWFjaChmbikge1xuXHRmb3IgKHZhciBpID0gc2Vzc2lvblN0b3JhZ2UoKS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdHZhciBrZXkgPSBzZXNzaW9uU3RvcmFnZSgpLmtleShpKVxuXHRcdGZuKHJlYWQoa2V5KSwga2V5KVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0cmV0dXJuIHNlc3Npb25TdG9yYWdlKCkucmVtb3ZlSXRlbShrZXkpXG59XG5cbmZ1bmN0aW9uIGNsZWFyQWxsKCkge1xuXHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UoKS5jbGVhcigpXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL3Nlc3Npb25TdG9yYWdlLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIG1lbW9yeVN0b3JhZ2UgaXMgYSB1c2VmdWwgbGFzdCBmYWxsYmFjayB0byBlbnN1cmUgdGhhdCB0aGUgc3RvcmVcbi8vIGlzIGZ1bmN0aW9ucyAobWVhbmluZyBzdG9yZS5nZXQoKSwgc3RvcmUuc2V0KCksIGV0YyB3aWxsIGFsbCBmdW5jdGlvbikuXG4vLyBIb3dldmVyLCBzdG9yZWQgdmFsdWVzIHdpbGwgbm90IHBlcnNpc3Qgd2hlbiB0aGUgYnJvd3NlciBuYXZpZ2F0ZXMgdG9cbi8vIGEgbmV3IHBhZ2Ugb3IgcmVsb2FkcyB0aGUgY3VycmVudCBwYWdlLlxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bmFtZTogJ21lbW9yeVN0b3JhZ2UnLFxuXHRyZWFkOiByZWFkLFxuXHR3cml0ZTogd3JpdGUsXG5cdGVhY2g6IGVhY2gsXG5cdHJlbW92ZTogcmVtb3ZlLFxuXHRjbGVhckFsbDogY2xlYXJBbGwsXG59XG5cbnZhciBtZW1vcnlTdG9yYWdlID0ge31cblxuZnVuY3Rpb24gcmVhZChrZXkpIHtcblx0cmV0dXJuIG1lbW9yeVN0b3JhZ2Vba2V5XVxufVxuXG5mdW5jdGlvbiB3cml0ZShrZXksIGRhdGEpIHtcblx0bWVtb3J5U3RvcmFnZVtrZXldID0gZGF0YVxufVxuXG5mdW5jdGlvbiBlYWNoKGNhbGxiYWNrKSB7XG5cdGZvciAodmFyIGtleSBpbiBtZW1vcnlTdG9yYWdlKSB7XG5cdFx0aWYgKG1lbW9yeVN0b3JhZ2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0Y2FsbGJhY2sobWVtb3J5U3RvcmFnZVtrZXldLCBrZXkpXG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShrZXkpIHtcblx0ZGVsZXRlIG1lbW9yeVN0b3JhZ2Vba2V5XVxufVxuXG5mdW5jdGlvbiBjbGVhckFsbChrZXkpIHtcblx0bWVtb3J5U3RvcmFnZSA9IHt9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3N0b3JhZ2VzL21lbW9yeVN0b3JhZ2UuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ganNvbjJQbHVnaW5cblxuZnVuY3Rpb24ganNvbjJQbHVnaW4oKSB7XG5cdHJlcXVpcmUoJy4vbGliL2pzb24yJylcblx0cmV0dXJuIHt9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3BsdWdpbnMvanNvbjIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vICBqc29uMi5qc1xuLy8gIDIwMTYtMTAtMjhcbi8vICBQdWJsaWMgRG9tYWluLlxuLy8gIE5PIFdBUlJBTlRZIEVYUFJFU1NFRCBPUiBJTVBMSUVELiBVU0UgQVQgWU9VUiBPV04gUklTSy5cbi8vICBTZWUgaHR0cDovL3d3dy5KU09OLm9yZy9qcy5odG1sXG4vLyAgVGhpcyBjb2RlIHNob3VsZCBiZSBtaW5pZmllZCBiZWZvcmUgZGVwbG95bWVudC5cbi8vICBTZWUgaHR0cDovL2phdmFzY3JpcHQuY3JvY2tmb3JkLmNvbS9qc21pbi5odG1sXG5cbi8vICBVU0UgWU9VUiBPV04gQ09QWS4gSVQgSVMgRVhUUkVNRUxZIFVOV0lTRSBUTyBMT0FEIENPREUgRlJPTSBTRVJWRVJTIFlPVSBET1xuLy8gIE5PVCBDT05UUk9MLlxuXG4vLyAgVGhpcyBmaWxlIGNyZWF0ZXMgYSBnbG9iYWwgSlNPTiBvYmplY3QgY29udGFpbmluZyB0d28gbWV0aG9kczogc3RyaW5naWZ5XG4vLyAgYW5kIHBhcnNlLiBUaGlzIGZpbGUgcHJvdmlkZXMgdGhlIEVTNSBKU09OIGNhcGFiaWxpdHkgdG8gRVMzIHN5c3RlbXMuXG4vLyAgSWYgYSBwcm9qZWN0IG1pZ2h0IHJ1biBvbiBJRTggb3IgZWFybGllciwgdGhlbiB0aGlzIGZpbGUgc2hvdWxkIGJlIGluY2x1ZGVkLlxuLy8gIFRoaXMgZmlsZSBkb2VzIG5vdGhpbmcgb24gRVM1IHN5c3RlbXMuXG5cbi8vICAgICAgSlNPTi5zdHJpbmdpZnkodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSlcbi8vICAgICAgICAgIHZhbHVlICAgICAgIGFueSBKYXZhU2NyaXB0IHZhbHVlLCB1c3VhbGx5IGFuIG9iamVjdCBvciBhcnJheS5cbi8vICAgICAgICAgIHJlcGxhY2VyICAgIGFuIG9wdGlvbmFsIHBhcmFtZXRlciB0aGF0IGRldGVybWluZXMgaG93IG9iamVjdFxuLy8gICAgICAgICAgICAgICAgICAgICAgdmFsdWVzIGFyZSBzdHJpbmdpZmllZCBmb3Igb2JqZWN0cy4gSXQgY2FuIGJlIGFcbi8vICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MuXG4vLyAgICAgICAgICBzcGFjZSAgICAgICBhbiBvcHRpb25hbCBwYXJhbWV0ZXIgdGhhdCBzcGVjaWZpZXMgdGhlIGluZGVudGF0aW9uXG4vLyAgICAgICAgICAgICAgICAgICAgICBvZiBuZXN0ZWQgc3RydWN0dXJlcy4gSWYgaXQgaXMgb21pdHRlZCwgdGhlIHRleHQgd2lsbFxuLy8gICAgICAgICAgICAgICAgICAgICAgYmUgcGFja2VkIHdpdGhvdXQgZXh0cmEgd2hpdGVzcGFjZS4gSWYgaXQgaXMgYSBudW1iZXIsXG4vLyAgICAgICAgICAgICAgICAgICAgICBpdCB3aWxsIHNwZWNpZnkgdGhlIG51bWJlciBvZiBzcGFjZXMgdG8gaW5kZW50IGF0IGVhY2hcbi8vICAgICAgICAgICAgICAgICAgICAgIGxldmVsLiBJZiBpdCBpcyBhIHN0cmluZyAoc3VjaCBhcyBcIlxcdFwiIG9yIFwiJm5ic3A7XCIpLFxuLy8gICAgICAgICAgICAgICAgICAgICAgaXQgY29udGFpbnMgdGhlIGNoYXJhY3RlcnMgdXNlZCB0byBpbmRlbnQgYXQgZWFjaCBsZXZlbC5cbi8vICAgICAgICAgIFRoaXMgbWV0aG9kIHByb2R1Y2VzIGEgSlNPTiB0ZXh0IGZyb20gYSBKYXZhU2NyaXB0IHZhbHVlLlxuLy8gICAgICAgICAgV2hlbiBhbiBvYmplY3QgdmFsdWUgaXMgZm91bmQsIGlmIHRoZSBvYmplY3QgY29udGFpbnMgYSB0b0pTT05cbi8vICAgICAgICAgIG1ldGhvZCwgaXRzIHRvSlNPTiBtZXRob2Qgd2lsbCBiZSBjYWxsZWQgYW5kIHRoZSByZXN1bHQgd2lsbCBiZVxuLy8gICAgICAgICAgc3RyaW5naWZpZWQuIEEgdG9KU09OIG1ldGhvZCBkb2VzIG5vdCBzZXJpYWxpemU6IGl0IHJldHVybnMgdGhlXG4vLyAgICAgICAgICB2YWx1ZSByZXByZXNlbnRlZCBieSB0aGUgbmFtZS92YWx1ZSBwYWlyIHRoYXQgc2hvdWxkIGJlIHNlcmlhbGl6ZWQsXG4vLyAgICAgICAgICBvciB1bmRlZmluZWQgaWYgbm90aGluZyBzaG91bGQgYmUgc2VyaWFsaXplZC4gVGhlIHRvSlNPTiBtZXRob2Rcbi8vICAgICAgICAgIHdpbGwgYmUgcGFzc2VkIHRoZSBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoZSB2YWx1ZSwgYW5kIHRoaXMgd2lsbCBiZVxuLy8gICAgICAgICAgYm91bmQgdG8gdGhlIHZhbHVlLlxuXG4vLyAgICAgICAgICBGb3IgZXhhbXBsZSwgdGhpcyB3b3VsZCBzZXJpYWxpemUgRGF0ZXMgYXMgSVNPIHN0cmluZ3MuXG5cbi8vICAgICAgICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGYobikge1xuLy8gICAgICAgICAgICAgICAgICAgICAgLy8gRm9ybWF0IGludGVnZXJzIHRvIGhhdmUgYXQgbGVhc3QgdHdvIGRpZ2l0cy5cbi8vICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAobiA8IDEwKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgID8gXCIwXCIgKyBuXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgOiBuO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFVUQ0Z1bGxZZWFyKCkgICArIFwiLVwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTW9udGgoKSArIDEpICsgXCItXCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENEYXRlKCkpICAgICAgKyBcIlRcIiArXG4vLyAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ0hvdXJzKCkpICAgICArIFwiOlwiICtcbi8vICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDTWludXRlcygpKSAgICsgXCI6XCIgK1xuLy8gICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENTZWNvbmRzKCkpICAgKyBcIlpcIjtcbi8vICAgICAgICAgICAgICB9O1xuXG4vLyAgICAgICAgICBZb3UgY2FuIHByb3ZpZGUgYW4gb3B0aW9uYWwgcmVwbGFjZXIgbWV0aG9kLiBJdCB3aWxsIGJlIHBhc3NlZCB0aGVcbi8vICAgICAgICAgIGtleSBhbmQgdmFsdWUgb2YgZWFjaCBtZW1iZXIsIHdpdGggdGhpcyBib3VuZCB0byB0aGUgY29udGFpbmluZ1xuLy8gICAgICAgICAgb2JqZWN0LiBUaGUgdmFsdWUgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHlvdXIgbWV0aG9kIHdpbGwgYmVcbi8vICAgICAgICAgIHNlcmlhbGl6ZWQuIElmIHlvdXIgbWV0aG9kIHJldHVybnMgdW5kZWZpbmVkLCB0aGVuIHRoZSBtZW1iZXIgd2lsbFxuLy8gICAgICAgICAgYmUgZXhjbHVkZWQgZnJvbSB0aGUgc2VyaWFsaXphdGlvbi5cblxuLy8gICAgICAgICAgSWYgdGhlIHJlcGxhY2VyIHBhcmFtZXRlciBpcyBhbiBhcnJheSBvZiBzdHJpbmdzLCB0aGVuIGl0IHdpbGwgYmVcbi8vICAgICAgICAgIHVzZWQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHNlcmlhbGl6ZWQuIEl0IGZpbHRlcnMgdGhlIHJlc3VsdHNcbi8vICAgICAgICAgIHN1Y2ggdGhhdCBvbmx5IG1lbWJlcnMgd2l0aCBrZXlzIGxpc3RlZCBpbiB0aGUgcmVwbGFjZXIgYXJyYXkgYXJlXG4vLyAgICAgICAgICBzdHJpbmdpZmllZC5cblxuLy8gICAgICAgICAgVmFsdWVzIHRoYXQgZG8gbm90IGhhdmUgSlNPTiByZXByZXNlbnRhdGlvbnMsIHN1Y2ggYXMgdW5kZWZpbmVkIG9yXG4vLyAgICAgICAgICBmdW5jdGlvbnMsIHdpbGwgbm90IGJlIHNlcmlhbGl6ZWQuIFN1Y2ggdmFsdWVzIGluIG9iamVjdHMgd2lsbCBiZVxuLy8gICAgICAgICAgZHJvcHBlZDsgaW4gYXJyYXlzIHRoZXkgd2lsbCBiZSByZXBsYWNlZCB3aXRoIG51bGwuIFlvdSBjYW4gdXNlXG4vLyAgICAgICAgICBhIHJlcGxhY2VyIGZ1bmN0aW9uIHRvIHJlcGxhY2UgdGhvc2Ugd2l0aCBKU09OIHZhbHVlcy5cblxuLy8gICAgICAgICAgSlNPTi5zdHJpbmdpZnkodW5kZWZpbmVkKSByZXR1cm5zIHVuZGVmaW5lZC5cblxuLy8gICAgICAgICAgVGhlIG9wdGlvbmFsIHNwYWNlIHBhcmFtZXRlciBwcm9kdWNlcyBhIHN0cmluZ2lmaWNhdGlvbiBvZiB0aGVcbi8vICAgICAgICAgIHZhbHVlIHRoYXQgaXMgZmlsbGVkIHdpdGggbGluZSBicmVha3MgYW5kIGluZGVudGF0aW9uIHRvIG1ha2UgaXRcbi8vICAgICAgICAgIGVhc2llciB0byByZWFkLlxuXG4vLyAgICAgICAgICBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbm9uLWVtcHR5IHN0cmluZywgdGhlbiB0aGF0IHN0cmluZyB3aWxsXG4vLyAgICAgICAgICBiZSB1c2VkIGZvciBpbmRlbnRhdGlvbi4gSWYgdGhlIHNwYWNlIHBhcmFtZXRlciBpcyBhIG51bWJlciwgdGhlblxuLy8gICAgICAgICAgdGhlIGluZGVudGF0aW9uIHdpbGwgYmUgdGhhdCBtYW55IHNwYWNlcy5cblxuLy8gICAgICAgICAgRXhhbXBsZTpcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtcImVcIiwge3BsdXJpYnVzOiBcInVudW1cIn1dKTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcImVcIix7XCJwbHVyaWJ1c1wiOlwidW51bVwifV0nXG5cbi8vICAgICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShbXCJlXCIsIHtwbHVyaWJ1czogXCJ1bnVtXCJ9XSwgbnVsbCwgXCJcXHRcIik7XG4vLyAgICAgICAgICAvLyB0ZXh0IGlzICdbXFxuXFx0XCJlXCIsXFxuXFx0e1xcblxcdFxcdFwicGx1cmlidXNcIjogXCJ1bnVtXCJcXG5cXHR9XFxuXSdcblxuLy8gICAgICAgICAgdGV4dCA9IEpTT04uc3RyaW5naWZ5KFtuZXcgRGF0ZSgpXSwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICByZXR1cm4gdGhpc1trZXldIGluc3RhbmNlb2YgRGF0ZVxuLy8gICAgICAgICAgICAgICAgICA/IFwiRGF0ZShcIiArIHRoaXNba2V5XSArIFwiKVwiXG4vLyAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4vLyAgICAgICAgICB9KTtcbi8vICAgICAgICAgIC8vIHRleHQgaXMgJ1tcIkRhdGUoLS0tY3VycmVudCB0aW1lLS0tKVwiXSdcblxuLy8gICAgICBKU09OLnBhcnNlKHRleHQsIHJldml2ZXIpXG4vLyAgICAgICAgICBUaGlzIG1ldGhvZCBwYXJzZXMgYSBKU09OIHRleHQgdG8gcHJvZHVjZSBhbiBvYmplY3Qgb3IgYXJyYXkuXG4vLyAgICAgICAgICBJdCBjYW4gdGhyb3cgYSBTeW50YXhFcnJvciBleGNlcHRpb24uXG5cbi8vICAgICAgICAgIFRoZSBvcHRpb25hbCByZXZpdmVyIHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uIHRoYXQgY2FuIGZpbHRlciBhbmRcbi8vICAgICAgICAgIHRyYW5zZm9ybSB0aGUgcmVzdWx0cy4gSXQgcmVjZWl2ZXMgZWFjaCBvZiB0aGUga2V5cyBhbmQgdmFsdWVzLFxuLy8gICAgICAgICAgYW5kIGl0cyByZXR1cm4gdmFsdWUgaXMgdXNlZCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgd2hhdCBpdCByZWNlaXZlZCwgdGhlbiB0aGUgc3RydWN0dXJlIGlzIG5vdCBtb2RpZmllZC5cbi8vICAgICAgICAgIElmIGl0IHJldHVybnMgdW5kZWZpbmVkIHRoZW4gdGhlIG1lbWJlciBpcyBkZWxldGVkLlxuXG4vLyAgICAgICAgICBFeGFtcGxlOlxuXG4vLyAgICAgICAgICAvLyBQYXJzZSB0aGUgdGV4dC4gVmFsdWVzIHRoYXQgbG9vayBsaWtlIElTTyBkYXRlIHN0cmluZ3Mgd2lsbFxuLy8gICAgICAgICAgLy8gYmUgY29udmVydGVkIHRvIERhdGUgb2JqZWN0cy5cblxuLy8gICAgICAgICAgbXlEYXRhID0gSlNPTi5wYXJzZSh0ZXh0LCBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICAgICAgIHZhciBhO1xuLy8gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIpIHtcbi8vICAgICAgICAgICAgICAgICAgYSA9XG4vLyAgIC9eKFxcZHs0fSktKFxcZHsyfSktKFxcZHsyfSlUKFxcZHsyfSk6KFxcZHsyfSk6KFxcZHsyfSg/OlxcLlxcZCopPylaJC8uZXhlYyh2YWx1ZSk7XG4vLyAgICAgICAgICAgICAgICAgIGlmIChhKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IERhdGUoRGF0ZS5VVEMoK2FbMV0sICthWzJdIC0gMSwgK2FbM10sICthWzRdLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICthWzVdLCArYVs2XSkpO1xuLy8gICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbi8vICAgICAgICAgIH0pO1xuXG4vLyAgICAgICAgICBteURhdGEgPSBKU09OLnBhcnNlKCdbXCJEYXRlKDA5LzA5LzIwMDEpXCJdJywgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgICAgICB2YXIgZDtcbi8vICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgwLCA1KSA9PT0gXCJEYXRlKFwiICYmXG4vLyAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS5zbGljZSgtMSkgPT09IFwiKVwiKSB7XG4vLyAgICAgICAgICAgICAgICAgIGQgPSBuZXcgRGF0ZSh2YWx1ZS5zbGljZSg1LCAtMSkpO1xuLy8gICAgICAgICAgICAgICAgICBpZiAoZCkge1xuLy8gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQ7XG4vLyAgICAgICAgICAgICAgICAgIH1cbi8vICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuLy8gICAgICAgICAgfSk7XG5cbi8vICBUaGlzIGlzIGEgcmVmZXJlbmNlIGltcGxlbWVudGF0aW9uLiBZb3UgYXJlIGZyZWUgdG8gY29weSwgbW9kaWZ5LCBvclxuLy8gIHJlZGlzdHJpYnV0ZS5cblxuLypqc2xpbnRcbiAgICBldmFsLCBmb3IsIHRoaXNcbiovXG5cbi8qcHJvcGVydHlcbiAgICBKU09OLCBhcHBseSwgY2FsbCwgY2hhckNvZGVBdCwgZ2V0VVRDRGF0ZSwgZ2V0VVRDRnVsbFllYXIsIGdldFVUQ0hvdXJzLFxuICAgIGdldFVUQ01pbnV0ZXMsIGdldFVUQ01vbnRoLCBnZXRVVENTZWNvbmRzLCBoYXNPd25Qcm9wZXJ0eSwgam9pbixcbiAgICBsYXN0SW5kZXgsIGxlbmd0aCwgcGFyc2UsIHByb3RvdHlwZSwgcHVzaCwgcmVwbGFjZSwgc2xpY2UsIHN0cmluZ2lmeSxcbiAgICB0ZXN0LCB0b0pTT04sIHRvU3RyaW5nLCB2YWx1ZU9mXG4qL1xuXG5cbi8vIENyZWF0ZSBhIEpTT04gb2JqZWN0IG9ubHkgaWYgb25lIGRvZXMgbm90IGFscmVhZHkgZXhpc3QuIFdlIGNyZWF0ZSB0aGVcbi8vIG1ldGhvZHMgaW4gYSBjbG9zdXJlIHRvIGF2b2lkIGNyZWF0aW5nIGdsb2JhbCB2YXJpYWJsZXMuXG5cbmlmICh0eXBlb2YgSlNPTiAhPT0gXCJvYmplY3RcIikge1xuICAgIEpTT04gPSB7fTtcbn1cblxuKGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciByeF9vbmUgPSAvXltcXF0sOnt9XFxzXSokLztcbiAgICB2YXIgcnhfdHdvID0gL1xcXFwoPzpbXCJcXFxcXFwvYmZucnRdfHVbMC05YS1mQS1GXXs0fSkvZztcbiAgICB2YXIgcnhfdGhyZWUgPSAvXCJbXlwiXFxcXFxcblxccl0qXCJ8dHJ1ZXxmYWxzZXxudWxsfC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/L2c7XG4gICAgdmFyIHJ4X2ZvdXIgPSAvKD86Xnw6fCwpKD86XFxzKlxcWykrL2c7XG4gICAgdmFyIHJ4X2VzY2FwYWJsZSA9IC9bXFxcXFwiXFx1MDAwMC1cXHUwMDFmXFx1MDA3Zi1cXHUwMDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgdmFyIHJ4X2Rhbmdlcm91cyA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xuXG4gICAgZnVuY3Rpb24gZihuKSB7XG4gICAgICAgIC8vIEZvcm1hdCBpbnRlZ2VycyB0byBoYXZlIGF0IGxlYXN0IHR3byBkaWdpdHMuXG4gICAgICAgIHJldHVybiBuIDwgMTBcbiAgICAgICAgICAgID8gXCIwXCIgKyBuXG4gICAgICAgICAgICA6IG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdGhpc192YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVPZigpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9KU09OICE9PSBcImZ1bmN0aW9uXCIpIHtcblxuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBpc0Zpbml0ZSh0aGlzLnZhbHVlT2YoKSlcbiAgICAgICAgICAgICAgICA/IHRoaXMuZ2V0VVRDRnVsbFllYXIoKSArIFwiLVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNb250aCgpICsgMSkgKyBcIi1cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBmKHRoaXMuZ2V0VVRDRGF0ZSgpKSArIFwiVFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENIb3VycygpKSArIFwiOlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGYodGhpcy5nZXRVVENNaW51dGVzKCkpICsgXCI6XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZih0aGlzLmdldFVUQ1NlY29uZHMoKSkgKyBcIlpcIlxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICBCb29sZWFuLnByb3RvdHlwZS50b0pTT04gPSB0aGlzX3ZhbHVlO1xuICAgICAgICBOdW1iZXIucHJvdG90eXBlLnRvSlNPTiA9IHRoaXNfdmFsdWU7XG4gICAgICAgIFN0cmluZy5wcm90b3R5cGUudG9KU09OID0gdGhpc192YWx1ZTtcbiAgICB9XG5cbiAgICB2YXIgZ2FwO1xuICAgIHZhciBpbmRlbnQ7XG4gICAgdmFyIG1ldGE7XG4gICAgdmFyIHJlcDtcblxuXG4gICAgZnVuY3Rpb24gcXVvdGUoc3RyaW5nKSB7XG5cbi8vIElmIHRoZSBzdHJpbmcgY29udGFpbnMgbm8gY29udHJvbCBjaGFyYWN0ZXJzLCBubyBxdW90ZSBjaGFyYWN0ZXJzLCBhbmQgbm9cbi8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXG4vLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcbi8vIHNlcXVlbmNlcy5cblxuICAgICAgICByeF9lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcbiAgICAgICAgcmV0dXJuIHJ4X2VzY2FwYWJsZS50ZXN0KHN0cmluZylcbiAgICAgICAgICAgID8gXCJcXFwiXCIgKyBzdHJpbmcucmVwbGFjZShyeF9lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBtZXRhW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICA/IGNcbiAgICAgICAgICAgICAgICAgICAgOiBcIlxcXFx1XCIgKyAoXCIwMDAwXCIgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgICAgICB9KSArIFwiXFxcIlwiXG4gICAgICAgICAgICA6IFwiXFxcIlwiICsgc3RyaW5nICsgXCJcXFwiXCI7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzdHIoa2V5LCBob2xkZXIpIHtcblxuLy8gUHJvZHVjZSBhIHN0cmluZyBmcm9tIGhvbGRlcltrZXldLlxuXG4gICAgICAgIHZhciBpOyAgICAgICAgICAvLyBUaGUgbG9vcCBjb3VudGVyLlxuICAgICAgICB2YXIgazsgICAgICAgICAgLy8gVGhlIG1lbWJlciBrZXkuXG4gICAgICAgIHZhciB2OyAgICAgICAgICAvLyBUaGUgbWVtYmVyIHZhbHVlLlxuICAgICAgICB2YXIgbGVuZ3RoO1xuICAgICAgICB2YXIgbWluZCA9IGdhcDtcbiAgICAgICAgdmFyIHBhcnRpYWw7XG4gICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4vLyBJZiB0aGUgdmFsdWUgaGFzIGEgdG9KU09OIG1ldGhvZCwgY2FsbCBpdCB0byBvYnRhaW4gYSByZXBsYWNlbWVudCB2YWx1ZS5cblxuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTihrZXkpO1xuICAgICAgICB9XG5cbi8vIElmIHdlIHdlcmUgY2FsbGVkIHdpdGggYSByZXBsYWNlciBmdW5jdGlvbiwgdGhlbiBjYWxsIHRoZSByZXBsYWNlciB0b1xuLy8gb2J0YWluIGEgcmVwbGFjZW1lbnQgdmFsdWUuXG5cbiAgICAgICAgaWYgKHR5cGVvZiByZXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFsdWUgPSByZXAuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xuICAgICAgICB9XG5cbi8vIFdoYXQgaGFwcGVucyBuZXh0IGRlcGVuZHMgb24gdGhlIHZhbHVlJ3MgdHlwZS5cblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgICByZXR1cm4gcXVvdGUodmFsdWUpO1xuXG4gICAgICAgIGNhc2UgXCJudW1iZXJcIjpcblxuLy8gSlNPTiBudW1iZXJzIG11c3QgYmUgZmluaXRlLiBFbmNvZGUgbm9uLWZpbml0ZSBudW1iZXJzIGFzIG51bGwuXG5cbiAgICAgICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSlcbiAgICAgICAgICAgICAgICA/IFN0cmluZyh2YWx1ZSlcbiAgICAgICAgICAgICAgICA6IFwibnVsbFwiO1xuXG4gICAgICAgIGNhc2UgXCJib29sZWFuXCI6XG4gICAgICAgIGNhc2UgXCJudWxsXCI6XG5cbi8vIElmIHRoZSB2YWx1ZSBpcyBhIGJvb2xlYW4gb3IgbnVsbCwgY29udmVydCBpdCB0byBhIHN0cmluZy4gTm90ZTpcbi8vIHR5cGVvZiBudWxsIGRvZXMgbm90IHByb2R1Y2UgXCJudWxsXCIuIFRoZSBjYXNlIGlzIGluY2x1ZGVkIGhlcmUgaW5cbi8vIHRoZSByZW1vdGUgY2hhbmNlIHRoYXQgdGhpcyBnZXRzIGZpeGVkIHNvbWVkYXkuXG5cbiAgICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuXG4vLyBJZiB0aGUgdHlwZSBpcyBcIm9iamVjdFwiLCB3ZSBtaWdodCBiZSBkZWFsaW5nIHdpdGggYW4gb2JqZWN0IG9yIGFuIGFycmF5IG9yXG4vLyBudWxsLlxuXG4gICAgICAgIGNhc2UgXCJvYmplY3RcIjpcblxuLy8gRHVlIHRvIGEgc3BlY2lmaWNhdGlvbiBibHVuZGVyIGluIEVDTUFTY3JpcHQsIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsXG4vLyBzbyB3YXRjaCBvdXQgZm9yIHRoYXQgY2FzZS5cblxuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcbiAgICAgICAgICAgIH1cblxuLy8gTWFrZSBhbiBhcnJheSB0byBob2xkIHRoZSBwYXJ0aWFsIHJlc3VsdHMgb2Ygc3RyaW5naWZ5aW5nIHRoaXMgb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICBnYXAgKz0gaW5kZW50O1xuICAgICAgICAgICAgcGFydGlhbCA9IFtdO1xuXG4vLyBJcyB0aGUgdmFsdWUgYW4gYXJyYXk/XG5cbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiKSB7XG5cbi8vIFRoZSB2YWx1ZSBpcyBhbiBhcnJheS4gU3RyaW5naWZ5IGV2ZXJ5IGVsZW1lbnQuIFVzZSBudWxsIGFzIGEgcGxhY2Vob2xkZXJcbi8vIGZvciBub24tSlNPTiB2YWx1ZXMuXG5cbiAgICAgICAgICAgICAgICBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpYWxbaV0gPSBzdHIoaSwgdmFsdWUpIHx8IFwibnVsbFwiO1xuICAgICAgICAgICAgICAgIH1cblxuLy8gSm9pbiBhbGwgb2YgdGhlIGVsZW1lbnRzIHRvZ2V0aGVyLCBzZXBhcmF0ZWQgd2l0aCBjb21tYXMsIGFuZCB3cmFwIHRoZW0gaW5cbi8vIGJyYWNrZXRzLlxuXG4gICAgICAgICAgICAgICAgdiA9IHBhcnRpYWwubGVuZ3RoID09PSAwXG4gICAgICAgICAgICAgICAgICAgID8gXCJbXVwiXG4gICAgICAgICAgICAgICAgICAgIDogZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFwiW1xcblwiICsgZ2FwICsgcGFydGlhbC5qb2luKFwiLFxcblwiICsgZ2FwKSArIFwiXFxuXCIgKyBtaW5kICsgXCJdXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogXCJbXCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJdXCI7XG4gICAgICAgICAgICAgICAgZ2FwID0gbWluZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgIH1cblxuLy8gSWYgdGhlIHJlcGxhY2VyIGlzIGFuIGFycmF5LCB1c2UgaXQgdG8gc2VsZWN0IHRoZSBtZW1iZXJzIHRvIGJlIHN0cmluZ2lmaWVkLlxuXG4gICAgICAgICAgICBpZiAocmVwICYmIHR5cGVvZiByZXAgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByZXAubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcFtpXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IHJlcFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYgPSBzdHIoaywgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsLnB1c2gocXVvdGUoaykgKyAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdhcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIjogXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCI6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApICsgdik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4vLyBPdGhlcndpc2UsIGl0ZXJhdGUgdGhyb3VnaCBhbGwgb2YgdGhlIGtleXMgaW4gdGhlIG9iamVjdC5cblxuICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHN0cihrLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpYWwucHVzaChxdW90ZShrKSArIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2FwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiOiBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIjpcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgKyB2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuLy8gSm9pbiBhbGwgb2YgdGhlIG1lbWJlciB0ZXh0cyB0b2dldGhlciwgc2VwYXJhdGVkIHdpdGggY29tbWFzLFxuLy8gYW5kIHdyYXAgdGhlbSBpbiBicmFjZXMuXG5cbiAgICAgICAgICAgIHYgPSBwYXJ0aWFsLmxlbmd0aCA9PT0gMFxuICAgICAgICAgICAgICAgID8gXCJ7fVwiXG4gICAgICAgICAgICAgICAgOiBnYXBcbiAgICAgICAgICAgICAgICAgICAgPyBcIntcXG5cIiArIGdhcCArIHBhcnRpYWwuam9pbihcIixcXG5cIiArIGdhcCkgKyBcIlxcblwiICsgbWluZCArIFwifVwiXG4gICAgICAgICAgICAgICAgICAgIDogXCJ7XCIgKyBwYXJ0aWFsLmpvaW4oXCIsXCIpICsgXCJ9XCI7XG4gICAgICAgICAgICBnYXAgPSBtaW5kO1xuICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgIH1cbiAgICB9XG5cbi8vIElmIHRoZSBKU09OIG9iamVjdCBkb2VzIG5vdCB5ZXQgaGF2ZSBhIHN0cmluZ2lmeSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgaWYgKHR5cGVvZiBKU09OLnN0cmluZ2lmeSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG1ldGEgPSB7ICAgIC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICBcIlxcYlwiOiBcIlxcXFxiXCIsXG4gICAgICAgICAgICBcIlxcdFwiOiBcIlxcXFx0XCIsXG4gICAgICAgICAgICBcIlxcblwiOiBcIlxcXFxuXCIsXG4gICAgICAgICAgICBcIlxcZlwiOiBcIlxcXFxmXCIsXG4gICAgICAgICAgICBcIlxcclwiOiBcIlxcXFxyXCIsXG4gICAgICAgICAgICBcIlxcXCJcIjogXCJcXFxcXFxcIlwiLFxuICAgICAgICAgICAgXCJcXFxcXCI6IFwiXFxcXFxcXFxcIlxuICAgICAgICB9O1xuICAgICAgICBKU09OLnN0cmluZ2lmeSA9IGZ1bmN0aW9uICh2YWx1ZSwgcmVwbGFjZXIsIHNwYWNlKSB7XG5cbi8vIFRoZSBzdHJpbmdpZnkgbWV0aG9kIHRha2VzIGEgdmFsdWUgYW5kIGFuIG9wdGlvbmFsIHJlcGxhY2VyLCBhbmQgYW4gb3B0aW9uYWxcbi8vIHNwYWNlIHBhcmFtZXRlciwgYW5kIHJldHVybnMgYSBKU09OIHRleHQuIFRoZSByZXBsYWNlciBjYW4gYmUgYSBmdW5jdGlvblxuLy8gdGhhdCBjYW4gcmVwbGFjZSB2YWx1ZXMsIG9yIGFuIGFycmF5IG9mIHN0cmluZ3MgdGhhdCB3aWxsIHNlbGVjdCB0aGUga2V5cy5cbi8vIEEgZGVmYXVsdCByZXBsYWNlciBtZXRob2QgY2FuIGJlIHByb3ZpZGVkLiBVc2Ugb2YgdGhlIHNwYWNlIHBhcmFtZXRlciBjYW5cbi8vIHByb2R1Y2UgdGV4dCB0aGF0IGlzIG1vcmUgZWFzaWx5IHJlYWRhYmxlLlxuXG4gICAgICAgICAgICB2YXIgaTtcbiAgICAgICAgICAgIGdhcCA9IFwiXCI7XG4gICAgICAgICAgICBpbmRlbnQgPSBcIlwiO1xuXG4vLyBJZiB0aGUgc3BhY2UgcGFyYW1ldGVyIGlzIGEgbnVtYmVyLCBtYWtlIGFuIGluZGVudCBzdHJpbmcgY29udGFpbmluZyB0aGF0XG4vLyBtYW55IHNwYWNlcy5cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBzcGFjZTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCArPSBcIiBcIjtcbiAgICAgICAgICAgICAgICB9XG5cbi8vIElmIHRoZSBzcGFjZSBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIGl0IHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5kZW50IHN0cmluZy5cblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBzcGFjZTtcbiAgICAgICAgICAgIH1cblxuLy8gSWYgdGhlcmUgaXMgYSByZXBsYWNlciwgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5LlxuLy8gT3RoZXJ3aXNlLCB0aHJvdyBhbiBlcnJvci5cblxuICAgICAgICAgICAgcmVwID0gcmVwbGFjZXI7XG4gICAgICAgICAgICBpZiAocmVwbGFjZXIgJiYgdHlwZW9mIHJlcGxhY2VyICE9PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgKHR5cGVvZiByZXBsYWNlciAhPT0gXCJvYmplY3RcIiB8fFxuICAgICAgICAgICAgICAgICAgICB0eXBlb2YgcmVwbGFjZXIubGVuZ3RoICE9PSBcIm51bWJlclwiKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkpTT04uc3RyaW5naWZ5XCIpO1xuICAgICAgICAgICAgfVxuXG4vLyBNYWtlIGEgZmFrZSByb290IG9iamVjdCBjb250YWluaW5nIG91ciB2YWx1ZSB1bmRlciB0aGUga2V5IG9mIFwiXCIuXG4vLyBSZXR1cm4gdGhlIHJlc3VsdCBvZiBzdHJpbmdpZnlpbmcgdGhlIHZhbHVlLlxuXG4gICAgICAgICAgICByZXR1cm4gc3RyKFwiXCIsIHtcIlwiOiB2YWx1ZX0pO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4vLyBJZiB0aGUgSlNPTiBvYmplY3QgZG9lcyBub3QgeWV0IGhhdmUgYSBwYXJzZSBtZXRob2QsIGdpdmUgaXQgb25lLlxuXG4gICAgaWYgKHR5cGVvZiBKU09OLnBhcnNlICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgSlNPTi5wYXJzZSA9IGZ1bmN0aW9uICh0ZXh0LCByZXZpdmVyKSB7XG5cbi8vIFRoZSBwYXJzZSBtZXRob2QgdGFrZXMgYSB0ZXh0IGFuZCBhbiBvcHRpb25hbCByZXZpdmVyIGZ1bmN0aW9uLCBhbmQgcmV0dXJuc1xuLy8gYSBKYXZhU2NyaXB0IHZhbHVlIGlmIHRoZSB0ZXh0IGlzIGEgdmFsaWQgSlNPTiB0ZXh0LlxuXG4gICAgICAgICAgICB2YXIgajtcblxuICAgICAgICAgICAgZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xuXG4vLyBUaGUgd2FsayBtZXRob2QgaXMgdXNlZCB0byByZWN1cnNpdmVseSB3YWxrIHRoZSByZXN1bHRpbmcgc3RydWN0dXJlIHNvXG4vLyB0aGF0IG1vZGlmaWNhdGlvbnMgY2FuIGJlIG1hZGUuXG5cbiAgICAgICAgICAgICAgICB2YXIgaztcbiAgICAgICAgICAgICAgICB2YXIgdjtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG5cblxuLy8gUGFyc2luZyBoYXBwZW5zIGluIGZvdXIgc3RhZ2VzLiBJbiB0aGUgZmlyc3Qgc3RhZ2UsIHdlIHJlcGxhY2UgY2VydGFpblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHdpdGggZXNjYXBlIHNlcXVlbmNlcy4gSmF2YVNjcmlwdCBoYW5kbGVzIG1hbnkgY2hhcmFjdGVyc1xuLy8gaW5jb3JyZWN0bHksIGVpdGhlciBzaWxlbnRseSBkZWxldGluZyB0aGVtLCBvciB0cmVhdGluZyB0aGVtIGFzIGxpbmUgZW5kaW5ncy5cblxuICAgICAgICAgICAgdGV4dCA9IFN0cmluZyh0ZXh0KTtcbiAgICAgICAgICAgIHJ4X2Rhbmdlcm91cy5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgaWYgKHJ4X2Rhbmdlcm91cy50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShyeF9kYW5nZXJvdXMsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlxcXFx1XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChcIjAwMDBcIiArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuLy8gSW4gdGhlIHNlY29uZCBzdGFnZSwgd2UgcnVuIHRoZSB0ZXh0IGFnYWluc3QgcmVndWxhciBleHByZXNzaW9ucyB0aGF0IGxvb2tcbi8vIGZvciBub24tSlNPTiBwYXR0ZXJucy4gV2UgYXJlIGVzcGVjaWFsbHkgY29uY2VybmVkIHdpdGggXCIoKVwiIGFuZCBcIm5ld1wiXG4vLyBiZWNhdXNlIHRoZXkgY2FuIGNhdXNlIGludm9jYXRpb24sIGFuZCBcIj1cIiBiZWNhdXNlIGl0IGNhbiBjYXVzZSBtdXRhdGlvbi5cbi8vIEJ1dCBqdXN0IHRvIGJlIHNhZmUsIHdlIHdhbnQgdG8gcmVqZWN0IGFsbCB1bmV4cGVjdGVkIGZvcm1zLlxuXG4vLyBXZSBzcGxpdCB0aGUgc2Vjb25kIHN0YWdlIGludG8gNCByZWdleHAgb3BlcmF0aW9ucyBpbiBvcmRlciB0byB3b3JrIGFyb3VuZFxuLy8gY3JpcHBsaW5nIGluZWZmaWNpZW5jaWVzIGluIElFJ3MgYW5kIFNhZmFyaSdzIHJlZ2V4cCBlbmdpbmVzLiBGaXJzdCB3ZVxuLy8gcmVwbGFjZSB0aGUgSlNPTiBiYWNrc2xhc2ggcGFpcnMgd2l0aCBcIkBcIiAoYSBub24tSlNPTiBjaGFyYWN0ZXIpLiBTZWNvbmQsIHdlXG4vLyByZXBsYWNlIGFsbCBzaW1wbGUgdmFsdWUgdG9rZW5zIHdpdGggXCJdXCIgY2hhcmFjdGVycy4gVGhpcmQsIHdlIGRlbGV0ZSBhbGxcbi8vIG9wZW4gYnJhY2tldHMgdGhhdCBmb2xsb3cgYSBjb2xvbiBvciBjb21tYSBvciB0aGF0IGJlZ2luIHRoZSB0ZXh0LiBGaW5hbGx5LFxuLy8gd2UgbG9vayB0byBzZWUgdGhhdCB0aGUgcmVtYWluaW5nIGNoYXJhY3RlcnMgYXJlIG9ubHkgd2hpdGVzcGFjZSBvciBcIl1cIiBvclxuLy8gXCIsXCIgb3IgXCI6XCIgb3IgXCJ7XCIgb3IgXCJ9XCIuIElmIHRoYXQgaXMgc28sIHRoZW4gdGhlIHRleHQgaXMgc2FmZSBmb3IgZXZhbC5cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHJ4X29uZS50ZXN0KFxuICAgICAgICAgICAgICAgICAgICB0ZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZShyeF90d28sIFwiQFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocnhfdGhyZWUsIFwiXVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UocnhfZm91ciwgXCJcIilcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICApIHtcblxuLy8gSW4gdGhlIHRoaXJkIHN0YWdlIHdlIHVzZSB0aGUgZXZhbCBmdW5jdGlvbiB0byBjb21waWxlIHRoZSB0ZXh0IGludG8gYVxuLy8gSmF2YVNjcmlwdCBzdHJ1Y3R1cmUuIFRoZSBcIntcIiBvcGVyYXRvciBpcyBzdWJqZWN0IHRvIGEgc3ludGFjdGljIGFtYmlndWl0eVxuLy8gaW4gSmF2YVNjcmlwdDogaXQgY2FuIGJlZ2luIGEgYmxvY2sgb3IgYW4gb2JqZWN0IGxpdGVyYWwuIFdlIHdyYXAgdGhlIHRleHRcbi8vIGluIHBhcmVucyB0byBlbGltaW5hdGUgdGhlIGFtYmlndWl0eS5cblxuICAgICAgICAgICAgICAgIGogPSBldmFsKFwiKFwiICsgdGV4dCArIFwiKVwiKTtcblxuLy8gSW4gdGhlIG9wdGlvbmFsIGZvdXJ0aCBzdGFnZSwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSwgcGFzc2luZ1xuLy8gZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gYSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZSB0cmFuc2Zvcm1hdGlvbi5cblxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHJldml2ZXIgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICAgICAgPyB3YWxrKHtcIlwiOiBqfSwgXCJcIilcbiAgICAgICAgICAgICAgICAgICAgOiBqO1xuICAgICAgICAgICAgfVxuXG4vLyBJZiB0aGUgdGV4dCBpcyBub3QgSlNPTiBwYXJzZWFibGUsIHRoZW4gYSBTeW50YXhFcnJvciBpcyB0aHJvd24uXG5cbiAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIkpTT04ucGFyc2VcIik7XG4gICAgICAgIH07XG4gICAgfVxufSgpKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vLjIuMC40QHN0b3JlL3BsdWdpbnMvbGliL2pzb24yLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9