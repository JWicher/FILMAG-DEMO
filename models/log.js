const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const logTypes = {
    "error": 100,
    "warn": 10,
    "info": 1
};

const logShcema = new mongoose.Schema({
    type: { type: String, enum : Object.keys(logTypes), required: true },
    message: { type: String },
    author: { 
        name: { type: String, required: true },
        _id: { type: String, required: true }
    },
    time: { type: Date, default: "" }
});

const Log = mongoose.model('Log', logShcema);

function createNewLog(incomingData) {
    return new Log({
        type: incomingData.type,
        message: incomingData.message,
        author: incomingData.author,
        time: incomingData.time,
    });
}

function validateLog(reqBody) {
    const schema = {
        type: Joi.string().allow(...Object.keys(logTypes)).required(),
        message: Joi.string().required(),
        author: Joi.object().keys({
            name: Joi.string().required(),
            _id: Joi.string().required()
          }).required(),
        message: Joi.string().required(),
        time: Joi.number().required()
    };
    return Joi.validate(reqBody, schema);
};

module.exports = {
    model: Log,
    methods: {
        validate: validateLog,
        createNewLog
    },
    logTypes
};
