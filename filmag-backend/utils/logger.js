const winston = require("winston");
require('winston-daily-rotate-file');

const dailyRotateFileTransport = (fileName) =>  new(winston.transports.DailyRotateFile)({
    filename: fileName,
    datePattern: 'YYYY-MM-DD-HH-mm',
    maxsize: 20971520, /* 20MB */
    maxFiles: '7d'
})

const filenameHumanFormated = "./applogs/humanFormated-%DATE%.log";
const filenameMachineFormated = "./applogs/machineFormated-%DATE%.log";

const loggerHumanReadable = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}` )
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss.SSS',
                }),
                winston.format.colorize(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}` )
            )
        }),
        dailyRotateFileTransport(filenameHumanFormated)
    ]
});

const loggerMachine = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        dailyRotateFileTransport(filenameMachineFormated),
    ]
});

const logger = {
    info(message){
        loggerHumanReadable.info(message);
        loggerMachine.info(message);
    },
    warn(message){
        loggerHumanReadable.warn(message);
        loggerMachine.warn(message);
    },
    error(message){
        loggerHumanReadable.error(message);
        loggerMachine.error(message);
    }
};

module.exports = logger;
