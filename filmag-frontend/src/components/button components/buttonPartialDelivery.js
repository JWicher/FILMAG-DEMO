import React from 'react';
import FormPartialDelivery from '../input forms/formPartialDelivery';
import taskService from '../../services/taskService';

const ButtonPartialDelivery = (props) => {

    const handlePartialDelivery = async (task) => {
        task.partialTime = 0;
        await taskService.updateTask(task);
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

export default ButtonPartialDelivery
