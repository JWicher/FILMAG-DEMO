import React from 'react';
import ButtonTakeTask from '../button components/buttonTakeTask';
import ButtonCloseTask from '../button components/buttonCloseTask';
import ButtonDeleteTask from '../button components/buttonDeleteTask';
import ButtonPartialDelivery from '../button components/buttonPartialDelivery';
import CustomCheckBox from '../common/customCheckBox';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import utils from '../../services/utils';
import actionsTasks from '../../redux/actions/actionsTasks';
import { connect } from 'react-redux';

const Task = (props) => {

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
        const updatedTask = await taskService.updateTask(taskToUpdate)

        const { tasks: prev_tasks } = props.reducerTasks;
        const updated_tasks = [...prev_tasks];
        const index = updated_tasks.findIndex(t => t._id === updatedTask._id);
        updated_tasks[index] = updatedTask;

        props.updateTasks(updated_tasks)
    }

    const handleTaskClickInManagerMode = (selected_tasks) => {
        const { selectedTasksIDs_fromManagerMode } = props.reducerTasks;

        const index = selectedTasksIDs_fromManagerMode.findIndex(taskId => taskId === selected_tasks._id);

        if (index < 0) {
            addTaskTo_selectedTasksIDs_fromManagerMode(task, selectedTasksIDs_fromManagerMode);
        } else {
            removeTaskFrom_selectedTasksIDs_fromManagerMode(index, selectedTasksIDs_fromManagerMode);
        }
    }

    function renderCloseButton() {
        const { serviceMode_jobName, managerMode } = props.reducerServiceMode;

        const isOperator = user.job === 'Operator' || serviceMode_jobName === 'Operator';
        const isMagazynierAndHisTask = user.job === 'Magazynier' || serviceMode_jobName === 'Magazynier';

        if (isOperator || isMagazynierAndHisTask || managerMode) {
            return <ButtonCloseTask task={task} />;
        }
    }

    function renderQty(task) {
        const alreadyDelivered = task.partialQty ? task.partialQty : 0;
        return (
            <React.Fragment>
                <div className="task-box__task_qty-main">{task.qty}</div>
                {!task.isDone && <div className="task-box__task_qty-partialDelivery">({alreadyDelivered})</div>}
            </React.Fragment>
        )
    }

    function renderTaskContent(task) {
        return (
            <React.Fragment>
                <div className="task-box__task_content-text">{task.content}</div>
                <div className="task-box__task_content-createdInFormatedData">{task.createdInFormatedData}</div>
            </React.Fragment>
        )
    }

    function renderContent(task, column, index) {

        if (column.path === "#") return index;
        else if (column.path === "content") return renderTaskContent(task);
        else if (column.path === "qty") return task.type === "order" ? renderQty(task) : "";
        else if (column.path === "partialQty") return task.type === "order" ? task.partialQty : "";
        else if (column.path === "location") return task.location;
        else if (column.path === "time") return task.time >= 1400 ? "24h+" : task.time;
        else if (column.path === "takedBy") return renderTakedBy(task);
        else if (column.path === "btnClose" && !task.isDone && !chooseManyTasksMode) return renderCloseButton();
        else if (column.path === "take" && !task.isDone) {
            if (task.type === "order" && task.takedBy === user.name) return <ButtonPartialDelivery task={task} />;
            else if (task.type === "order" || task.type === "orderTakeout") return <ButtonTakeTask task={task} />;
        }
        else if (column.path === "createdInFormatedData") return task.createdInFormatedData;
        else if (column.path === "btnDelete") {
            if (chooseManyTasksMode) {
                return (
                    <CustomCheckBox
                        isChecked={isSelected}
                        action={() => { return }}
                    />
                )
            }
            else return <ButtonDeleteTask task={task} />;
        }
    }

    function renderTakedBy(task) {
        return (
            (task.type === "order" || task.type === "orderTakeout")
                ?
                (task.takedBy || "?")
                :
                task.createdBy
        )
    }

    function taskCustomCSS(task) {
        if (task.isUrgent && !task.isDone) return "priority-task";
        else if (task.isDone) return "task-box__task-color_ok";
        else if (task.partialTime >= 10 || task.type === "breakdown") return "task-box__task-color_ng";
        else if (task.type === "modelChange" || task.type === "cleaning") return "task-box__task-color_warning";
        else { return "" };
    }


    // return
    const { task, columns, index } = props;

    return (
        <div
            className={"task-box__task " + taskCustomCSS(task)}
            onClick={() => { chooseManyTasksMode && handleTaskClickInManagerMode(task) }}
            onDoubleClick={() => handleSetTaskUrgency(task)}
        >
            {columns.map(column =>
                <div key={task._id + column.path} className={utils.getCustomTaskCss(column.path, "task")}>
                    {renderContent(task, column, index)}
                </div>
            )}
        </div>
    );
}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),
        updateTasks: tasks => dispatch(actionsTasks.updateTasks(tasks)),

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Task)