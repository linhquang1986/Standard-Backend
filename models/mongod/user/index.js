var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  passwork: { type: String, required: true },
  admin: Boolean,
  address: String,
  email: String,
  created_at: Date,
  updated_at: Date
}, { versionKey: false });

var User = mongoose.model('User', userSchema);
module.exports = User;