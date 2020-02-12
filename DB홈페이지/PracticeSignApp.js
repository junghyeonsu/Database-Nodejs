const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(__dirname + "/views"));
app.set('view engine','ejs');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '123456',
    database : 'test'
})

connection.connect();

app.get('/',function(req,res){//초기화면 구현
    res.writeHead(202,{'Content-Type' : "text/html ; charset=utf-8"});
    fs.createReadStream('./practiceSignApp/index.html').pipe(res);
})

app.post('/input',function(req,res){
    var id = req.body.userId;
    var password = req.body.password;
    var name = req.body.name;

    var sql = 'select * from login';
    connection.query(sql,function(err,row,field){
        if(err) throw err;
        var sql2 = `insert into login (name,user_id,password,register_date) values('${name}','${id}','${password}',now()) `;
        connection.query(sql2,function(err,row,field){
            res.send(`<script>
                alert("데이터베이스에 넣었습니다!");
                history.go(-1);
            </script>`);
        })
    })
})

app.post('/show',function(req,res){
    var sql3 = 'select * from login';
    connection.query(sql3,function(err,row,field){
        if (err) throw err;

        var user = {
                    uniqueId: [],
                    id : [],
                    password : [],
                    name : [],
                    register_date : [] 
                   };

        for(var i = 0 ; i < row.length; i++) {
            user.uniqueId = user.uniqueId.concat(row[i].id);
            user.id = user.id.concat(row[i].user_id);
            user.password = user.password.concat(row[i].password);
            user.name = user.name.concat(row[i].name);
            user.register_date = user.register_date.concat(row[i].register_date);
        }
        res.render('b',{
            user : user
        })
    })
})

app.post('/delete',function(req,res){
    var uniqueId = req.body.deleteNumber;
    var sql4 = "select * from login";
    connection.query(sql4,function(err,row,field){
        if(err) throw err;
        var sql5 = `delete from login where id="${uniqueId}"`;
        connection.query(sql5,function(err,row,field){
            if(err) throw err;
            console.log(`${uniqueId}번 삭제`);
        })
        res.send(`<script>
        alert("${uniqueId}번을 삭제하였습니다!");
        history.go(-2);
        </script>`);
    })
})

app.listen(7000,function(){
    console.log('server start at http://localhost:7000/');
})