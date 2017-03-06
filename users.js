var J=require('j');
var base=J.readFile("./users.xls")[1]["Sheets"]["Sheet1"];
console.log(base['!range']['e']['r']+1);


var put=function(){

    for (var i=2;i<=base['!range']['e']['r'];i++) {
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
