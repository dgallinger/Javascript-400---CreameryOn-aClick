const express = require("express");
const path = require('path');
const routes = require("./routes");
const server = express();
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

server.use(express.json());
server.use(express.static('files'));
// const mustacheExpress = require('mustache-express');
// server.engine('mustache', mustacheExpress());
// server.set('view engine', 'mustache');
// setup view engine


// view engine setup
const expressHbs = require('express-handlebars');
server.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)})
);
    server.set('view engine', '.hbs');


server.use(express.static(path.join(__dirname, 'public')));

server.use(routes);

module.exports = server;
