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
    console.log("似乎可以了")
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
  }
}
module.exports = User_get;