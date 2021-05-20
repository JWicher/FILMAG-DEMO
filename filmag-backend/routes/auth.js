const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const logger = require("../utils/logger");

const User = require('../models/user');
const utils_loginAtempts = require('../utils/utils_loginAtempts');
const utils_general = require('../utils/utils_general');

const schema = {
    userAuth: Joi.object({
        name: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    }),
    shortIdentifier: Joi.object({
        idCode: Joi.string().min(3).max(3).uppercase(),
        pin: Joi.string().min(4).max(4).uppercase()
    })
};

router.post('/', async (req, res) => {
    const { error } = validate(req.body, schema.userAuth);
    if (error) {
        logger.warn(`User login failed. Error while validating provided data with schema for credentials. User "${req.body?.name}". Error: ${JSON.stringify(error)}`);
        return res.status(400).send(error.details[0].message);
    }

    const reqBodyNameLowerCased = req.body?.name.toLowerCase();
    
    let user = await User.model.findOne({ name: { $regex: new RegExp("^" + reqBodyNameLowerCased, "i") } });

    if (!user) {
        logger.warn(`User login failed. User "${req.body?.name}" does not exist in DB`);
        return res.status(400).send('Nieprawidłowy login lub hasło');
    }

    const canStillAtemptToLogin = utils_loginAtempts.checkUserLoginAtempts(reqBodyNameLowerCased);
    if (!canStillAtemptToLogin) {
        logger.warn(`User login failed. User "${req.body?.name}" has been temporary blocked because of to many attempts`);
        return res.status(400).send('Zbyt wiele prób logowania. Kolejna próba możliwa po upływie minuty');
    }

    const validPassword = await bcrypt.compare(req.body?.password, user.password);
    if (!validPassword) {
        logger.warn(`User login failed. User "${req.body?.name}" provided wrong password`);
        return res.status(400).send('Nieprawidłowy login lub hasło');
    }

    utils_loginAtempts.removeLoginFromAtemptedLogins(reqBodyNameLowerCased);
    user = await utils_general.changeIsLogged_to_true(user);

    req.io.emit('users_updated', `User "${user.name}" wiith ID: ${user._id} is logged now`);
    logger.info(`User "${user.name}" successfully logged in`);
    
    const token = user.generateAuthToken();
    
    res.header('x-auth-token', token).send(token)
});


router.delete('/:id', async (req, res) => {
    const user = await User.model.findById(req.params.id);
    if (!user) {
        logger.warn(`Deleting user: failure. Could not find user with ID: "${req.body?.name}"`);
        return res.status(404).send('Nie znaleziono konta w bazie danych');
    }

    user.isLogged = false;
    await User.model.findByIdAndUpdate(req.params.id, user, { new: true })

    req.io.emit('users_updated', `User "${user.name}" wiith ID: ${user._id} logged out`);
    logger.info(`User "${user.name}" successfully logged out`);

    res.status(200).send();
});

router.post('/shortIdentification', async (req, res) => {
    const { error } = validate(req.body, schema.shortIdentifier);
    if (error) {
        logger.warn(`User auth by short identification failed. Error: ${JSON.stringify(error)}`);
        return res.status(400).send(error.details[0].message);
    }

    const { idCode, pin } = req.body;

    const user = await User.model.findOne({
        "shortIdentifier.idCode": idCode,
        "shortIdentifier.pin": pin
    }).select('name');

    if (!user) {
        logger.warn(`User auth by short identification failed. Could not find user with short identificator: ${JSON.stringify({ idCode, pin })}`);
        return res.status(404).send('Nie znaleziono konta w bazie danych');
    }

    logger.info(`User "${user.name}" successfully identified for ID code: "${idCode}"`);
    
    res.status(200).send(user);
});


function validate(object, schema) {
    return schema.validate(object);
}

module.exports = router;
