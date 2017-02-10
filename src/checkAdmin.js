let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
let db_user_url = 'http://localhost:3456/shit';
let db_user = new PouchDB(db_user_url);

let adminEmail='352281674@qq.com'

let checkAdminByToken= async (token)=>{
  try{
    let token_email =await db_user.find({
      selector: {
       token:token,
       email:adminEmail,
     }
    })
    if (token_email['docs'].length > 0) {
      return true
    } else {
      return false
    }
  } catch(err){
    console.log(err)
    return false
  }
}
export {
  checkAdminByToken as checkAdmin
}