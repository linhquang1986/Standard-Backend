//db connection, database name is mongoosetest
var mongoose = require('mongoose');
module.exports = class {
  constructor() {
    mongoose.connect('mongodb://localhost:27017/mydatabase');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log("connected to mongodb using mongoose")
    });
  }
}
