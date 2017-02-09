'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');
var util = require('./../util');
var showdown = require('showdown');
var kankan = {
  init: function (app) {
    app.get('/kankan/get/:md', this.getkankan);
    app.get('/kankan/getList', this.getkankanList);
    app.post('/kankan/add', this.addkankan);
  },

  //获取公告消息
  getkankan: function (req, res) {
    let filterText = '.md';
    let filterRegex = new RegExp(String(filterText), 'i');
    if (filterRegex.test(req.params.md)) {
      res.render('./kankan/' + req.params.md, {
        layout: false
      });
    }
    console.log(req.params.md);
  },
  getkankanList: (() => {
    var ref = _asyncToGenerator(function* (req, res) {
      var FS_PATH = './views/kankan/';
      var REQUIRE_PATH_SERVICES = './kankan/';
      let filterText = '.md';
      let filterRegex = new RegExp(String(filterText), 'i');
      let filter = function (example) {
        return filterRegex.test(example);
      };
      let list = yield util.readdir(FS_PATH);
      let md_list = list.filter(filter);
      let json = [];
      try {
        for (var e; md_list.length && (e = md_list.shift());) {
          let data = yield util.readFile(FS_PATH + e);
          let title = data.split("##", 3)[1];
          let subtitle = data.split("##", 3)[2].split("\n", 1)[0];
          json.push({
            title: title,
            subtitle: subtitle,
            url: '/kankan/get/' + e,
            img: '/kankan/' + e.split('.md')[0] + '.jpg'
          });
        }
        return res.send({
          status: 1,
          data: json
        });
      } catch (err) {
        return res.send({
          status: 0,
          err: '服务器开小差了'
        });
      }

      /*
        
      fs.readdir(FS_PATH_SERVICES, function(err, list) {
        if (err) {
          throw '没有找到该文件夹，请检查......'
        }
        console.log(list);
        return res.send({
          list: list
        })
      });
      */
    });

    return function getkankanList(_x, _x2) {
      return ref.apply(this, arguments);
    };
  })(),
  //增加公告消息
  addkankan: function (req, res) {
    var token = req.param('token');
    var message = req.param('message');
    if (!token || !message) {
      return res.send({
        status: 0,
        err: 'token或者message不能为空'
      });
    }
    //根据token查询
    fs.readFile(USER_PATH, function (err, data) {
      if (err) {
        return res.send({
          status: 0,
          err: err
        });
      }

      try {
        var obj = JSON.parse(data);
        for (var i in obj) {
          if (obj[i].token === token) {
            //增加信息
            var msgObj = JSON.parse(fs.readFileSync(MESSAGE_PATH));
            msgObj.push({
              messageid: util.guid(),
              userid: obj[i].userid,
              username: obj[i].username,
              time: new Date().getFullYear() + '-' + (parseInt(new Date().getMonth()) + 1) + '-' + new Date().getDate(),
              message: message
            });

            fs.writeFileSync(MESSAGE_PATH, JSON.stringify(msgObj));
            return res.send({
              status: 1
            });
          }
        }

        return res.send({
          status: 0,
          err: 'token认证失败'
        });
      } catch (e) {
        return res.send({
          status: 0,
          err: e
        });
      }
    });
  }

};

module.exports = kankan;