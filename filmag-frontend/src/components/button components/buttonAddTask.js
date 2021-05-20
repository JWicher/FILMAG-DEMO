import React from 'react';
import { toast } from 'react-toastify';
import FormInputTask from '../input forms/formInputTask';
import taskService from '../../services/taskService';

const ButtonAddTask = (props) => {

    const handleAddTask = async (new_task) => {
        await taskService.addTask(new_task);
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

export default ButtonAddTask