'use strict';

/**
 * https://github.com/vczero/guid/blob/master/guid.js
 * guid: we can use to create token or id...
 * Inspired from the book of JavaScript Patterns, Stoyan Stefanov
 * You can add some special value in this guid, such as user's email or nickname or id.
 * For example, I added a ObjectId(mongoDB) to this guid in my project.
 * @module guid
 */

var crypto = require('crypto');
var fs = require('fs');
module.exports = {

  time: function () {
    return new Date().toLocaleString();
  },

  guid: function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    }).toUpperCase();
  },

  md5: function (password) {
    var md5 = crypto.createHash('md5');
    var salt = '(!%$88hs@gophs*)#sassb9';
    var newPwd = md5.update(password + salt).digest('hex');
    return newPwd;
  },

  md5_users: function (password) {
    var md5 = crypto.createHash('md5');
    //var salt = '(!%$88hs@gophs*)#sassb9';
    var salt = '&ezYdV7E&dFcw!nnoOv1fvp';
    var newPwd = md5.update(password + salt).digest('hex');
    return newPwd;
  },

  getKey: function () {
    return 'HSHHSGSGGSTWSYWSYUSUWSHWBS-REACT-NATIVE';
  },
  readdir: function (PATH) {
    return new Promise((resolve, reject) => {
      fs.readdir(PATH, function (err, list) {
        if (err) {
          reject(err);
        } else {
          resolve(list);
        }
      });
    });
  },
  readFile: function (file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

};