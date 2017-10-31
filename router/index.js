var express = require('express');
var router = express.Router();

let users = require('./user');
let upload = require('./uploadImg');

router.use('/users', users)
router.use('/upload', upload)

module.exports = router;