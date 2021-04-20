const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');
const randomstring = require("randomstring");
const lodash_pick = require('lodash/pick');

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 1, lowercase: true, unique: true, required: true },
  password: { type: String, minlength: 5, required: true },
  permissions: { type: [String], default: [] },
  job: { type: String, default: "Operator" },
  isLogged: { type: Boolean, default: false },
  isCommonUser: { type: Boolean, default: false },
  shortIdentifier: {
    idCode: {
      type: String,
      minlength: 3,
      maxlength: 3,
      uppercase: true,
      default: "ABC"
    },
    pin: {
      type: String,
      minlength: 4,
      maxlength: 4,
      default: "1234"
    }
  }
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      job: this.job,
      isCommonUser: this.isCommonUser,
      shortIdentifier: this.shortIdentifier
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model('User', userSchema);


function createNewUser(reqBody) {
  return new User(lodash_pick(reqBody, ['name', 'password']));
}

function getUserWithoutCredencials(user) {
  return lodash_pick(user, ['_id', 'name', 'permissions', 'job', 'isLogged', 'isCommonUser'])
}

async function getUniqueIdCode() {
  let newIdCode = "";
  const users = await User.find();
  const notAlowed = [
    "",
    "AWS",
    "CHU", "CIP",
    "DUP", "DEB",
    "GAY", "GAI", "GEY", "GEJ", "GEI", "GUW",
    "HUJ", "HUI", "HUY", "HOI", "HOY", "HOJ",
    "JEB", "JEP",
    "KRW", "KUT",
    "LES",
    "OPR",
    "PIZ", "PED", "POO", "PIS", "PSL",
    "SRA", "SRU", "SRO", "SRE", "SRI", "SRE", "SRY",
    "UJE",
    "QRW", "QRV",
    "ZJE", 'ZLO"'
  ]
  const allCurrentCodes = users.map(user => user.shortIdentifier.IdCode)

  while (allCurrentCodes.indexOf(newIdCode) >= 0 || notAlowed.indexOf(newIdCode) >= 0) {
    newIdCode = randomstring.generate({
      length: 3,
      charset: 'alphabetic',
      capitalization: 'uppercase'
    });
  }

  return newIdCode
}

async function generateUserPIN() {
  return randomstring.generate({
    length: 4,
    charset: 'numeric'
  });

}

function validateUser(reqBody) {

  const schema = {
    name: Joi.string().min(1).max(255).required()
  }

  return Joi.validate(reqBody, schema);
};

module.exports = {
  model: User,
  methods: {
    validate: validateUser,
    getUniqueIdCode,
    generateUserPIN,
    createNewUser,
    getUserWithoutCredencials,
  }
}