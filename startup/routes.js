const express = require('express');

const tasksRouter = require('../routes/tasks');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const localisationsRouter = require('../routes/localisations');
const finishGoods = require('../routes/finishGoods');
const logs = require('../routes/logs');
const ResetPasswordRouter = require('../routes/resetPassword');
const getExcelFileRouter = require('../routes/getExcelFile');
const healthCheckRouter = require('../routes/healthCheck');

const frontendRouter = require('../routes/frontend');

module.exports = function (app, io) {
    app.use(express.json());
    app.use('/api',  function (req, res, next) {
        req.io = io;
        return next();
    });
    app.use('/api/auth', authRouter);
    app.use('/api/tasks', tasksRouter);
    app.use('/api/localisations', localisationsRouter);
    app.use('/api/resetPassword', ResetPasswordRouter);
    app.use('/api/getExcelFile', getExcelFileRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/finishGoods', finishGoods);
    app.use('/api/logs', logs);
    app.use('/api', healthCheckRouter);
    app.use('/', frontendRouter);
}