var fs = require("fs");

module.exports = function(app) {
  var FS_PATH_SERVICES = './src/services/';
  var REQUIRE_PATH_SERVICES = './services/';

  /*
  fs.readdir(FS_PATH_SERVICES, function(err, list) {
    if (err) {
      throw '没有找到该文件夹，请检查......'
    }
    for (var e; list.length && (e = list.shift());) {
      console.log(e);
      var service = require(REQUIRE_PATH_SERVICES + e);
      service.init && service.init(app);
    }
  });
  */
  //切换成只使用 user.js
  
  //var service_act=require(REQUIRE_PATH_SERVICES+'activity.js');
  //service_act.init && service_act.init(app);
  //var service_index=require(REQUIRE_PATH_SERVICES+'index.js');
  //service_index.init && service_index.init(app);
  //var service_kankan=require(REQUIRE_PATH_SERVICES+'kankan.js');
  //service_kankan.init && service_kankan.init(app);
  //var service_makeup=require(REQUIRE_PATH_SERVICES+'makeup.js');
  //service_makeup.init && service_makeup.init(app);
  //var service_message=require(REQUIRE_PATH_SERVICES+'message.js');
  //service_message.init && service_message.init(app);
  var service_test=require('./services/test.js');
  service_test.init && service_test.init(app);
  if (module.hot){
    module.hot.accept(REQUIRE_PATH_SERVICES+'test.js', function() {
      var newHotModule_test = require(REQUIRE_PATH_SERVICES+'test.js');
      newHotModule_test.init && newHotModule_test.init(app);
    });
  }
  //得直接确定路径，不能动态加载 就是小嚼说的 webpack 动态 require 的问题
  //express的特性，已经路由的路径不会响应第二个路由
  /*
  let service_user=require('./services/user.js');
  service_user.init && service_user.init(app);
  module.hot.accept('./services/user.js', function() {
    service_user= require('./services/user.js');
    service_user.init && service_user.init(app);
  });
  */
  /*
  let service_user=require('./services/user.js');
  if (module.hot){
    module.hot.accept('./services/user.js', function() {
      service_user = require('./services/user.js');
    });
  }
  service_user.init && service_user.init(app);
  */
  let service_user=require('./services/user.js');
  service_user.init && service_user.init(app);
  if (module.hot){
    module.hot.accept('./services/user.js', function() {
      service_user = require('./services/user.js');
    });
  }
  
};