const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const logger = require("../utils/logger");

const cacheMiddleware = require('../middleware/cacheMiddleware')
const isAuth_middleware = require('../middleware/auth');
const checkActivity_middleware = require('../middleware/checkActivity');

router.use(isAuth_middleware)
router.use(checkActivity_middleware)

router.get('/', cacheMiddleware.getCache('tasks'), async (req, res) => {
    const takskToSend = await getAndPrepareTaskFromDb();
    cacheMiddleware.setCache('tasks', takskToSend)
    res.send(takskToSend)
});

router.post('/', async (req, res) => {
    const { error } = Task.methods.validate(req.body);
    if (error) {
        logger.warn(`Registering new task failed. Error: ${JSON.stringify(error)}`);
        return res.status(400).send(error.details[0].message);
    }

    let newTask = Task.methods.createNewTask(req.body);
    newTask = await newTask.save();
    
    const updatedTasks = await getAndPrepareTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);

    req.io.emit('tasks_updated', `Added new task wiith ID: ${newTask._id}`);
    logger.info(`Added new task with ID: "${newTask._id}" type: "${newTask.type}" by "${req.user?.name}"`);
    
    res.send(newTask);
})

router.put('/:id', async (req, res) => {
    const task = await Task.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
        logger.warn(`Updating task failed. Could not find task with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.')
    };

    const updatedTasks = await getAndPrepareTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);
    
    req.io.emit('tasks_updated', `Updated task wiith ID: ${task._id}`);

    task.isDone && logger.info(`Closing task with ID: "${task._id}" by "${req.user?.name}`);

    res.status(200).send(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.model.findByIdAndRemove(req.params.id);
    if (!task) {
        logger.warn(`Deleting task failed. Could not find task with ID: ${req.params.id}`);
        return res.status(404).send('Nie znaleziono zdarzenia w bazie danych.')
    };

    const updatedTasks = await getAndPrepareTaskFromDb();
    cacheMiddleware.setCache('tasks', updatedTasks);
    
    req.io.emit('tasks_updated', `Deleted task wiith ID: ${task._id}`);
    logger.info(`Deleted task with ID: "${task._id}" by "${req.user?.name}"`);

    res.status(200).send(task);
});

async function getAndPrepareTaskFromDb() {
    const qty_limit = 200;
    const tasksFromDB = await Task.model.find().sort({ createdIn: -1 }).limit(qty_limit);
    const openTasks = tasksFromDB.filter(task => task.isDone).sort((a, b) => b.createdIn - a.createdIn);
    const closedTasks = tasksFromDB.filter(task => !task.isDone).sort((a, b) => a.createdIn - b.createdIn);
    const takskToSend = [...closedTasks, ...openTasks];
    return takskToSend;
}

module.exports = router;
