var fs = require('fs');
var util = require('./../util');
var qs =require('qs');
var USER_PATH = './database/user.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-auth')); //pouchdb-auth可以在内置使用，另一个认证的只能在浏览器
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x
var db = 'http://localhost:3456/shit';
var db_auth = new PouchDB('http://localhost:3456/_users');





/*
try {
  let r = await db_auth.useAsAuthenticationDB();
} catch (err) {
  console.log(err)
}*/
db_auth.useAsAuthenticationDB()
  .then(function () {
    // db is now ready to be used as users database, with all behavior
    // of CouchDB's `_users` database applied

  })

//var db = 'shit';
//尝试不在开始声明以便删除数据库
//var db_user = new PouchDB('shit');
/*
let users_get_api=require('./users_get_api').users_get_api;
 if (module.hot){
    module.hot.accept('./users_get_api', function() {
      users_get_api=require('./users_get_api').users_get_api
    });
 }
 */
var User = {

  init: function (app) {
    //console.log('已经加载');
    //app.get('/user/destroy', this.destroyUser)
    //app.post('/user/get', this.getUser);
    app.get('/userInfo', this.userInfo);
    app.get('/api/users',this.users_get_api)
    //app.get('/api/users',users_get_api);
    //app.get('/api/users',this.users_get_api);
    app.get('/users', this.users);

    app.post('/api/users',this.users_post_api);

    app.post('/user/create', this.addUser);
    app.post('/user/create', this.addUser_auth);
    app.post('/user/login', this.login);
    app.post('/user/login/token', this.loginByToken);
    app.post('/user/password/update', this.updatePassword);
    app.post('/user/delete', this.deleteUser);


    app.delete('/api/users',this.users_delete_api);

    app.put('/api/users',this.users_put_api);
  },
  
  users_get_api:(req,res)=>{
    require('./users_get_api').users_get_api(req,res);
    if (module.hot){
      module.hot.accept('./users_get_api', function() {
      require('./users_get_api').users_get_api(req,res)
    });
  }},
  
  users_post_api:async (req,res)=>{
    const newData = req.body
    newData.createTime = new Date().toLocaleString();
    //newData.avatar = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1))

    newData.id = usersListData.data.length + 1
    usersListData.data.unshift(newData)

    usersListData.page.total = usersListData.data.length
    usersListData.page.current = 1

    global[dataKey] = usersListData

    res.json({success: true, data: usersListData.data, page: usersListData.page})
  },
  users_delete_api:(req,res)=>{
    require('./users_get_api').users_delete_api(req,res);
    if (module.hot){
      module.hot.accept('./users_get_api', function() {
      require('./users_get_api').users_delete_api(req,res)
    });
  }},
  users_put_api:(req,res)=>{
    require('./users_get_api').users_put_api(req,res);
    if (module.hot){
      module.hot.accept('./users_get_api', function() {
      require('./users_get_api').users_put_api(req,res)
    });
  }},
  users: async function (req,res){
    
  },
  userInfo: async function (req,res){

  },
  addUser_auth: async function (req, res) {
    //console.log(req.body);
    var username = req.body.username;
    var password = util.md5(req.body.password);
    var re_password = util.md5(req.body.re_password);
    var deviceId = req.body.deviceId;
    var email = req.body.email;
    var token = util.guid() + deviceId;
    if (!username || !password || !re_password || !email) {
      return res.send({
        status: 0,
        data: '信息填写不全'
      });
    } else if (password != re_password) {
      return res.send({
        status: 0,
        data: '两次密码不一致'
      });
    } else {
      try {
        let ok = await db_auth.signUp(email, password, {
          metadata: {
            username: username,
            time: new Date().toLocaleString(),
            token: token
          }
        }); //能使用
        let response = await db_auth.logIn(email, password)
        console.log(response);
        let metadata = await db_auth.getUser(email);
        console.log(metadata);
        return res.send({
          status: 1,
          data: {
            username: username,
            email: email,
            token: token
          }
        });
      } catch (err) {
        console.log(err + "1")
        if (err["reason"] == "Document update conflict") {
          return res.send({
            status: 0,
            data: '这个邮箱已经被注册使用'
          });
        }; //已经注册会给个报错叫409 document
      }
    }
  },
  login_auth: async function (req, res) {
    //console.log(req.body);
    var email = req.body.email;
    var password = util.md5(req.body.password);
    var deviceId = req.body.deviceId;
    var token = util.guid() + deviceId;
    try {
      let ok = await db_auth.logIn(email, password)
      //let update=await db_auth.putUser(email,
      if (doc['password'] == password) {
        var response = await db_user.put({
          _id: email,
          _rev: doc._rev,
          email: email,
          password: password,
          username: doc['username'],
          'token': token
        });
        return res.send({
          status: 1,
          data: {
            email: email,
            username: doc['username'],
            token: token
          }
        });
      } else {
        console.log(password);
        console.log(doc['password']);
        console.log(doc);
        return res.send({
          status: 0,
          data: '密码错误'
        });
      }

    } catch (err) {
      console.log(err);
      return res.send({
        status: 0,
        data: '请检查是否是注册过的邮箱'
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
  //获取用户信息
  getUser: function (req, res) {
    var key = req.body.key;
    if (key !== util.getKey()) {
      return res.send({
        status: 0,
        data: '使用了没有鉴权的key'
      });
    }
    fs.readFile(USER_PATH, function (err, data) {
      if (!err) {
        try {
          var obj = JSON.parse(data);
          var newObj = [];
          for (var i in obj) {
            if (obj[i].partment === partment) {
              delete obj[i]['password'];
              newObj.push(obj[i]);
            }
          }
          return res.send({
            status: 1,
            data: newObj
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

  //添加用户
  addUser: async function (req, res) {
    var db_user = new PouchDB(db);
    console.log(req.body);
    var username = req.body.username;
    var password = util.md5(req.body.password);
    var re_password = util.md5(req.body.re_password);
    var deviceId = req.body.deviceId;
    var email = req.body.email;
    var token = util.guid() + deviceId;
    if (!username || !password || !re_password || !email) {
      return res.send({
        status: 0,
        data: '信息填写不全'
      });
    } else if (password != re_password) {
      return res.send({
        status: 0,
        data: '两次密码不一致'
      });
    } else {
      try {
        var r_index = await db_user.createIndex({
          index: {
            fields: ['username']
          }
        });

        console.log(r_index);
      } catch (err) {
        console.log(err);
        return res.send({
          status: 0,
          data: '远程建立索引出错'
        })
      }

      try {
        var r_username = await db_user.find({
          selector: {
            username: username
          }
        })
        if (r_username['docs'].length > 0) {
          console.log(r_username);
          return res.send({
            status: 0,
            data: '用户名重复'
          });
        } else {
          try {
            let time = new Date().toLocaleString();
            var doc = await db_user.put({
              _id: email,
              username: username,
              email: email,
              password: password,
              token: token,
              reg_time: time,
              log_time: time,
            });
            return res.send({
              status: 1,
              data: {
                username: username,
                email: email,
                token: token,
                reg_time: time,
                log_time: time,
              }
            });
          } catch (err) {
            console.log(err);

            return res.send({
              status: 0,
              data: '这个邮箱已经被注册使用'
            });
          }
        }


      } catch (error) {
        console.log(error);
        return res.send({
          status: 0,
          data: '后台维护'
        });
      }

      /*
      db_user.allDocs({
        include_docs: true,
      }).then(function (r) {
        //console.log(r['rows'])
        var checkUsername = function (doc) {
          return doc['doc']['username'] == username
        }
        var checkEmail = function (doc) {
          return doc['doc']['email'] == email
        }
        if (r['rows'].filter(checkEmail).length) {
          return res.send({
            status: 0,
            data: '邮箱已注册'
          });
        }else if (r['rows'].filter(checkUsername).length) {
          return res.send({
            status: 0,
            data: '用户名已经被注册'
          });
        } else {
          return db_user.put({
            _id: email,
            username: username,
            email: email,
            password: password,
            time: new Date(),
            token: token
          }).then(function (r) {
            //console.log(r)
            console.log("注册成功")
            return res.send({
              status: 1,
              data: {
                username: username,
                email: email,
                token: token
              }
            });
          }).catch(function (err) {
            console.log(err)
            return res.send({
              status: 0,
              err: e
            });
          })
        }

      })
      */
    }
    /*
        db_user.createIndex({
          index: {
            fields: ['username','email']
          }
        }).then(function(r){
          console.log(r);
          return db_user.find({
            selector:{
              $and:[
                {username:username},
                {email:email}
              ]
            }
          })
        }).then(function (r) {
          return res.send({
              status: 0,
              data: '邮箱或用户名已经被使用'
            });
        }).catch(function (err) {
          if(err){
            console.log(err);
            return db_user.post({
              username: username,
              email: email,
              password: password,
              time: new Date(),
              token: ''
            })
          }
        })
    */
    /*
        db_user.createIndex({
          index: {
            fields: ['username']
          }
        }).then(function (result) {
          // yo, a result
          console.log(result)
          return db_user.find({
            selector: {
              username: username
            }
          }).then(function (result) {
            console.log(result['docs'][0]['username']);
            return res.send({
              status: 0,
              data: '用户名已经被注册'
            });
          }).catch(function (err) {
            console.log(err)
            return db_user.find({
              selector: {
                email: email
              }
            })
          }).then(function (result) {
            console.log(result)
            //console.log(result['docs'][0]['email']);
            return res.send({
              status: 0,
              data: '已经注册过的邮箱'
            });
          }).catch(function (err) {
            console.log(err)
            return db_user.post({
              username: username,
              email: email,
              password: password,
              time: new Date(),
              token: ''
            })
          }).then(function (result) {
            console.log('ok')
            return res.send({
              status: 1,
              data: {
                username: username
              }
            });
          }).catch(function (err) {
            console.log(err)
            return res.send({
              status: 0,
              err: e
            });
          })
        }).catch(function (err) {
          console.log(err)
        })
        
    */
  },

  //用户登录
  login:(req,res)=>{
    require('./users_get_api').login(req,res);
  if (module.hot){
    module.hot.accept('./users_get_api', function() {
      require('./users_get_api').login(req,res)
    });
  }},

  //通过token登录
  loginByToken: (req,res)=>{
    require('./users_get_api').loginByToken(req,res);
  if (module.hot){
    module.hot.accept('./users_get_api', function() {
      require('./users_get_api').loginByToken(req,res)
    });
  }},

  //用户修改密码 //fix
  updatePassword: async function (req, res) {
    let db_user = new PouchDB(db);
    let email = req.body.email;
    let token = req.body.token;
    let oldPassword = util.md5(req.body.oldPassword);
    let newPassword = util.md5(req.body.password);
    let token_passwd_index = await db_user.createIndex({
      index: {
        fields: ['token','email','password']
      }
    });
    try{
      let token_passwd =await db_user.find({
        selector: {
          token:token,
          email:email,
          password:oldPassword
        }
      })
      if (token_passwd['docs'].length > 0) {
        let time = new Date().toLocaleString();
        let doc = await db_user.get(email);
        let response = await db_user.put({
          _id: email,
          _rev: doc._rev,
          email: email,
          password: newPassword,
          username: doc['username'],
          token: token,
          reg_time: doc['reg_time'],
          log_time: time
        });
        console.log(token_passwd);
        return res.send({
          status: 1,
          data: token_passwd['docs'][0]
        });
      } else {
        return res.send({
          status: 0,
          data: '更新失败，没有找到该用户或者初始密码错误'
        })
      }

    } catch (err) {
      console.log(err);
      return res.send({
        status: 0,
        data: '远程错误'
      });
    }
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


module.exports = User;