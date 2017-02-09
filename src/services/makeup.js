var fs = require('fs');
var util = require('./../util');
var MAKEUP_PATH = './database/天然护肤品原料.json';
var USER_PATH = './database/user.json';

var Makeup = {
  init: function (app) {
    app.post('/makeup/get', this.getMakeup);
    app.post('/makeup/add', this.addMakeup);
  },

  //获取化妆品消息
  getMakeup: function (req, res) {
    var key = req.param('key');
    if (key !== util.getKey()) {
      return res.send({
        status: 0,
        data: '使用了没有鉴权的key'
      });
    }
    fs.readFile(MAKEUP_PATH, function (err, data) {
      if (!err) {
        try {
          var obj = JSON.parse(data);
          return res.send({
            status: 1,
            data: obj
          });
        } catch (e) {
          return res.send({
            status: 0,
            err: e
          });
        }
      }

      return res.send({
        status: 0,
        err: err
      });
    });
  },

  //增加化妆品消息
  addMakeup: function (req, res) {
    var token = req.param('token');
    var en = req.param('en');
    var zh = req.param('zh');
    var tag = req.param('tag');
    var good = req.param('good');
    var bad = req.param('bad');
    if (!token || !en || !zh || !tag || !good || !bad) {
      return res.send({
        status: 0,
        err: 'token或者化妆品信息不能为空'
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
            var makeupObj = JSON.parse(fs.readFileSync(MAKEUP_PATH));
            makeupObj.push({
              "makeupid": util.guid(),
              userid: obj[i].userid,
              username: obj[i].username,
              time: new Date().getFullYear() + '-'
              + (parseInt(new Date().getMonth()) + 1) + '-' + new Date().getDate(),
              'en': en,
              "zh": zh,
              "tag": tag,
              "good": good,
              "bad": bad
            });

            fs.writeFileSync(MAKEUP_PATH, JSON.stringify(makeupObj));
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

module.exports = Makeup;