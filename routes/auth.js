const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const utils = require('../utils/utils_general')
const util_loginAtempts = require('../utils/utils_loginAtempts');

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

    const canStillAtemptToLogin = util_loginAtempts.checkUserLoginAtempts(reqBodyNameLowerCased);
    if (!canStillAtemptToLogin) {
        return res.status(400).send('Zbyt wiele prób logowania. Kolejna próba możliwa po upływie minuty.');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send('Nieprawidłowy login lub hasło.');
    }

    util_loginAtempts.removeLoginFromAtemptedLogins(reqBodyNameLowerCased);
    user = await utils.changeIsLogged_to_true(user);

    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(token)
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
