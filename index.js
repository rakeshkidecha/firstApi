const express = require('express');
const path = require('path');
const port = 8012;
const db = require('./config/db')
const app = express();

const passport = require('passport');
const jwtStrategy = require('./config/passport_jwt_strategy');
const session = require('express-session');

app.use(express.urlencoded());
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

app.use(session({
    name:'jwtSession',
    secret: 'jwtSecret',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:60*60*1000
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use('/',require('./routes'));

app.listen(port,err=>console.log(err?err:"server run on http://localhost:"+port));