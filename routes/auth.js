const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Logger = require("../utils/logger");
const utils_loginAtempts = require('../utils/utils_loginAtempts');
const utils_general = require('../utils/utils_general');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    const reqBodyNameLowerCased = req.body.name.toLowerCase();
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.model.findOne({ name: { $regex: new RegExp("^" + reqBodyNameLowerCased, "i") } });
    if (!user) {
        return res.status(400).send('Nieprawidłowy login lub hasło.');
    }

    const canStillAtemptToLogin = utils_loginAtempts.checkUserLoginAtempts(reqBodyNameLowerCased);
    if (!canStillAtemptToLogin) {
        return res.status(400).send('Zbyt wiele prób logowania. Kolejna próba możliwa po upływie minuty.');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Nieprawidłowy login lub hasło.');
    }

    utils_loginAtempts.removeLoginFromAtemptedLogins(reqBodyNameLowerCased);
    user = await utils_general.changeIsLogged_to_true(user);

    const token = user.generateAuthToken();

    req.io.emit('users_updated', `User "${user.name}" wiith ID: ${user._id} is logged now`);
    // Logger.info("Successfully logged in", user)

    res.header('x-auth-token', token).send(token)
});


router.delete('/:id', async (req, res) => {
    const user = await User.model.findById(req.params.id);
    if (!user) return res.status(404).send('Nie znaleziono konta w bazie danych.');

    user.isLogged = false;
    await User.model.findByIdAndUpdate(req.params.id, user, { new: true })

    req.io.emit('users_updated', `User "${user.name}" wiith ID: ${user._id} logged out`);
    // Logger.info("Successfully logged out", user)

    res.status(200).send();
});

router.post('/shortIdentification', async (req, res) => {
    const { idCode, pin } = req.body;

    const user = await User.model.findOne({
        "shortIdentifier.idCode": idCode,
        "shortIdentifier.pin": pin
    }).select('name');

    if (!user) return res.status(404).send('Nie znaleziono konta w bazie danych.');
    res.status(200).send(user);
});


function validate(req) {
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router; 
