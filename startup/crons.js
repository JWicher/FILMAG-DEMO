const cron = require("node-cron");
const util_database = require('../utils/util_database');
const utils_userActivity = require('../utils/utils_userActivity');

module.exports = function (io) {
    cron.schedule("59 23 * * *", util_database.makeBackupDB);
    cron.schedule('* * * * *', () => util_database.increasePendingTime(io));
    cron.schedule('0 0 */2 * * *', () => utils_userActivity.checkUsersAndLogout(io));
}