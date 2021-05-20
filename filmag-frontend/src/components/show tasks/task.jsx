import React from 'react';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import utils from '../../services/utils';
import actionsTasks from '../../redux/actions/actionsTasks';
import { connect } from 'react-redux';
import renderMaster from "./renderServices/renderMaster";

const Task = React.memo((props) => {
    const { chooseManyTasksMode, selectedTasksIDs_fromManagerMode } = props.reducerTasks;
    const isSelected = selectedTasksIDs_fromManagerMode.includes(props.task._id)
    const user = userService.getUserFromJWT();

    function addTaskTo_selectedTasksIDs_fromManagerMode(selectedTask, array) {
        props.updateChoosenTasksFromManagerMode([...array, selectedTask._id])
    }

    function removeTaskFrom_selectedTasksIDs_fromManagerMode(index, array) {
        const updated_choosenTasks_fromManagerMode = [...array]

        updated_choosenTasks_fromManagerMode.splice(index, 1)
        props.updateChoosenTasksFromManagerMode(updated_choosenTasks_fromManagerMode)
    }
    const handleSetTaskUrgency = async (task) => {
        if (task.isDone) return;

        const taskToUpdate = { ...task, isUrgent: !task.isUrgent };
        await taskService.updateTask(taskToUpdate)
    }

    const handleTaskClickInManagerMode = (selected_tasks) => {
        const { selectedTasksIDs_fromManagerMode } = props.reducerTasks;
        const index = selectedTasksIDs_fromManagerMode.findIndex(taskId => taskId === selected_tasks._id);

        if (index >= 0) {
            removeTaskFrom_selectedTasksIDs_fromManagerMode(index, selectedTasksIDs_fromManagerMode);
        }

        addTaskTo_selectedTasksIDs_fromManagerMode(task, selectedTasksIDs_fromManagerMode);
    }

    const { task, columns, index, reducerServiceMode } = props;
    const renderMasterInstance = renderMaster.taskModule.init({user, chooseManyTasksMode, isSelected, reducerServiceMode});

    return (
        <div
            className={"task-box__task " + renderMasterInstance.taskCustomCSS(task)}
            onClick={() => { chooseManyTasksMode && handleTaskClickInManagerMode(task) }}
            onDoubleClick={() => handleSetTaskUrgency(task)}
        >
            {columns.map(column =>
                <div key={task._id + column.path} className={`task-box__task_${column.path}`}>
                    {renderMasterInstance.renderContent(task, column.path, index)}
                </div>
            )}
        </div>
    );
})

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),
        updateTasks: tasks => dispatch(actionsTasks.updateTasks(tasks))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Task)
