const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Localisation = require('../models/localisation');
const logger = require("../utils/logger");

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
        logger.warn(`Registering new user failed. Error: ${JSON.stringify(error)}`);
        return res.status(400).send(error.details[0].message);
    }

    const nameAlreadyInUse = await User.model.findOne({ name: req.body.name });
    if (nameAlreadyInUse) {
        logger.warn(`Registering new user failed. Name "${req.body.name}" already used by other user`);
        return res.status(400).send("Użytkownik o tej nazwie już jest zarejestrowany. Podaj inną nazwę dla nowego konta.");
    }

    const salt = await bcrypt.genSalt(10);

    const user = User.methods.createNewUser(req.body);
    user.password = await bcrypt.hash(constants.defaultPassword, salt);
    user.shortIdentifier.idCode = await User.methods.getUniqueIdCode();
    user.shortIdentifier.pin = await User.methods.generateUserPIN();

    const newUser = await user.save();
    const userWithoutCredencials = User.methods.getUserWithoutCredencials(newUser);

    req.io.emit('users_updated', `Added new user wiith ID: ${newUser._id}`);
    logger.info(`Added new user with ID: "${newUser._id}" by "${req.user?.name}"`);

    res.status(200).send(userWithoutCredencials);
});

router.put('/:id', async (req, res) => {
    let user = await User.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
        logger.warn(`Updating user failed. Could not find user with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono konta w bazie danych.')
    };

    user = User.methods.getUserWithoutCredencials(user);

    req.io.emit('users_updated', `Updated user wiith ID: ${user._id}`);
    logger.info(`Updated user with ID: "${user._id}" by "${req.user?.name}"`);

    res.status(200).send(user);
});

router.patch('/:id', async (req, res) => {
    let user = await User.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
        logger.warn(`Updating user failed. Could not find user with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono konta w bazie danych.')
    };

    if (req.body.isLogged === false) utils_userActivity.removeUserFromActiveUsers(user);
    user = User.methods.getUserWithoutCredencials(user);

    req.io.emit('users_updated', `Updated user wiith ID: ${user._id}`);
    logger.info(`Updated user with ID: "${user._id}" by "${req.user?.name}"`);

    res.status(200).send(user);
});

router.delete('/:id', block_if_its_not("Admin"), async (req, res) => {
    let user = await User.model.findByIdAndRemove(req.params.id);
    if (!user) {
        logger.warn(`Deleting user failed. Could not find user with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono konta w bazie danych.')
    };

    req.io.emit('users_updated', `Deleted user wiith ID: ${user._id}`);
    logger.info(`Deleted user with ID: "${user._id}" by "${req.user?.name}"`);

    res.status(200).send(user);
})

module.exports = router;
