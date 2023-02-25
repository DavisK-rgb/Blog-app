 const express = require('express');
 const mysql = require('mysql');


require('dotenv').config();

 
 
 const app = express();


 app.set('view engine', 'ejs');
 app.use(express.static('public'));
 app.use(express.json());
 app.use(express.urlencoded());

// db connection
 const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD
});

db.connect((err)=>{
    if (err) throw err;
    console.log('connected!');
    });



app.get('/',(req,res)=>{
    db.query('select * from `blog-app`.articles',(err,results)=>{
        if(err) throw err ;
       

        res.render('home',{results:results});


    } );
    

});



app.get('/article/:id',(req,res)=>{
    db.query('select * from `blog-app`.articles where article_id=?',[req.params.id],(err,results)=>{


    if(err) throw err ;
    
    res.render('article',{data:results[0]});


    } );


});

app.get('/login',(req,res)=>{
res.render('login');
});

app.post('/login',(req,res)=>{
    db.query('select * from `blog-app`.users where email = ?',[req.body.email],(err,result)=>{
        if(err) throw err;
        if (result[0].password === req.body.password){
            console.log('auth successful!');
            res.redirect('/');
        }else{
            console.log('auth failed!');
            res.redirect('/login');
        }

    });

});



app.get('/signup',(req,res)=>{
    res.render('signUp');

});


app.post('/signup',(req,res)=>{
    db.query('insert into `blog-app`.users(fname,lname,email,password) values(?,?,?,?)',[req.body.fname,req.body.lname,req.body.email,req.body.password],(err,result)=>{
if (err) throw err;
console.log('user registered !');
res.redirect('/');


    });

});





 app.listen(3000);