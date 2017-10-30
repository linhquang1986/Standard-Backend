var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());

//database
var mongod = require('./../../models/mogoDb.js');
let db = new mongod();

router.get('/users/getAll', (req, res) => {
    db.select('users').then(rs => {
        res.json(rs)
    })
})

router.post('/users/addUser', (req, res) => {
    let data = req.body;
    db.insert(data,'users').then(rs => {
        res.json(rs)
    }, err =>{
        res.json(err)
    })
})

router.delete('/users/removeUser/:_id',(req,res)=>{
    let id = req.params.id;
    let query = {_id : id};
    db.removeRecord('users',query).then(obj => {
        res.json(obj)
    }, err => {
        res.json(err)
    })
})

module.exports = router;