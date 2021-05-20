const express = require('express');
const path = require('path');
const router = express.Router();

const pathToBuildFolder = `${__dirname}/../../filmag-frontend/build`;
router.use(express.static(pathToBuildFolder));

router.get('*', (req, res) => {
    res.sendFile(path.resolve(pathToBuildFolder, 'index.html'));
});

module.exports = router;
