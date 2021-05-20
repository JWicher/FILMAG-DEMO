const express = require('express');
const Localisation = require('../models/localisation');
const logger = require("../utils/logger");

const router = express.Router();
const checkPermission = require('../middleware/checkPermission');
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', async (req, res) => {
    const allLocalisations = await Localisation.model.find().sort({ order_number: 1 });
    res.status(200).send(allLocalisations);
});

router.post('/', checkPermission("Admin"), async (req, res) => {
    const { error } = Localisation.methods.validate(req.body);
    if (error) {
        logger.warn(`Registering new localisation failed. Error: ${JSON.stringify(error)}`);
        return res.status(400).send("Złe dane wejściowe. Nie można zarejestrować nowej lokalizacji.");
    }

    let localisation = Localisation.methods.createNewLocalisation(req.body);
    localisation = await localisation.save();

    req.io.emit('localisations_updated', `Added new localisation wiith ID: ${localisation._id}`);
    logger.info(`Added localisation with ID: "${localisation._id}" by "${req.user?.name}"`);

    res.status(200).send(localisation);
});

router.put('/:id', async (req, res) => {
    let localisation = await Localisation.model.findById(req.params.id);
    if (!localisation) {
        logger.warn(`Updating localisation failed. Could not find finish good with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono lokalizacji.')
    };

    const latest_order_number_of_category = await Localisation.methods.get_latest_order_number_of_category(req.body.category);
    localisation = await Localisation.model.findByIdAndUpdate(localisation.id, { ...req.body, order_number: latest_order_number_of_category + 1 }, { new: true });

    req.io.emit('localisations_updated', `Updated localisation wiith ID: ${localisation._id}`);
    logger.info(`Updated localisation with ID: "${localisation._id}" by "${req.user?.name}"`);

    res.status(200).send(localisation);
});

router.delete('/:id', checkPermission("Admin"), async (req, res) => {
    const localisation = await Localisation.model.findById(req.params.id);
    if (!localisation) {
        logger.warn(`Deleting localisation failed. Could not find localisation with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono lokalizacji.')
    };

    await Localisation.model.findByIdAndRemove(localisation.id);
    await Localisation.methods.updateSortOrder(localisation.category);

    req.io.emit('localisations_updated', `Deleted localisation wiith ID: ${localisation._id}`);
    logger.info(`Deleted localisation with ID: "${localisation._id}" by "${req.user?.name}"`);

    res.status(200).send(localisation);
})


module.exports = router;
