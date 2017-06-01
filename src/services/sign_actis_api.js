var fs = require('fs');
var util = require('./../util');
var colors = require('colors');
var qs = require('qs');
var acti_PATH = './database/acti.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x

import {checkAdmin} from './../checkAdmin'
let db_acti_url = 'http://localhost:3456/acti';
let db_user_url = 'http://localhost:3456/shit';
/*

acti={
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

let Sign_Acti_api = {
  sign_actis_get_api: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    //let的时候需要先定义data page 后再设定
    let actisListData = {
      data: [],
      page: {}
    }
    let allDocs = await db_acti.allDocs({include_docs: true})
    //alldoc的格式问题,加上要去掉token等,并把info信息提前
    actisListData.data = allDocs
      .rows
      .map((obj) => {
        return {
          ...obj.doc,
          ...obj.doc.info
        }
      })
    actisListData.data.reverse()
    actisListData.page = {
      total: actisListData.data.length,
      current: 1
    }
    const page = qs.parse(req.query)
    //手机用lazyload所以如果不指定就全部加载
    const pageSize = page.pageSize || actisListData.data.length
    const currentPage = page.page || 1

    let data
    let newPage

    //let newData = actisListData.data.concat()

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
      data = actisListData
        .data
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
      actisListData.page.current = currentPage * 1
      newPage = actisListData.page
    }

    // 注意 return res.send
    return res.send({
      success: true,
      data,
      page: {
        ...newPage,
        pageSize: pageSize
      }
    })
  },
  sign_actis_delete_api: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    let actisListData = {
      data: [],
      page: {}
    }
    const deleteItem = req.body

    try {
      let doc = await db_acti.get(deleteItem._id);
      try {
        let response = await db_acti.remove(doc);
        let allDocs = await db_acti.allDocs({include_docs: true})
        actisListData.data = allDocs
          .rows
          .map((obj) => {
            return {
              ...obj.doc,
              ...obj.doc.info
            }
          })
        actisListData.data.reverse()
        actisListData.page = {
          total: actisListData.data.length,
          current: 1
        }

        return res.send({success: true, data: actisListData.data, page: actisListData.page})
      } catch (err) {
        console.log(err)
        return res.send({status: 0, data: '后台故障'});
      }
    } catch (err) {
      console.log(err);
      return res.send({status: 0, data: '要删除的用户不存在'});
    }
  },
  sign_actis_post_api: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    let actisListData = {
      data: [],
      page: {}
    }
    const newData = req.body
    console.log(newData)
    //_id 自动生成，丢弃不用 let {actiname,when,where,point,_id,...info}=newData;
    let {
      _id,
      ...info
    } = newData;
    let time = new Date().toLocaleString();

    try {
      //更多活动信息还没注入 info内有参会人员和about _id 用什么还没想好 _id 自动生成  db用 post 而不是put
      let doc = await db_acti.post({
        //_id: email,
        /*
        actiname: actiname,
        when:when,
        where:where,
        point:point,
        */
        info: {
          ...info
        },
        reg_time: time
      });
    } catch (err) {
      console.log(err)
      return res.send({status: 0, data: '活动已经发布', message: '活动已经发布'});
    }
    try {
      let allDocs = await db_acti.allDocs({include_docs: true})
      actisListData.data = allDocs
        .rows
        .map((obj) => {
          return {
            ...obj.doc,
            ...obj.doc.info
          }
        })
      actisListData.data.reverse()
      actisListData.page = {
        total: actisListData.data.length,
        current: 1
      }
      return res.send({success: true, data: actisListData.data, page: actisListData.page})
    } catch (err) {
      console.log(err)
      return res.send({status: 0, data: '后台故障', message: '后台故障'});
    }
  },
  sign_actis_put_api: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    let db_user = new PouchDB(db_user_url);
    const editItem = req.body.data
    const user_qrcode = req.body.qrcode
    console.log(req.body.qrcode)
    console.log(req.body)
    //console.log(editItem); _id 自动生成，丢弃不用
    let {
      actiname,
      when,
      where,
      point,
      _id,
      ...info
    } = editItem;
    //console.log(_id)
    try {
      let acti_doc = await db_acti.get(_id);
      try {
        var r_index = await db_user.createIndex({
          index: {
            fields: ['qrcode']
          }
        });

        console.log(r_index);
      } catch (err) {
        console.log(err);
        return res.send({status: 0, data: '远程建立索引出错'})
      }
      try {
        let r_qrcode = await db_user.find({
          selector: {
            qrcode: user_qrcode
          }
        })
        if (r_qrcode['docs'].length == 0) {
          console.log('无id')
          return res.send({status: 0, success: false, data: '库中没有这个用户', message: '库中没有这个用户'});
        } else {
          let user_doc = r_qrcode['docs'][0]
          let users_sign_array=JSON.parse(acti_doc.info['参与人员']);
          let actis_sign_array=JSON.parse(user_doc.info['参会']);
          if (users_sign_array.includes(user_doc.username)) {
            //已经有了,返回已经签到不需要多签
            return res.send({
                success: false,
                data: {
                  username: user_doc.username
                },
                message: '已经签到不需要多签'
              })
          } else {
            users_sign_array.push(user_doc.username)
            console.log('acti的info'.green)
            console.log(acti_doc.info)
            actis_sign_array.push(acti_doc.info["主题"])
            try {

              let response = await db_acti.put({
                ...acti_doc,
                _id: _id,
                _rev: acti_doc._rev,
                info: {
                  ...acti_doc.info,
                  ...info,
                  '参与人员': JSON.stringify(users_sign_array)
                }
              });

              let res_user= await db_user.put({
                ...user_doc,
                info:{
                  ...user_doc.info,
                  '参会':JSON.stringify(actis_sign_array)
                }
              })
              return res.send({
                success: true,
                data: {
                  username: user_doc.username
                },
                message: '签到成功'
              })
            } catch (err) {
              console.log(err)
              return res.send({success: false, message: '后台故障'});
            }
          }

        }

      } catch (err) {
        console.log(err)
        return res.send({success: false, message: '系统查询服务出错'});
      }
    } catch (err) {
      console.log(err);
      return res.send({success: false, message: '活动不存在'});
    }
  },
  getacti: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    try {
      let result = await db_acti.allDocs({include_docs: true, attachments: true});
      return res.send({status: 1, data: result['rows']});
    } catch (err) {
      console.log(err);
      return res.send({status: 0, data: '后台数据库维护'});
    }
  },

  //添加活动
  addacti: async(req, res) => {
    let db_acti = new PouchDB(db_acti_url);
    console.log(req.body);

    //let {acti}=req.body
    let {title, when, where, about, point} = req.body;
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
      return res.send({status: 0, data: '信息填写不全'});
    } else if (!checkAdmin(token)) {
      return res.send({status: 0, data: '没有管理员权限'});
    } else {
      try {
        let doc = await db_acti.put({
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
        return res.send({status: 0, data: '后台维护'})
      }
    }
  }
};

module.exports = Sign_Acti_api;