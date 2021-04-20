const Log = require('../models/log');
const utils_general = require('./utils_general')

module.exports = {
    error: async ({message, user}) => {
        let newLog = Log.methods.createNewLog({
            type: "error",
            message: message,
            author: {
                name: user.name,
                _id: user._id
            },
            time: utils_general.getCurrentTime(),
        });
        await newLog.save();
    },
    warn: async ({message, user}) => {
        let newLog = Log.methods.createNewLog({
            type: "warn",
            message: message,
            author: {
                name: user.name,
                _id: user._id
            },
            time: utils_general.getCurrentTime(),
        });
        await newLog.save();
    },
    info: async (message, user) => {
        let newLog = Log.methods.createNewLog({
            type: "info",
            message: message,
            author: {
                name: user.name,
                _id: user._id
            },
            time: utils_general.getCurrentTime(),
        });
        await newLog.save();
    }
}