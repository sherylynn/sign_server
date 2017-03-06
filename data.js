/**
 * Created by lynn on 14-2-22.
 */
var qr= require('qr-image')
    ,fs= require('fs');
//qr.image('http://www.baidu.com/')
//var URL='http://jsbook.duapp.com/';
var URL= 'http://127.0.0.1:18080/'
var qr_URL = qr.image(URL);
qr_URL.pipe(fs.createWriteStream('assets/img/.png'));



var iconv = require('iconv-lite');


//console.log(J.readFile(__dirname+"/book.xls")[1]["Strings"]);
//J.utils.to_json(__dirname+"/book.xls");
//console.log(J.read(__dirname+"/book.xls"));


var J=require('j');
var base=J.readFile(__dirname+"/book.xls")[1]["Sheets"]["Sheet1"];
console.log(base['!range']['e']['r']+1);

//bookdb.destroy();

var put=function(){

    for (var i=2;i<=base['!range']['e']['r'];i++) {
        var qr_png = qr.image(URL+'#/book/'+base['D'+i]['v'], { type: 'png' });
        console.log(URL+'#/book/'+base['D'+i]['v']);
        qr_png.pipe(fs.createWriteStream('assets/img/'+base['D'+i]['v']+'.png'));
        bookdb.put({
            '书名':base['A'+i]['v'],
            '作者':base['B'+i]['v'],
            '出版社':base['C'+i]['v'],
            'ISBN':base['D'+i]['v'],
            '索书号':base['E'+i]['v']
        },base['D'+i]['v'])//索书号中的斜杠不好用,改用ISBN做id
        .then(function(res){

            console.log(res)
        }).catch(function(err){
            console.log(err);
        });
    }
};
put();

