var User = require('../models').database_mongod.user;
var ObjectId = require('mongoose').Types.ObjectId;

exports.user_list = (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    res.json(users)
  })
}

exports.user_create = (req, res) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    passwork: req.body.passwork,
    admin: req.body.admin,
    created_at: new Date()
  });
  newUser.save(err => {
    if (err) throw err;
    res.status(200).send('User created!')
  })
}

exports.user_update = (req, res) => {
  let id = req.params.id;
  let updateUser = {
    name: req.body.name,
    username: req.body.username,
    passwork: req.body.passwork,
    admin: req.body.admin,
    updated_at: new Date()
  };
  User.findByIdAndUpdate(id, updateUser, (err, user) => {
    if (err) throw err;
    res.status(200).send('User updated');
  })
}

exports.user_delete = (req, res) => {
  let id = req.params.id;
  User.findOneAndRemove({ _id: ObjectId(id) }, err => {
    if (err) throw err;
    res.status(200).send('User deleted');
  })
}