const express = require('express');
const router = express.Router();
const FinishGood = require('../models/finishGood');
const Logger = require("../utils/logger");

const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', async (req, res) => {
    const finishGoods = await FinishGood.model.find().sort({ createdAt: -1 });
    res.send(finishGoods)
});

router.get('/:id', async (req, res) => {
    const finishGood = await FinishGood.model.findById(req.params.id)
        res.status(200).send(finishGood)
});

router.post('/', async (req, res) => {
    const { error } = FinishGood.methods.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newFinishGood = FinishGood.methods.createFinishGood(req.body);
    newFinishGood = await newFinishGood.save();

    // Logger.info(`Successfully added new finish good: ${newFinishGood._id}`, req.user)

    res.send(newFinishGood);
})

router.delete('/:id', async (req, res) => {
    const finishGood = await FinishGood.model.findByIdAndRemove(req.params.id);
    if (!finishGood) return res.status(404).send('Nie znaleziono produktu w bazie danych');

    // Logger.info(`Successfully deleted finish good: ${finishGood._id}`, req.user)

    res.status(200).send(finishGood);
});

router.put('/:id', async (req, res) => {
    let updatedFinishGood = await FinishGood.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFinishGood) return res.status(404).send('Nie znaleziono produktu w bazie danych');

    // Logger.info(`Successfully updated finish good: ${updatedFinishGood._id}`, req.user)

    res.status(200).send(updatedFinishGood);
});

module.exports = router;