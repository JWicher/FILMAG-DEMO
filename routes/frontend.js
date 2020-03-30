const express = require('express');
const router = express.Router();

router.use(express.static('../client/build'));
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'client', 'build', 'index.html'));
});

module.exports = router;