const express = require('express');

const tasksRouter = require('../routes/tasks');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const localisationsRouter = require('../routes/localisations');
const finishGoodsDouter = require('../routes/finishGoods');
const ResetPasswordRouter = require('../routes/resetPassword');
const getExcelFileRouter = require('../routes/getExcelFile');
const healthCheckRouter = require('../routes/healthCheck');
const sockeioMiddleware = require('../middleware/sockeio');
const logsRouter = require('../routes/logs');
const frontendRouter = require('../routes/frontend');

const logger = require("../utils/logger");

module.exports = function (app, io) {
    app.use(express.json());
    app.use('/api', healthCheckRouter);
    app.use('/api',  sockeioMiddleware(io));
    app.use('/api/auth', authRouter);
    app.use('/api/tasks', tasksRouter);
    app.use('/api/localisations', localisationsRouter);
    app.use('/api/resetPassword', ResetPasswordRouter);
    app.use('/api/getExcelFile', getExcelFileRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/finishGoods', finishGoodsDouter);
    app.use('/api/logs', logsRouter);
    app.use('/', frontendRouter);

    logger.info(`✔︎ - Setting routes`);
};
