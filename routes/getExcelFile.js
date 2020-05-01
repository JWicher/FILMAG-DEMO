const express = require('express');
const router = express.Router();
const excellFileService = require('../utils/prepareExcelFile');
const Task = require('../models/task');
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', async (req, res, next) => {
  const data = await Task.model.find().sort({ createdIn: 1 });
  const wbout = excellFileService.createExcellFileBuffer(data)
  res.setHeader('Content-Disposition', "attachment; filename=Filmag-Zdarzenia.xlsx");
  res.type('application/octet-stream');
  res.send(wbout);
})

module.exports = router;