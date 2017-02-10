'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
let db_user_url = 'http://localhost:3456/shit';
let db_user = new PouchDB(db_user_url);

let adminEmail = '352281674@qq.com';

let checkAdminByToken = (() => {
  var _ref = _asyncToGenerator(function* (token) {
    try {
      let token_email = yield db_user.find({
        selector: {
          token: token,
          email: adminEmail
        }
      });
      if (token_email['docs'].length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  return function checkAdminByToken(_x) {
    return _ref.apply(this, arguments);
  };
})();
exports.checkAdmin = checkAdminByToken;