const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.patch('/:id', async (req, res) => {
  const { error } = validateOnlyPassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.model.findById(req.params.id);
  if (!user) return res.status(404).send("Nie znaleziono konta");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Nieprawidłowe hasło');
  }

  if (req.body.newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.newPassword, salt);
  }

  if (req.body.newPIN) {
    user.shortIdentifier.pin = req.body.newPIN;
  }

  const updatedUser = await user.save();
  const token = updatedUser.generateAuthToken();

  res.status(200).send(token);
});


function validateOnlyPassword(reqBody) {

  const schema = {
    password: Joi.string().min(1).max(255).required(),
    newPassword: Joi.string().min(1).max(255),
    newPIN: Joi.string().min(4).max(4),
  };

  const error = Joi.validate(reqBody, schema);
  return error
}

module.exports = router; 
