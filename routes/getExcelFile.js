const express = require('express');
const router = express.Router();
const excellFileService = require('../utils/prepareExcelFile');
const Task = require('../models/task');

router.get('/', async (req, res, next) => {
  const data = await Task.model.find().sort({ createdIn: 1 });
  const wbout = excellFileService.createExcellFileBuffer(data)
  res.setHeader('Content-Disposition', "attachment; filename=Filmag-Zdarzenia.xlsx");
  res.type('application/octet-stream');
  res.send(wbout);
})

module.exports = router;