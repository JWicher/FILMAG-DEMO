const mongoose = require('mongoose');
const config = require('config');
const cron = require("node-cron");
// const winston = require('winston');
const util = require('../utils/util_database');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const db = config.get('db');

console.log('db = ', `${db.substr(0, 20)}...`)

module.exports = function () {
    cron.schedule("59 23 * * *", util.makeBackupDB);
    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => { console.log("Połączono z bazą danych...") })
        .catch((error) => console.log(error));
}
