import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonDeleteTask = (props) => {

    const handleDeleteTask = async (taskToDelete) => {
        const deleted_task = await taskService.deleteTask(taskToDelete);
        const { tasks: prev_tasks } = props.reducerTasks;
        const updated_tasks = [...prev_tasks];
        const index = updated_tasks.findIndex(t => t._id === deleted_task._id);
        updated_tasks.splice(index, 1);

        props.updateTasks(updated_tasks)
    };

    const form_deleteTask = {
        title: "Potwierdź usunięcie zdarzenia z rejestru",
        btn_label: <p><span className="task-box_btn-label_full">Usuń</span><span className="task-box_btn-label_short">X</span></p>,
        btn_css: "btn-outline-danger btn-sm",
        action: (task) => handleDeleteTask(task)
    };

    return (
        <ConfirmAlert item={props.task} itemRepresentation={props.task.content} form={form_deleteTask} />
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
)(ButtonDeleteTask)
