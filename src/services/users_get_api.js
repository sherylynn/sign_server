var fs = require('fs');
var util = require('./../util');
var colors =require('colors')
var qs =require('qs');
var USER_PATH = './database/user.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-auth')); //pouchdb-auth可以在内置使用，另一个认证的只能在浏览器
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x
var db = 'http://localhost:3456/shit';
var db_auth = new PouchDB('http://localhost:3456/_users');

const userPermission = {
  DEFAULT: [
    'dashboard', 'chart',
  ],
  ADMIN: [
    'dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart',
  ],
  DEVELOPER: ['dashboard', 'users', 'UIElement', 'UIElementIconfont', 'chart'],
}

const adminUsers = [
  {
    id: 'admin',
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
  },
]

var User_get = {
  addUser: async (req, res)=> {
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
  user_permission:async(req,res)=>{
    const cookies=req.cookies || ''
    console.log('cookies是')
    console.log(cookies)
    const response = {}
    const user = {}
    if (!cookies.token) {
      return res.status(200).send({ message: 'Not Login' })
    }
    const token = JSON.parse(cookies.token)
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id)
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions
        user.username = userItem[0].username
        user.id = userItem[0].id
      }
    }
    return res.send(response)
  },
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
    var email = req.body.email ? req.body.email:req.body.username;
    console.log(req.body)
    var password = util.md5(req.body.password);
    var deviceId = req.body.deviceId;
    var token = util.guid() + deviceId;
    try {
      var doc = await db_user.get(email);
    } catch (err) {
      console.log(err);
      try {
        let r_index = await db_user.createIndex({
          index: {
            fields: ['username']
          }
        });
        console.log(r_index);
      } catch (err) {
        console.log(err);
        return res.send({
          status: 0,
          success:false,
          data: '远程建立索引出错'
        })
      }
      //可能是没注册过的邮箱(指代帐号,这里尝试用中文名登陆一次)
      try {
        let r_username = await db_user.find({
          selector: {
            username: email
          }
        })
        //console.log(r_username);
        if (r_username['docs'].length > 1) {//多于1个说明有人重名
          return res.send({
            status: 0,
            success:false,
            data: '有多个用户叫这个名字，请用身份证id登陆'
          });
        } else if(r_username['docs'].length == 0 ) {
          console.log('无id')
          return res.send({
            status: 0,
            success:false,
            data: '请检查是否是注册过的帐号',
            message:'请检查是否是注册过的帐号'
          });
        }else{
          console.log('用姓名登陆')
          doc=r_username['docs'][0]
        }
      } catch (error) {
        console.log(error);//身份证id和姓名都没有
        return res.send({
          status: 0,
          success:false,
          data: '系统维护,检索故障',
          message:'系统维护,检索故障'
        });
      }
    }
    //console.log(doc)
    if (doc['password'] == password) {
      let time = new Date().toLocaleString();
      var response = await db_user.put({
        ...doc,
        log_time: time
      });
      //设置cookies
      console.log('设置cookies')
      const now = new Date()
      now.setDate(now.getDate() + 1)
      res.cookie('token',{ id: email, deadline: now.getTime()}, {
        maxAge: 900000,
        httpOnly: false,
      })//然而设置的cookies并没有成功,不知道是否跨域问题
      console.log('传输数据'.red)
      console.log(doc)
      return res.send({
        status: 1,
        success:true,
        data: {
          ...doc,
          password:'',
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
        success:false,
        data: '密码错误',
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
          status: 0,
          success:false,
          data: '后台故障'
        });
      }
    } catch(err){
      console.log(err);
      return res.send({
        status: 0,
        success:false,
        data: '要删除的用户不存在'
      });
    }
  },
  users_post_api:async (req,res)=>{
    let db_user = new PouchDB(db);
    let usersListData={
      data:[],
      page:{}
    }
    const newData = req.body
    console.log(newData)
    let {username,email,password,...info}=newData;
    password = util.md5("111111");
    let deviceId = 'adminInit';
    let token = util.guid() + deviceId;
    let time = new Date().toLocaleString();
      
    try{
      //更多个人信息还没注入
      let doc = await db_user.put({
        _id: email,
        username: username,
        email: email,
        password: password,
        token: token,
        info: {
          ...info,
          "姓名": username,
          "身份证号": email,
        },
        reg_time: time,
        log_time: time
      });
    }catch(err){
      console.log(err)
      return res.send({
        status: 0,
        success:false,
        data: '已经存在这个用户'
      });
    }
    try{
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
        status: 0,
        success:false,
        data: '后台故障'
      });
    }
  },
  users_put_api:async (req,res)=>{
    let db_user = new PouchDB(db);
    let usersListData={
      data:[],
      page:{}
    }
    const editItem = req.body
    console.log(editItem);
    let {username,email,password,...info}=editItem;

    try {
      let doc = await db_user.get(editItem.email);
      try {
        console.log(info)
        /*
        console.log({
            ...doc.info,
            ...info
          })
          */
        let response = await db_user.put({
          ...doc,
          _id:editItem.email,
          _rev:doc._rev,
          info:{
            ...doc.info,
            ...info
          }

        });
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
          status: 0,
          success:false,
          data: '后台故障'
        });
      }
    } catch(err){
      console.log(err);
      return res.send({
        status: 0,
        data: '要更新的用户不存在'
      });
    }
  },
}
module.exports = User_get;