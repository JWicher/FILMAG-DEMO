import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonCloseManyTasks = (props) => {

    const { selectedTasksIDs_fromManagerMode } = props.reducerTasks;

    const deleteAllChoosenTasks = () => {
        const { tasks: prev_tasks } = props.reducerTasks;
        let updated_tasks_list = [...prev_tasks]

        selectedTasksIDs_fromManagerMode.forEach(async taskId_toClose => {

            const index = updated_tasks_list.findIndex(task => task._id === taskId_toClose);
            if (index < 0) return;
            if (updated_tasks_list[index].isDone) return;

            const task_toClose = updated_tasks_list[index];
            task_toClose.isDone = true;
            task_toClose.closedBy = userService.getUserFromJWT().name;

            const closed_task = await taskService.updateTask(task_toClose);
            updated_tasks_list[index] = closed_task;

        });

        props.updateTasks(updated_tasks_list)
        props.updateChoosenTasksFromManagerMode([])
    }



    const form_deleteManyTask = {
        title: "Potwierdź zamknięcie wielu zdarzeń",
        btn_label: "Zakończ wiele",
        btn_css: "btn-danger btn-sm sorting-buttons-box_operationForManyTasksButton",
        action: () => deleteAllChoosenTasks()
    };


    const isButtonDisabled = !props.reducerTasks.chooseManyTasksMode || selectedTasksIDs_fromManagerMode.length <= 0;

    return (
        <ConfirmAlert form={form_deleteManyTask} disableButton={isButtonDisabled} />
    )
}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateTasks: tasks => dispatch(actionsTasks.updateTasks(tasks)),
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonCloseManyTasks)
