import React from 'react';
import FormPartialDelivery from '../input forms/formPartialDelivery';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonPartialDelivery = (props) => {

    const handlePartialDelivery = async (task) => {

        task.partialTime = 0;

        const { tasks: prev_tasks } = props.reducerTasks;
        const closed_task = await taskService.updateTask(task);

        const updated_tasks = [...prev_tasks];
        const index = updated_tasks.findIndex(t => t._id === closed_task._id);
        updated_tasks[index] = closed_task;

        props.updateTasks(updated_tasks)
    }

    const form_partialDelivery = {
        title: "Zarejestruj bierzącą dostawę",
        btn_css: "btn-primary btn-sm",
        action: (task) => handlePartialDelivery(task),
        btn_label:
            <p>
                <span className="task-box_btn-label_full">Dostawa</span>
                <span className="task-box_btn-label_short">D</span>
            </p>,
    };

    return (
        <FormPartialDelivery task={props.task} form={form_partialDelivery} />
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
)(ButtonPartialDelivery)
