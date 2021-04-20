const mongoose = require('mongoose');
const config = require('config');
// const winston = require('winston');

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const db = config.get('db');

module.exports = function () {
    console.log('db = ', `${db.substr(0, 20)}...`)

    mongoose.connect(db, { useNewUrlParser: true })
        .then(() => { console.log("Połączono z bazą danych...") })
        .catch((error) => console.log(error));
}
