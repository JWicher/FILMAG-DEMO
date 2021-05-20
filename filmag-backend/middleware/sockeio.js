module.exports = (io) => function (req, res, next) {
    req.io = io;
    return next();
};
