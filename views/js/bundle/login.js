/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var API = {
  //host: 'http://mh.kenx.cn:3000',
  //host:'http://10.0.2.2:3000',//苹果的地址不一定相同,不能使用10.0.2.2:3000
  //host:'http://192.168.0.249:3000',
  host: 'http://192.168.0.249:3000',
  login: '/user/login',
  loginByToken: '/user/login/token',
  getUser: '/user/get',
  getkankanList: '/kankan/getList',
  getkankan: 'kankan/get',
  createUser: '/user/create',
  getMessage: '/message/get',
  addMessage: '/message/add',
  getMakeup: '/makeup/get',
  addMakeup: '/makeup/add',
  updatePassword: '/user/password/update',
  deleteUser: '/user/delete',
  db: '/db/users'
};
exports.API = API;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _api = __webpack_require__(0);

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let path = API.host +API.login;
console.log(_api2.default);
$(function () {
    const db_user_local = new PouchDB('user');
    let path = "http://192.168.0.249:3000/user/login";

    console.log(path);
    $('#btn').on('click', function () {
        var email = $('#email').val();
        var password = $('#password').val();
        var loginInfo = $(".login-info");
        //必填验证
        if (!email || !password) {
            loginInfo.removeClass("hidden").text("注册邮箱或密码必须填写，不能为空！");
            email.focus();
            return;
        }
        //组装数据
        var obj = {
            email,
            password,
            deviceId: 'browser'
        };
        //登录请求
        $.ajax({
            type: 'POST',
            url: path,
            dataType: 'json',
            data: obj
        }).done(function (data) {
            if (data.status) {
                window.location.href = '/';
            } else {
                loginInfo.removeClass("hidden").text("注册邮箱或密码不正确，请重新登录！");
            }
        }).fail(function () {
            loginInfo.removeClass("hidden").text("系统出现异常，稍后重试！");
        });
    });
});

/***/ })
/******/ ]);