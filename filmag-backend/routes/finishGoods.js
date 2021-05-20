const express = require('express');
const router = express.Router();
const FinishGood = require('../models/finishGood');
const logger = require("../utils/logger");

const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware);
router.use(checkActivity_middleware);

router.get('/', async (req, res) => {
    const finishGoods = await FinishGood.model.find().sort({ createdAt: -1 });
    res.send(finishGoods);
});

router.get('/:id', async (req, res) => {
    const finishGood = await FinishGood.model.findById(req.params.id);
    res.status(200).send(finishGood);
});

router.post('/', async (req, res) => {
    const { error } = FinishGood.methods.validate(req.body);
    if (error) {
        logger.warn(`Registering finish good failed. Error: ${JSON.stringify(error)}`);
        return res.status(400).send(error.details[0].message)
    };

    let newFinishGood = FinishGood.methods.createFinishGood(req.body);
    newFinishGood = await newFinishGood.save();

    req.io.emit('finishgoods_updated', `Added new finishgood wiith ID: ${newFinishGood._id}`);
    logger.info(`Added new finish good: ${newFinishGood._id} by "${req.user?.name}"`);

    res.send(newFinishGood);
})

router.delete('/:id', async (req, res) => {
    const finishGood = await FinishGood.model.findByIdAndRemove(req.params.id);
    if (!finishGood) {
        logger.warn(`Deleting finish good failed. Could not find finish good with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono produktu w bazie danych')
    };

    req.io.emit('finishgoods_updated', `Deleted finishgood wiith ID: ${finishGood._id}`);
    logger.info(`Deleted finish good: ${finishGood._id} by "${req.user?.name}"`);

    res.status(200).send(finishGood);
});

router.put('/:id', async (req, res) => {
    let updatedFinishGood = await FinishGood.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFinishGood) {
        logger.warn(`Updating finish good failed. Could not find finish good with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono produktu w bazie danych')
    };

    req.io.emit('finishgoods_updated', `Updated finishgood wiith ID: ${updatedFinishGood._id}`);
    logger.info(`Updated finish good: ${updatedFinishGood._id} by "${req.user?.name}"`);

    res.status(200).send(updatedFinishGood);
});

module.exports = router;
