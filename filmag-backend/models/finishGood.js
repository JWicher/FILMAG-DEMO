const Joi = require('joi');
const mongoose = require('mongoose');
const utils_general = require('../utils/utils_general');
const currencyEnums = require("../../filmag-frontend/src/enums/currency.json");

const finishGoodShcema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    qty: { type: Number, required: true  },
    createdAt: { type: Date },
    rawMaterialPrice: {
        value: { type: String, default: "" },
        currency: { type: String, default: "PLN" },
    },
    isReserved: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    reservedBy: { type: String, default: "" },
    closedBy: { type: String, default: "" },
    createdAtFormatedData: { type: String }
});

const FinishGood = mongoose.model('FinishGood', finishGoodShcema);

function createFinishGood({ name, description, qty, rawMaterialPrice_value, rawMaterialPrice_currency, createdBy, reservedBy }) {
    return new FinishGood({
        name,
        description,
        qty,
        rawMaterialPrice: {
            value: rawMaterialPrice_value,
            currency: rawMaterialPrice_currency
        },
        createdAt: utils_general.getCurrentTime(),
        createdBy,
        reservedBy,
        createdAtFormatedData: utils_general.getFormatedTime()
    });
}

function validateFinishGood(reqBody) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        qty: Joi.number().required(),
        rawMaterialPrice_value: Joi.string().allow(''),
        rawMaterialPrice_currency:  Joi.string().valid(...Object.values(currencyEnums)),
        isReserved: Joi.boolean(),
        isClosed: Joi.boolean().required(),
        createdBy: Joi.string().required(),
        reservedBy: Joi.string().allow(''),
        closedBy: Joi.string().allow('')
    });

    return schema.validate(reqBody);
};

module.exports = {
    model: FinishGood,
    methods: {
        validate: validateFinishGood,
        createFinishGood
    }
};
