const express = require('express');
const router = express.Router();
const MealsModel = require('../models/meals')

//get all the meals
router.get('/', (req, res)=>{
    MealsModel.find().exec()
        .then(data => res.status(200).send(data))
        .catch((e) => console.log(e))
});

//get only 1 meal
router.get('/:id', (req, res)=>{
    MealsModel.findById(req.params.id).exec()
        .then(data => res.status(200).send(data))
});

//create a meal
router.post('/', (req, res)=>{
    MealsModel.create(req.body)
        .then(data => res.status(201).send(data))
})

//update an element
router.put('/:id', (req, res) => {
    MealsModel.findOneAndUpdate(req.params.id, req.body)
        .then( () => res.sendStatus(204))
})

//delete a meal

router.delete('/:id', (req, res) => {
    MealsModel.findOneAndDelete(req.params.id).exec()
        .then(() => res.sendStatus(204))
})
module.exports = router;