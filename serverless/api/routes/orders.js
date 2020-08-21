const express = require('express');
const router = express.Router();
const OrdersModel = require('../models/orders');
const {isAuthenticated, hasRoles}= require('../auth/index');

//get all the orders
router.get('/', (req, res)=>{
    OrdersModel.find().exec()
        .then(data => res.status(200).send(data))
});

//get only 1 order
router.get('/:id', (req, res)=>{
    OrdersModel.findById(req.params.id).exec()
        .then(data => res.status(200).send(data))
});

//create a order
router.post('/', isAuthenticated, (req, res)=>{
    const {_id} = req.user;

    OrdersModel.create({
        ...req.body,
        user_id: _id,
        }).then(data => res.status(201).send(data))
})

//update an element
router.put('/:id', isAuthenticated, (req, res) => {
    OrdersModel.findOneAndUpdate(req.params.id, req.body)
        .then( () => res.sendStatus(204))
})

//delete a meal
router.delete('/:id', isAuthenticated,(req, res) => {
    OrdersModel.findOneAndDelete(req.params.id).exec()
        .then(() => res.sendStatus(204))
})

module.exports = router;