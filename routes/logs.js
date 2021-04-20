const express = require('express');
const router = express.Router();
const Log = require('../models/log');

const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

const clearFGDB = async (logs) => {
    for(let i = 0; i <= logs.length; i++){
        await Log.model.findByIdAndDelete(logs[i]._id)
    }
}
router.get('/', async (req, res) => {
    const logs = await Log.model.find().sort({ createdAt: -1 });
    // await clearFGDB(logs)

    res.send(logs)
});

module.exports = router;