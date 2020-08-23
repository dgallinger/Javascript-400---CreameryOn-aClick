const express = require("express");

const routes = require("./routes");

const server = express();
server.use(express.json());
server.use(express.static('files'));


// const mustacheExpress = require('mustache-express');
// server.engine('mustache', mustacheExpress());
// server.set('view engine', 'mustache');


// view engine setup
const expressHbs = require('express-handlebars');
server.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
server.set('view engine', '.hbs');

server.use(routes);

module.exports = server;
