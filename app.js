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
        console.log(results);

        res.render('home',{results:results});


    } );
    

});



app.get('/article/:id',(req,res)=>{
    db.query('select * from `blog-app`.articles where article_id=?',[req.params.id],(err,results)=>{


    if(err) throw err ;
    
    res.render('article',{data:results[0]});


    } );


});








 app.listen(3000);