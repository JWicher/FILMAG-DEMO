const express = require('express');
const tasksRouter = require('../routes/tasks');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const localisationsRouter = require('../routes/localisations');
const ResetPasswordRouter = require('../routes/resetPassword');
const getExcelFileRouter = require('../routes/getExcelFile');
const frontendRouter = require('../routes/frontend');
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');
const checkOrigin_middleware = require('../middleware/checkOrigin');

module.exports = function (app) {
    app.use(express.json());
    app.use(checkOrigin_middleware);
    app.use('/api/auth', authRouter);
    app.use(isAuth_middleware); // autoryzacja, jak nie ma zalogowania to się nie dostanie do pozostałych ścieżek
    app.use(checkActivity_middleware); // wylogowanie usera jak dawno nie był aktywny;
    app.use('/api/tasks', tasksRouter);
    app.use('/api/localisations', localisationsRouter);
    app.use('/api/resetPassword', ResetPasswordRouter);
    app.use('/api/getExcelFile', getExcelFileRouter);
    app.use('/api/users', usersRouter);
    app.use('*', frontendRouter);
}