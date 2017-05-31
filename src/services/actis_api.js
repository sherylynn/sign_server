var fs = require('fs');
var util = require('./../util');
var qs =require('qs');
var acti_PATH = './database/acti.json';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find')); //麻痹不兼容couchdb1.x

import {checkAdmin} from './../checkAdmin'
let db_acti_url = 'http://localhost:3456/acti';
let db_user_url ='http://localhost:3456/shit';
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


let Acti_api = {
  actis_get_api:async (req,res)=>{
    let db_acti = new PouchDB(db_acti_url);
    //let的时候需要先定义data page 后再设定
    let actisListData={
      data:[],
      page:{}
    }
    let allDocs = await db_acti.allDocs({
        include_docs: true,
      })
    //alldoc的格式问题,加上要去掉token等,并把info信息提前
    actisListData.data =allDocs.rows.map((obj)=>{
      return {
        ...obj.doc,
        ...obj.doc.info
      }
    })
    actisListData.page ={
      total: actisListData.data.length,
      current: 1
    }
    const page = qs.parse(req.query)
    const pageSize = page.pageSize || 10
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
      data = actisListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      actisListData.page.current = currentPage * 1
      newPage = actisListData.page
    }

    // 注意 return res.send
    return res.send({success: true, data, page: { ...newPage, pageSize: pageSize}})
  },
  actis_delete_api:async (req,res)=>{
    let db_acti = new PouchDB(db_acti_url);
    let actisListData={
      data:[],
      page:{}
    }
    const deleteItem = req.body
    
    try {
      let doc = await db_acti.get(deleteItem._id);
      try {
        let response = await db_acti.remove(doc);
        let allDocs = await db_acti.allDocs({
          include_docs: true,
        })
        actisListData.data =allDocs.rows.map((obj)=>{
          return {
            ...obj.doc,
            ...obj.doc.info
          }
        })
        actisListData.page ={
          total: actisListData.data.length,
          current: 1
        }
        
        return res.send({success: true, data: actisListData.data, page: actisListData.page})
      } catch (err) {
        console.log(err)
        return res.send({
          status: 0,
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
  actis_post_api:async (req,res)=>{
    let db_acti = new PouchDB(db_acti_url);
    let actisListData={
      data:[],
      page:{}
    }
    const newData = req.body
    console.log(newData)
    //_id 自动生成，丢弃不用
    //let {actiname,when,where,point,_id,...info}=newData;
    let {_id,...info}=newData;
    let time = new Date().toLocaleString();
      
    try{
      //更多活动信息还没注入 info内有参会人员和about _id 用什么还没想好
      //_id 自动生成  db用 post 而不是put
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
        reg_time: time,
      });
    }catch(err){
      console.log(err)
      return res.send({
        status: 0,
        data: '活动已经发布',
        message: '活动已经发布'
      });
    }
    try{
      let allDocs = await db_acti.allDocs({
        include_docs: true,
      })
      actisListData.data =allDocs.rows.map((obj)=>{
        return {
          ...obj.doc,
          ...obj.doc.info
        }
      })
      actisListData.page ={
        total: actisListData.data.length,
        current: 1
      }
      return res.send({success: true, data: actisListData.data, page: actisListData.page})
    } catch (err) {
      console.log(err)
      return res.send({
        status: 0,
        data: '后台故障',
        message: '后台故障'
      });
    }
  },
  actis_put_api:async (req,res)=>{
    let db_acti = new PouchDB(db_acti_url);
    let actisListData={
      data:[],
      page:{}
    }
    const editItem = req.body
    console.log(editItem);
    //_id 自动生成，丢弃不用
    let {actiname,when,where,point,_id,...info}=editItem;

    try {
      let doc = await db_acti.get(_id);
      try {
        console.log(info)
        /*
        console.log({
            ...doc.info,
            ...info
          })
          */
        let response = await db_acti.put({
          ...doc,
          _id:_id,
          _rev:doc._rev,
          info:{
            ...doc.info,
            ...info
          }

        });
        let allDocs = await db_acti.allDocs({
          include_docs: true,
        })
        actisListData.data =allDocs.rows.map((obj)=>{
          return {
            ...obj.doc,
            ...obj.doc.info
          }
        })
        actisListData.page ={
          total: actisListData.data.length,
          current: 1
        }
        
        return res.send({success: true, data: actisListData.data, page: actisListData.page})
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
        data: '要更新的用户不存在'
      });
    }
  },
  getacti: async (req, res)=> {
    let db_acti=new PouchDB(db_acti_url);
    try {
      let result = await db_acti.allDocs({
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
  },

  //添加活动
  addacti: async (req, res)=> {
    let db_acti = new PouchDB(db_acti_url);
    console.log(req.body);

    //let {acti}=req.body
    let {title,when,where,about,point} =req.body;
    let time=util.time();
    /*
    let title=req.body.title;
    let when=req.body.when;
    let where=req.body.where;
    let about=req.body.about;
    let point=req.body.point;
    let time=util.time();
    */

    let token=req.body.token;

    if (!title || !when || !where || !about || !point ) {
      return res.send({
        status: 0,
        data: '信息填写不全'
      });
    } else if (!checkAdmin(token)) {
      return res.send({
        status: 0,
        data: '没有管理员权限'
      });
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
        return res.send({
          status: 0,
          data: '后台维护'
        })
      }
    }
  },
  
};


module.exports = Acti_api;