var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var User = require('./../controllers/user');

router.get('/users/getAll',User.user_list)

router.post('/users/addUser', User.user_create)

router.delete('/users/removeUser/:id',User.user_delete)

router.put('/users/updateUser/:id',User.user_update)
module.exports = router;