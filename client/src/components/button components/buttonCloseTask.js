import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonCloseTask = (props) => {

    const handleCloseTask = async (task) => {
        task.isDone = true;
        task.closedBy = userService.getUserFromJWT().name;

        const closed_task = await taskService.updateTask(task);

        const { tasks: prev_tasks } = props.reducerTasks;
        const updated_tasks = [...prev_tasks];
        const index = updated_tasks.findIndex(t => t._id === closed_task._id);
        updated_tasks[index] = closed_task;

        props.updateTasks(updated_tasks)
    }

    const form_closeTask = {
        title: "Potwierdź zakończenie zdarzenia",
        btn_css: "btn-danger btn-sm",
        action: (task) => handleCloseTask(task),
        btn_label:
            <p>
                <span className="task-box_btn-label_full">Zakończ</span>
                <span className="task-box_btn-label_short">Z</span>
            </p>,
    };

    return (
        <ConfirmAlert item={props.task} itemRepresentation={props.task.content} form={form_closeTask} />
    )
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTasks: tasks => dispatch(actionsTasks.updateTasks(tasks)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonCloseTask)
