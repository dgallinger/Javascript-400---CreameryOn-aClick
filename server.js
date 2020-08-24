const express = require("express");
const path = require('path');
const routes = require("./routes");
const server = express();
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('connect-flash');


server.use(express.json());
server.use(express.static('files'));



// setup view engine 
const expressHbs = require('express-handlebars');
server.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)})
);
server.set('view engine', '.hbs');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

server.use(session({
    secret: 'mysupersecret', 
    resave: false, 
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
  }));

server.use(flash());
server.use(passport.initialize());
server.use(passport.session());

server.use(express.static(path.join(__dirname, 'public')));

server.use(routes);

module.exports = server;
