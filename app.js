 const express = require('express');
 const mysql = require('mysql');
 const sessions = require('express-session');


require('dotenv').config();

 
 
 const app = express();


 app.set('view engine', 'ejs');
 app.use(express.static('public'));
 app.use(express.json());
 app.use(express.urlencoded());

 app.use(sessions({
     secret:process.env.SECRET,
     saveUninitialized:true,
     resave:true
 }));

 app.use((req,res,next)=>{
     if (req.session.userid){
         res.locals.name = req.session.name;
        res.locals.isLoggedin=true;
        next();

     }else{
        res.locals.isLoggedin= false;
         next();
     }

 });

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

const signup_errors = [];
const login_errors=[];

app.get('/',(req,res)=>{
    db.query('select * from `blog-app`.articles',(err,results)=>{
        if(err) throw err ;
       

        res.render('home',{results:results});


    } );
    

});



app.get('/article/:id',(req,res)=>{
    db.query('select * from `blog-app`.articles where article_id=?',[req.params.id],(err,results)=>{


    if(err) throw err ;
    if(results[0].premium===1){
        if(req.session.userid){
            res.render('article',{data:results[0]});
        }else{
            res.redirect(`/login/${req.params.id}`);
        }


    }else{
        res.render('article',{data:results[0]});
    }
   
    


    } );


});

app.get('/login/:id',(req,res)=>{
res.render('login',{errors:login_errors,flag:req.params.id});
});

//if id param below is 1 req is from nav bar else its from one of the articles
app.post('/login/:id',(req,res,next)=>{

    //input validation
    if (req.body.email===''||req.body.password===''){
        login_errors.push({err:'please enter all credentials'});
        res.redirect(`/login/${req.params.id}`);
    }else{
        next();
    }

},(req,res)=>{
    db.query('select * from `blog-app`.users where email = ?',[req.body.email],(err,result)=>{
        if(err) throw err;
        if(result[0]===undefined){
            res.redirect('/signup');
        }else{
            if (result[0].password === req.body.password){
                console.log('auth successful!');
    
                req.session.userid = result[0].id;
    
                req.session.name = result[0].lname;
    
    
    
                
                if(req.params.id == 1){
                    res.redirect('/');
    
                }else{
                   
                        res.redirect(`/article/${req.params.id}`);
                    
                }
    
                
    
            }else{
                console.log('auth failed!');
                res.redirect(`/login/${req.params.id}`);
            }

        }
        // authentication
       

    });

});



app.get('/signup',(req,res)=>{
    res.render('signUp',{errors:signup_errors});

});


app.post('/signup',(req,res,next)=>{
if(req.body.fname===''|| req.body.lname===''||req.body.email===''||req.body.password===''){
    signup_errors.push({err:'please fill all fields'});

    res.redirect('/signup');
}else{
    next();
}



},(req,res)=>{
    db.query('insert into `blog-app`.users(fname,lname,email,password) values(?,?,?,?)',[req.body.fname,req.body.lname,req.body.email,req.body.password],(err,result)=>{
if (err) throw err;
console.log('user registered !');
req.session.userid = result.insertId;
req.session.name = req.body.lname;
res.redirect('/');


    });

});

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');

});





 app.listen(3000);