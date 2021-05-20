const cron = require("node-cron");
const logger = require("../utils/logger");
const util_database = require('../utils/util_database');
const utils_userActivity = require('../utils/utils_userActivity');
const utils_logs = require('../utils/utils_logs');

module.exports = function (io) {
    cron.schedule("59 23 * * *", util_database.makeBackupDB);
    cron.schedule('* * * * *', () => util_database.increasePendingTime(io));
    cron.schedule('0 0 */2 * * *', () => utils_userActivity.checkUsersAndLogout(io));
    cron.schedule("55 23 * * Sun", utils_logs.makeLogsBackup);
    
    logger.info(`✔︎ - Setting crons`);
};
