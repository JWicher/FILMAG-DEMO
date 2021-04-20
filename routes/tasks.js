const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Logger = require("../utils/logger");

const cacheMiddleware = require('../middleware/cacheMiddleware')
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', cacheMiddleware.getCache('tasks'), async (req, res) => {
    const takskToSend = await getAndPrepraeTaskFromDb();
    cacheMiddleware.setCache('tasks', takskToSend)
    res.send(takskToSend)
});

router.post('/', async (req, res) => {
    const { error } = Task.methods.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let newTask = Task.methods.createNewTask(req.body);
    newTask = await newTask.save();
    
    const updatedTasks = await getAndPrepraeTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);

    req.io.emit('tasks_updated', `Added new task wiith ID: ${newTask._id}`);
    // Logger.info(`Successfully added new task: ${newTask._id}`, req.user);

    res.send(newTask);
})

router.put('/:id', async (req, res) => {
    const task = await Task.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.');
    req.io.emit('tasks_updated', `Updated task wiith ID: ${task._id}`);
    // Logger.info(`Successfully updated task: ${task._id}`, req.user)
        
    const updatedTasks = await getAndPrepraeTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);

    res.status(200).send(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.model.findByIdAndRemove(req.params.id);
    if (!task) return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.');

    req.io.emit('tasks_updated', `Deleted task wiith ID: ${task._id}`);
    // Logger.info(`Successfully updated task: ${task._id}`, req.user)
        
    const updatedTasks = await getAndPrepraeTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);

    res.status(200).send(task);
});

async function getAndPrepraeTaskFromDb() {
    const qty_limit = 200;
    const tasksFromDB = await Task.model.find().sort({ createdIn: -1 }).limit(qty_limit);
    const openTasks = tasksFromDB.filter(task => task.isDone).sort((a, b) => b.createdIn - a.createdIn);
    const closedTasks = tasksFromDB.filter(task => !task.isDone).sort((a, b) => a.createdIn - b.createdIn);
    const takskToSend = [...closedTasks, ...openTasks];
    return takskToSend;
}

module.exports = router;
