 const express = require('express');
require('dotenv').config();

 
 
 const app = express();


 app.set('view engine', 'ejs');
 app.use(express.static('public'));
 app.use(express.json());
 app.use(express.urlencoded());







app.get('/',(req,res)=>{
    res.render('home');

});








 app.listen(3000);