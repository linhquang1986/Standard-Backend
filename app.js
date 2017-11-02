var express = require('express');
var path = require('path');
var appConfig = require('./config');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

let database = require('./models');
new database.database_mongod.connection();

app.use('/', require('./router'));

app.listen(5000);
console.log('Server running on port 5000');

