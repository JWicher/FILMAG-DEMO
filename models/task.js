const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const utils_general = require('../utils/utils_general');

const taskShcema = new mongoose.Schema({
    location: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true },
    qty: Number,
    partialQty: { type: Number, default: 0 },
    isDone: { type: Boolean, default: false },
    time: { type: Number, default: 0 },
    partialTime: { type: Number, default: 0 },
    takedBy: { type: String, default: "" },
    createdBy: { type: String, required: true },
    closedBy: { type: String, default: "" },
    createdIn: Date,
    createdInFormatedData: String,
    isUrgent: { type: Boolean, default: false }
});


const Task = mongoose.model('Task', taskShcema);

function createNewTask({ location, content, type, qty, createdBy, closedBy }) {
    return new Task({
        location,
        content,
        type,
        qty,
        createdBy,
        closedBy,
        createdIn: utils_general.getCurrentTime(),
        createdInFormatedData: utils_general.getFormatedTime()
    });
}

function validateTask(reqBody) {
    const schema = {
        content: Joi.string().required(),
        type: Joi.string().required(),
        qty: Joi.number(),
        location: Joi.string().required(),
        createdBy: Joi.string().required(),
    }

    return Joi.validate(reqBody, schema);
};

module.exports = {
    model: Task,
    methods: {
        validate: validateTask,
        createNewTask
    }
};