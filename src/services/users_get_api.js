var fs = require('fs');
var util = require('./../util');
var qs =require('qs');
var USER_PATH = './database/user.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-auth')); //pouchdb-auth可以在内置使用，另一个认证的只能在浏览器
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x
var db = 'http://localhost:3456/shit';
var db_auth = new PouchDB('http://localhost:3456/_users');

var User_get = {
  users_get_api:async (req,res)=>{
    let db_user = new PouchDB(db);
    //let的时候需要先定义data page 后再设定
    let usersListData={
      data:[],
      page:{}
    }
    let allDocs = await db_user.allDocs({
        include_docs: true,
      })
    //alldoc的格式问题,加上要去掉token等,并把info信息提前
    usersListData.data =allDocs.rows.map((obj)=>{
      return {
        ...obj.doc,
        password:0,
        token:0,
        ...obj.doc.info
      }
    })
    usersListData.page ={
      total: usersListData.data.length,
      current: 1
    }
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
    const currentPage = page.page || 1

    let data
    let newPage

    //let newData = usersListData.data.concat()

    if (page.field) {
      const d = newData.filter(function (item) {
        return item[page.field].indexOf(decodeURI(page.keyword)) > -1
      })

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize)

      newPage = {
        current: currentPage * 1,
        total: d.length
      }
    } else {
      data = usersListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      usersListData.page.current = currentPage * 1
      newPage = usersListData.page
    }

    // 注意 return res.send
    return res.send({success: true, data, page: { ...newPage, pageSize: pageSize}})
  },
  //鉴权
  login: async (req, res)=> {
    let db_user = new PouchDB(db);
    var email = req.body.email;
    var password = util.md5(req.body.password);
    var deviceId = req.body.deviceId;
    var token = util.guid() + deviceId;
    try {
      var doc = await db_user.get(email);
      if (doc['password'] == password) {
        let time = new Date().toLocaleString();
        var response = await db_user.put({
          _id: email,
          _rev: doc._rev,
          email: email,
          password: password,
          username: doc['username'],
          token: token,
          reg_time: doc['reg_time'],
          log_time: time
        });
        return res.send({
          status: 1,
          data: {
            email: email,
            username: doc['username'],
            token: token,
            reg_time: doc['reg_time'],
            log_time: time

          },
          message:'登录成功'
        });
      } else {
        console.log(password);
        console.log(doc['password']);
        console.log(doc);
        return res.send({
          status: 0,
          data: '密码错误',
          message:'密码错误'
        });
      }

    } catch (err) {
      console.log(err);
      return res.send({
        status: 0,
        data: '请检查是否是注册过的邮箱',
        message:'密码错误'
      });
    }
    /*
    var r_index = await db_user.createIndex({
      index: {
        fields: ['email', 'password']
      }
    });
    console.log(r_index);
    try {
      var r_email = await db_user.find({
        selector: {
          email: email
        }
      })
      if (r_email['docs'][0]['password'] == password) {
        try {
          var r_all = await db_user.put({
            _id: r_email['docs'][0]['_id'],
            _rew: r_email['docs'][0]['_rev'],
            'token': token
          })
          return res.send({
            status: 1,
            data: r_email['docs'][0].s
          });
        } catch (error) {
          console.log(error);
          return res.send({
            status: 0,
            data: '出故障了'
          });
        }
      } else {
        return res.send({
          status: 0,
          data: '密码错误'
        });
      }
    } catch (error) {
      console.log(error)
      return res.send({
        status: 0,
        data: '请检查是否是注册过的邮箱'
      });
    }
    */
    /*
    db_user.createIndex({
      index: {
        fields: ['email', 'password']
      }
    }).then(function (r) {
      console.log(r);
      return db_user.find({
        selector: {
          $and: [
            { email: email },
            { password: password }
          ]
        }
      })
    }).then(function (r) {
      return db_user.put({
        _id: r['docs'][0]['_id'],
        _rew: r['docs'][0]['_rev'],
        'token': token
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
          data: '邮箱或者密码错误'
        });
      }
    })
    */
  },
  loginByToken: async (req, res)=> {
    var db_user = new PouchDB(db);
    var token = req.body.token;
    var r_index = await db_user.createIndex({
      index: {
        fields: ['token']
      }
    });
    console.log(r_index);
    try {
      var r_token = await db_user.find({
        selector: {
          token: token
        }
      })
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
      console.log(error)
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

  },
  users_delete_api:async (req,res)=>{
    let db_user = new PouchDB(db);
    let usersListData={
      data:[],
      page:{}
    }
    const deleteItem = req.body
    
    try {
      let doc = await db_user.get(deleteItem.email);
      try {
        let response = await db_user.remove(doc);
        let allDocs = await db_user.allDocs({
          include_docs: true,
        })
        usersListData.data =allDocs.rows.map((obj)=>{
          return {
            ...obj.doc,
            password:0,
            token:0,
            ...obj.doc.info
          }
        })
        usersListData.page ={
          total: usersListData.data.length,
          current: 1
        }
        
        return res.send({success: true, data: usersListData.data, page: usersListData.page})
      } catch (err) {
        console.log(err)
        return res.send({
          status: 1,
          data: '后台故障'
        });
      }
    } catch(err){
      console.log(err);
      return res.send({
        status: 0,
        data: '要删除的用户不存在'
      });
    }
  },
}
module.exports = User_get;