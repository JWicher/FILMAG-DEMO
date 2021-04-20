const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Localisation = require('../models/localisation');
const Logger = require("../utils/logger");

const router = express.Router();
const utils_userActivity = require("../utils/utils_userActivity");
const block_if_its_not = require('../middleware/checkPermission');
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

const constants = require("../constants/constants");

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', async (req, res) => {
    const users = await User.model.find().select('-password');
    res.status(200).send(users);
});

router.get('/:id/localisations', async (req, res) => {
    const user = await User.model.findById(req.params.id)
    const allLocalisations = await Localisation.model.find().sort({ order_number: 1 });
    const userLocalisations = allLocalisations.filter(l => user.permissions.indexOf(l.category) >= 0)

    res.status(200).send(JSON.stringify(userLocalisations))
});


router.post('/', block_if_its_not("Admin"), async (req, res) => {
    const { error } = User.methods.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const nameAlreadyInUse = await User.model.findOne({ name: req.body.name });
    if (nameAlreadyInUse) {
        return res.status(400).send("Użytkownik o tej nazwie już jest zarejestrowany. Podaj inną nazwę dla nowego konta.");
    }

    const salt = await bcrypt.genSalt(10);

    const user = User.methods.createNewUser(req.body);
    user.password = await bcrypt.hash(constants.defaultPassword, salt);
    user.shortIdentifier.idCode = await User.methods.getUniqueIdCode();
    user.shortIdentifier.pin = await User.methods.generateUserPIN();

    const updatedUser = await user.save();
    const userWithoutCredencials = User.methods.getUserWithoutCredencials(updatedUser);

    // Logger.info(`Successfully added new user: ${updatedUser._id}`, req.user)
    req.io.emit('users_updated', `Added new user wiith ID: ${updatedUser._id}`);

    res.status(200).send(userWithoutCredencials);
});

router.put('/:id', async (req, res) => {
    let user = await User.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('Nie znaleziono konta w bazie danych.');
    user = User.methods.getUserWithoutCredencials(user);

    // Logger.info(`Successfully updated user: ${user._id}`, req.user)
    req.io.emit('users_updated', `Updated user wiith ID: ${user._id}`);

    res.status(200).send(user);
});

router.patch('/:id', async (req, res) => {
    let user = await User.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('Nie znaleziono konta w bazie danych.');
    if (req.body.isLogged === false) utils_userActivity.removeUserFromActiveUsers(user);
    user = User.methods.getUserWithoutCredencials(user);

    // Logger.info(`Successfully updated user: ${user._id}`, req.user)
    req.io.emit('users_updated', `Updated user wiith ID: ${user._id}`);

    res.status(200).send(user);
});

router.delete('/:id', block_if_its_not("Admin"), async (req, res) => {
    let user = await User.model.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('Nie znaleziono konta w bazie danych.');

    // Logger.info(`Successfully deleted user: ${user._id}`, req.user)
    req.io.emit('users_updated', `Deleted user wiith ID: ${user._id}`);

    res.status(200).send(user);
})

module.exports = router;