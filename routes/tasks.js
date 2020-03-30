const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const cacheMiddleware = require('../middleware/cacheMiddleware')
const utils_database = require('../utils/util_database');

router.get('/', cacheMiddleware.getCache('tasks'), async (req, res) => {
    const qty_limit = 200;
    const tasksFromDB = await Task.model.find().sort({ createdIn: -1 }).limit(qty_limit);
    const openTasks = tasksFromDB.filter(task => task.isDone).sort((a, b) => b.createdIn - a.createdIn);
    const closedTasks = tasksFromDB.filter(task => !task.isDone).sort((a, b) => a.createdIn - b.createdIn);

    const takskToSend = [...closedTasks, ...openTasks];
    cacheMiddleware.setCache('tasks', takskToSend, 6)
    res.send(takskToSend)
});

router.post('/', async (req, res) => {
    const { error } = Task.methods.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let newTask = Task.methods.createNewTask(req.body);

    newTask = await newTask.save();
    res.send(newTask);
})

router.put('/:id', async (req, res) => {
    let task = await Task.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.');

    res.status(200).send(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.model.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.');

    res.status(200).send(task);
});

setInterval(utils_database.increasePendingTime, 60000);

module.exports = router;