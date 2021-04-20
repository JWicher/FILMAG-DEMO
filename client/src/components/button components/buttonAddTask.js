import React from 'react';
import { toast } from 'react-toastify';
import FormInputTask from '../input forms/formInputTask';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonAddTask = (props) => {

    const handleAddTask = async (new_task) => {
        const registered_newTask = await taskService.addTask(new_task);
        const { tasks } = props.reducerTasks;
        tasks.unshift(registered_newTask);
        props.updateTasks(tasks);

        toast.success("Dodano zdarzenie");
    }

    const form_confirmAlertInput_addTask = {
        title: "Dodaj zdarzenie",
        p_label: "Treść",
        btn_css: "btn btn-success btn-sm",
        action: (item) => handleAddTask(item),
    };

    function renderCustomForm(button) {
        const form = { ...form_confirmAlertInput_addTask };
        form.content = button.label === "Zamów formatkę" ? "" : button.label;
        form.p_label_2 = button.type === "order" ? "Ilość" : "";

        return form;
    }

    return (
        <FormInputTask
            localisation={props.localisation}
            button={props.button}
            form={renderCustomForm(props.button)}
        />
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
)(ButtonAddTask)
