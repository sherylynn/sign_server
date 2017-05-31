var fs = require('fs');
var util = require('./../util');
var qs =require('qs');
var USER_PATH = './database/acti.json';
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


let acti = {

  init: function (app) {
    //console.log('已经加载');
    //app.get('/user/destroy', this.destroyUser)
    //app.post('/user/get', this.getUser);
    app.get('/api/actis', this.actis_get_api);
    app.put('/api/actis', this.actis_put_api);
    app.post('/api/actis', this.actis_post_api);
    app.delete('/api/actis', this.actis_delete_api);
  },
  //获取活动信息
  actis_get_api:(req,res)=>{
    require('./actis_api').actis_get_api(req,res);
    if (module.hot){
      module.hot.accept('./actis_api', function() {
      require('./actis_api').actis_get_api(req,res)
    });
  }},
  
  actis_post_api:(req,res)=>{
    require('./actis_api').actis_post_api(req,res);
    if (module.hot){
      module.hot.accept('./actis_api', function() {
        require('./actis_api').actis_post_api(req,res)
      });
    }
  },
  actis_delete_api:(req,res)=>{
    require('./actis_api').actis_delete_api(req,res);
    if (module.hot){
      module.hot.accept('./actis_api', function() {
        require('./actis_api').actis_delete_api(req,res)
      });
    }
  },
  actis_put_api:(req,res)=>{
    require('./actis_api').actis_put_api(req,res);
    if (module.hot){
      module.hot.accept('./actis_api', function() {
        require('./actis_api').actis_put_api(req,res)
      });
    }
  },
};


module.exports = acti;