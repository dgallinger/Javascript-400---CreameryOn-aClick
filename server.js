const express = require("express");
const path = require('path');
const routes = require("./routes/index");
const server = express();
const Handlebars = require('handlebars')
const expressHbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const fileUpload = require('express-fileupload');


server.use(express.json());
server.use(express.static('files'));
server.use(fileUpload());
// server.use(express.urlencoded({ extended: true }));




// setup view engine 

server.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)})
);
server.set('view engine', '.hbs');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(validator());
server.use(cookieParser());

// use sessions

server.use(session({
    secret: 'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 60 * 60 * 1000 }
  }));

//display messages
server.use(flash());

// user login
server.use(passport.initialize());
server.use(passport.session()); // store users in a session

server.use(express.static(path.join(__dirname, 'public'))); // for CSS


//setting local variable
server.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session; //saving sessions
    next();
})

server.use(routes);

module.exports = server;
