const express = require('express');
const router = express.Router();
const logger = require("../utils/logger");

router.get('/', async (req, res) => {
    logger.info(`Healthcheck ping"`);
    res.send("FILMAG is working!")
});

module.exports = router;
