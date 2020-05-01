const Localisation = require('../models/localisation');
const express = require('express');
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
    if (error) return res.status(400).send("Złe dane wejściowe. Nie można zarejestrować nowej lokalizacji.");

    let localisation = Localisation.methods.createNewLocalisation(req.body);
    localisation = await localisation.save();
    res.status(200).send(localisation);
});

router.put('/:id', async (req, res) => {
    let localisation = await Localisation.model.findById(req.params.id);
    if (!localisation) return res.status(404).send('Nie znaleziono lokalizacji.');

    const latest_ordrer_number_of_category = await Localisation.methods.get_latest_ordrer_number_of_category(req.body.category);
    localisation = await Localisation.model.findByIdAndUpdate(localisation.id, { ...req.body, order_number: latest_ordrer_number_of_category + 1 }, { new: true });
    res.status(200).send(localisation);
});

router.delete('/:id', checkPermission("Admin"), async (req, res) => {
    const localisationToDelete = await Localisation.model.findById(req.params.id);
    if (!localisationToDelete) return res.status(404).send('Nie znaleziono lokalizacji.');

    await Localisation.model.findByIdAndRemove(localisationToDelete.id);
    await Localisation.methods.updateSortOrder(localisationToDelete.category);

    res.status(200).send(localisationToDelete);
})


module.exports = router;