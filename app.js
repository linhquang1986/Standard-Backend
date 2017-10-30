var express = require('express');
var appConfig = require('./config');
var app = express();
//var mysql = require('mysql');

app.use(require('./web/router/user.js'));

app.listen(5000);
console.log('Server running on port 5000');