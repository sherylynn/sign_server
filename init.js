/**
 * Created by lynn on 14-2-22.
 */
var qr = require('qr-image'),
  //jsonFile = require('json-file-plus'),
  util = require('./src/util'),
  users = require('./about/fuck').users(),
  fs = require('fs');

//qr.image('http://www.baidu.com/')
var API = '#user#';

var PouchDB = require('pouchdb');
var db = 'http://localhost:3456/shit';

var iconv = require('iconv-lite');

//init.destroyUser();

var init = {
  destroyUser: async function () {
    var db_user = new PouchDB(db);
    var res = await db_user.destroy()
    console.log('数据库已经重建');
  },
  put: async function () {
    for (var i = 0; i <= users.length - 1; i++) {
      var qr_png = qr.image(API + util.md5_users(users[i]["身份证号"]), {type: 'png'});
      qr_png.pipe(fs.createWriteStream('./img/第' + users[i]["组别"] + "组" + users[i]["姓名"] + '.png'));
      let db_user = new PouchDB(db);
      let username = users[i]["姓名"];
      let email = users[i]["身份证号"];
      let password = util.md5("111111");
      let deviceId = 'init';
      let token = util.guid() + deviceId;
      let time = new Date().toLocaleString();

      //更多个人信息还没注入
      var doc = await db_user.put({
        _id: email,
        username: username,
        email: email,
        password: password,
        token: token,
        reg_time: time,
        log_time: time
      });
    }
  }
}
init.put();

console.log('成功初始化');