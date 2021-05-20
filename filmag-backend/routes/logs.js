const fs = require("fs-extra");
const express = require('express');
const router = express.Router();

const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware);
router.use(checkActivity_middleware);

const folderPath = `${__dirname}/../../applogs`;

router.get('/parsed', async (req, res) => {
    const files = await fs.readdir(folderPath);
    const filePath = files.filter((fileName) => fileName.startsWith("machineFormated"))
        .pop();

    const arrayWithLogs = fs.readFileSync(`${folderPath}/${filePath}`).toString()
        .split("\n")
        .slice(0, -1)
        .map((item) => {
            return JSON.parse(item)
        })

    res.send(arrayWithLogs)
});

router.get('/file', async (req, res) => {
    const files = await fs.readdir(folderPath);
    const filePath = files.filter((fileName) => fileName.startsWith("machineFormated"))
        .pop();
    const data = await fs.readFileSync(`${folderPath}/${filePath}`);

    res.contentType("text/plain");
    res.send(data)
});

module.exports = router;
