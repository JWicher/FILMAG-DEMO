import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonDeleteManyTasks = (props) => {

    const { selectedTasksIDs_fromManagerMode } = props.reducerTasks;

    const deleteAllChoosenTasks = () => {
        const { tasks } = props.reducerTasks;
        let updated_tasks_list = [...tasks]

        selectedTasksIDs_fromManagerMode.forEach(async taskId_toDelete => {

            const index = updated_tasks_list.findIndex(task => task._id === taskId_toDelete);
            if (index < 0) return;
            updated_tasks_list.splice(index, 1);

            const taskObjectToDelete = { _id: taskId_toDelete };
            await taskService.deleteTask(taskObjectToDelete)
        });

        props.updateChoosenTasksFromManagerMode([])
    }

    const form_deleteManyTask = {
        title: "Potwierdź usunięcie wielu zdarzeń",
        btn_label: "Usuń wiele",
        btn_css: "btn-outline-danger btn-sm sorting-buttons-box_operationForManyTasksButton",
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
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonDeleteManyTasks)
