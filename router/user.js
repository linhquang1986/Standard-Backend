var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var User = require('../controllers').userController;

router.get('/getAll', User.user_list)

router.post('/addUser', User.user_create)

router.delete('/removeUser/:id', User.user_delete)

router.put('/updateUser/:id', User.user_update)
module.exports = router;