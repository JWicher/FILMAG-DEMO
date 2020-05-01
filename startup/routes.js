const express = require('express');
const tasksRouter = require('../routes/tasks');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const localisationsRouter = require('../routes/localisations');
const ResetPasswordRouter = require('../routes/resetPassword');
const getExcelFileRouter = require('../routes/getExcelFile');
const frontendRouter = require('../routes/frontend');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/auth', authRouter);
    app.use('/api/tasks', tasksRouter);
    app.use('/api/localisations', localisationsRouter);
    app.use('/api/resetPassword', ResetPasswordRouter);
    app.use('/api/getExcelFile', getExcelFileRouter);
    app.use('/api/users', usersRouter);
    app.use('/', frontendRouter);
}