var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var db_user = new PouchDB('http://localhost:3000/db/shit');
/*
db_user.createIndex({
  index: {
    fields: ['foo']
  }
}).then(function (result) {
  // yo, a result
  console.log(result)
}).catch(function (err) {
  // ouch, an error
});
*/
db_user.find({
    selector: {
        username: 'lynn'
    }
}).then(function (result) {
    console.log('username');
}).catch(function (err) {
    console.log(err)
})

.catch(function (err) {
    return db_user.find({
        selector: {
            email: '352281674@qq.com'
        }
    })
}).then(function (result) {
    console.log('email')
}).catch(function (err) {
    return db_user.post({
        username: 'lynn',
        email: "352281674@qq.com"
    })
}).then(function (result) {
    console.log('ok')
}).catch(function (err) {
    console.log(err)
})

