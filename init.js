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
    let db_user = new PouchDB(db);
    let res = await db_user.destroy()
    console.log('数据库已经重建' + res);
  },
  addAdmin: async() => {
    let db_user = new PouchDB(db);
    let username = "admin";
    let email = "admin";
    let password = util.md5("admin");
    let deviceId = 'admin';
    let token = util.guid() + deviceId;
    let time = new Date().toLocaleString();
    let doc = await db_user.put({
      _id: email,
      username: username,
      email: email,
      password: password,
      token: token,
      reg_time: time,
      log_time: time
    });
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
      let info = {
        "序号": users[i]["序号"],
        "姓名": users[i]["姓名"],
        "性别": users[i]["性别"],
        "出生年月": users[i]["出生年月"],
        "学历": users[i]["学历"],
        "入党日期": users[i]["入党日期"],
        "身份证号": users[i]["身份证号"],
        "联系电话": users[i]["联系电话"],
        "家庭地址": users[i]["家庭地址"],
        "手机号": users[i]["手机号"],
        "组别": users[i]["组别"],
        "参会":'[]',
        "积分":0,
        "二维码号":API +util.md5_users(users[i]["身份证号"])
      }
      /*
      let info={
        number:users[i]["序号"],
        name:users[i]["姓名"],
        gender:users[i]["性别"],
      }
      */

      //更多个人信息还没注入
      let doc = await db_user.put({
        _id:email,
        //_id: util.md5_users(users[i]["身份证号"]),//因为react-native上没有加密手段所以不加密以免react登录出错
        username: username,
        email: email,
        password: password,
        token: token,
        info: info,
        qrcode:API +util.md5_users(users[i]["身份证号"]),
        reg_time: time,
        log_time: time
      });
    }
  }
}
//init.put();
//init.destroyUser()
init.addAdmin()
console.log('成功初始化');