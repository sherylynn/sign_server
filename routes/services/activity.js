'use strict';

var _checkAdmin = require('./../checkAdmin');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fs = require('fs');
var util = require('./../util');
var USER_PATH = './database/activity.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x

let db_activity_url = 'http://localhost:3456/activity';
let db_user_url = 'http://localhost:3456/shit';
/*

activity={
  title:'',
  where:'',
  when:'',
  time:'',
  about:'',
  point:''
}

{
  what
  when
  where
  why
  how

}

*/

let Activity = {

  init: function (app) {
    console.log('已经加载');
    //app.get('/user/destroy', this.destroyUser)
    //app.post('/user/get', this.getUser);
    app.post('/activity/create', this.addActivity);
    app.post('/activity/delete', this.deleteUser);
  },
  destroyUser: function (req, res) {
    var db_user = new PouchDB(db);
    db_user.destroy().then(function (response) {
      return res.send({
        status: 0,
        data: '数据库已经重建'
      });
    }).catch(function (err) {
      console.log(err);
    });
  },
  //获取活动信息
  getActivity: (() => {
    var _ref = _asyncToGenerator(function* (req, res) {
      let db_activity = new PouchDB(db_activity_url);
      try {
        let result = yield db_activity.allDocs({
          include_docs: true,
          attachments: true
        });
        return res.send({
          status: 1,
          data: result['rows']
        });
      } catch (err) {
        console.log(err);
        return res.send({
          status: 0,
          data: '后台数据库维护'
        });
      }
    });

    return function getActivity(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })(),

  //添加活动
  addActivity: (() => {
    var _ref2 = _asyncToGenerator(function* (req, res) {
      let db_activity = new PouchDB(db_activity_url);
      console.log(req.body);

      //let {activity}=req.body
      var _req$body = req.body;
      let title = _req$body.title,
          when = _req$body.when,
          where = _req$body.where,
          about = _req$body.about,
          point = _req$body.point;

      let time = util.time();
      /*
      let title=req.body.title;
      let when=req.body.when;
      let where=req.body.where;
      let about=req.body.about;
      let point=req.body.point;
      let time=util.time();
      */

      let token = req.body.token;

      if (!title || !when || !where || !about || !point) {
        return res.send({
          status: 0,
          data: '信息填写不全'
        });
      } else if (!(0, _checkAdmin.checkAdmin)(token)) {
        return res.send({
          status: 0,
          data: '没有管理员权限'
        });
      } else {
        try {
          let doc = yield db_activity.put({
            title,
            when,
            where,
            about,
            point,
            time
          });
          return res.send({
            status: 1,
            data: {
              title,
              when,
              where
            }
          });
        } catch (err) {
          console.log(err);
          return res.send({
            status: 0,
            data: '后台维护'
          });
        }
      }
    });

    return function addActivity(_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  })(),

  //通过token登录
  loginByToken: (() => {
    var _ref3 = _asyncToGenerator(function* (req, res) {
      var db_user = new PouchDB(db);
      var token = req.body.token;
      var r_index = yield db_user.createIndex({
        index: {
          fields: ['token']
        }
      });
      console.log(r_index);
      try {
        var r_token = yield db_user.find({
          selector: {
            token: token
          }
        });
        if (r_token['docs'].length > 0) {
          console.log(r_token);
          return res.send({
            status: 1,
            data: r_token['docs'][0]
          });
        } else {
          return res.send({
            status: 0,
            data: 'token失效'
          });
        }
      } catch (error) {
        console.log(error);
        return res.send({
          status: 0,
          data: '后台维护'
        });
      }
      /*
      db_user.createIndex({
        index: {
          fields: ['token']
        }
      }).then(function (r) {
        console.log(r);
        return db_user.find({
          selector:
          { token: token }
        })
      }).then(function () {
        return res.send({
          status: 1,
          data: r['docs'][0].s
        });
      }).catch(function (err) {
        if (err) {
          console.log(err);
          return res.send({
            status: 0,
            info: 'token失效'
          });
        }
      })
      */
    });

    return function loginByToken(_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  })(),

  //用户修改密码
  updatePassword: function (req, res) {
    var token = req.body.token;
    var oldPassword = util.md5(req.body.oldPassword);
    var password = util.md5(req.body.password);

    var content = JSON.parse(fs.readFileSync(USER_PATH));
    for (var i in content) {
      if (token === content[i].token && oldPassword === content[i].password) {
        content[i].password = password;
        //写入到文件中
        fs.writeFileSync(USER_PATH, JSON.stringify(content));
        return res.send({
          status: 1,
          data: '更新成功'
        });
      }
    }

    return res.send({
      status: 0,
      data: '更新失败，没有找到该用户或者初始密码错误'
    });
  },

  //删除用户
  deleteUser: function (req, res) {
    var token = req.body.token;
    var email = req.body.email;

    var content = JSON.parse(fs.readFileSync(USER_PATH));
    for (var i in content) {
      if (token === content[i].token) {
        //遍历查找需要删除的用户
        for (var j in content) {
          if (content[j].email === email) {
            content.splice(j, 1);
            //写入到文件中
            fs.writeFileSync(USER_PATH, JSON.stringify(content));
            return res.send({
              status: 1,
              info: content,
              data: '删除成功'
            });
          }
        }
      }
    }
    return res.send({
      status: 0,
      err: '删除失败，没有找到该用户或者用户鉴权错误'
    });
  }
};

module.exports = Activity;