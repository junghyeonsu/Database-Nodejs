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
    fs.createReadStream('./Sign/test.html').pipe(res);
})

app.post('/name',function(req,res){
    var sql = 'select * from infor2';
    var id = req.body.name1;
    var password = req.body.pass;
    connection.query(sql,function(err,row,field){
        if(err) throw err;
        var checked = 0;
        var name1;
        var realid;
        for(var i = 0; i<row.length ; i++){
            if(id == row[i].id && password == row[i].password){
                checked = 1;
                name1 = row[i].name;
                realid = row[i].id;
                break;
            }
        }

        if(checked == 1){
            res.render('d',{
                name : name1,
                id : realid,
            })
        }
        else{
            res.send(`<script>
                alert('아이디 혹은 비밀번호가 틀렸습니다!');
                history.back();
            </script>`);
        }
    })
})

app.post('/find',function(req,res){
    res.writeHead(202,{'Content-Type' : "text/html ; charset=utf-8"});
    fs.createReadStream('./Sign/find.html').pipe(res);
})

app.post('/make',function(req,res){//회원가입 html 구현
    res.writeHead(202,{'Content-Type' : "text/html ; charset=utf-8"});
    fs.createReadStream('./Sign/makeAccount.html').pipe(res);
});

app.post('/success',function(req,res){
    var name = req.body.name1;
    var id = req.body.id;
    var pass = req.body.pass;
    
    var sql = 'select * from infor2';
    connection.query(sql,function(err,row,field){
        if(err) throw err;
        var checked = 0;
        for(var i = 0 ; i < row.length ; i++){
            if(id == row[i].id){
                checked = 1;
            }
        }
        if(checked == 0){
            var sql2 = `insert into infor2 (name,id,password) values('${name}','${id}','${pass}') `;
            connection.query(sql2,function(err,row,field){
                console.log('입력성공!');
                res.send(`<script>  
                history.go(-2);
            </script>`);

            })
        }else{
            res.send(`<script>
                alert('중복된 아이디야!');
                history.back();
            </script>`);
        }
    })
})

app.post('/find/findId',function(req,res){
    res.send(`<form method="post" action="/find/findId/success">
    이름을 입력하세요 : <input type="text" name="name1"/> <br />
    <button>찾기 </button>
   </form>`);
})

app.post('/find/findPass',function(req,res){
    res.send(`<form method="post" action="/find/findPass/success">
    아이디을 입력하세요 : <input type="text" name="id"/> <br />
    <button>찾기 </button>
   </form>`);
})

app.post('/find/findId/success',function(req,res){
    var name = req.body.name1;
    var sql4 = 'select * from infor2';
    connection.query(sql4,function(err,row,field){
        if(err) throw err;
        var checked = 0;
        var id;
        for(var i = 0; i < row.length; i++){
            if(row[i].name == name){
                checked = 1;
                id = row[i].id;
                break;
            }
        }

        if(checked == 1){
            res.send(`<script>
            alert('아이디는 ${id} 입니다.');
            history.go(-3);
            </script>`);
        }else{
            res.send(`<script>
            alert('가입된 아이디가 없습니다.');
            history.go(-3);
            </script>`);
        }
    })
})

app.post('/find/findPass/success',function(req,res){
    var id = req.body.id;
    var sql5 = 'select * from infor2';
    connection.query(sql5,function(err,row,field){
        if(err) throw err;
        var checked = 0;
        var password;
        for(var i = 0; i < row.length; i++){
            if(row[i].id == id){
                checked = 1;
                password = row[i].password;
                break;
            }
        }

        if(checked == 1){
            res.send(`<script>
            alert('아이디는 ${id} 비밀번호는 ${password} 입니다.');
            history.go(-3);
            </script>`);
        }else{
            res.send(`<script>
            alert('가입된 아이디가 없습니다.');
            history.go(-3);
            </script>`);
        }
    })
})

app.post("/name/delete",function(req,res){
    res.send(`<script>
        alert('정말 삭제할거양~?');
    </script>`);
    
    var id = req.body.name1;
    console.log(id);
    var sql6 = "select * from infor2";
    connection.query(sql6,function(err,row,field){
        if(err) throw err;
        var checked = 0;
        for(var i =0; i<row.length;i++){
            if(id == row[i].id){
                checked = 1;
                break;
            }
        }

        if(checked == 1){
            var sql7 = `delete from infor2 where id= '${id}'`;
            connection.query(sql7,function(err,row,field){
                if(err) throw err;
                console.log(`${id} 삭제`);
            });
            res.send(`<script>
            <div> ${id} 가 삭제되었습니다. </div>
        </script>`);
        }
    })
});

app.listen(7000,function(){
    console.log('hello');
})
