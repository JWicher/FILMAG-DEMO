const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const logger = require("../utils/logger");

const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

const constants = require("../constants/constants");

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.patch('/:id', async (req, res) => {
  const { error } = validateOnlyPassword(req.body);
  if (error) {
    logger.warn(`Password reset failed. Error: ${JSON.stringify(error)}`);
    return res.status(400).send(error.details[0].message)
  };

  const user = await User.model.findById(req.params.id);
  if (!user) {
    logger.warn(`Password reset failed. Could not find user with ID: ${req.params.id}`);
    return res.status(404).send("Nie znaleziono konta")
  };

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    logger.warn(`Password reset failed. Provided wrong old password by user with ID: ${req.params.id}`);
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

  logger.info(`Reseting password for user with ID: "${updatedUser._id}" by "${req.user?.name}"`);

  res.status(200).send(token);
});

router.get('/default/:id', async (req, res) => {
  const user = await User.model.findById(req.params.id);
  if (!user) {
    logger.warn(`Password reset to default failed. Could not find user with ID: ${req.params.id}`);
    return res.status(404).send("Nie znaleziono konta")
  };

  const salt = await bcrypt.genSalt(10);
  const defaultPassowrd = constants.defaultPassword;
  user.password = await bcrypt.hash(defaultPassowrd, salt);

  const updatedUser = await user.save();

  logger.info(`Reseting password to default for user with ID: "${updatedUser._id}" by "${req.user?.name}"`);

  res.status(200).send(updatedUser._id);
});

function validateOnlyPassword(reqBody) {
  const schema = Joi.object({
    password: Joi.string().min(1).max(255).required(),
    newPassword: Joi.string().min(1).max(255),
    newPIN: Joi.string().min(4).max(4),
  });

  const error = schema.validate(reqBody);
  return error
}

module.exports = router;
