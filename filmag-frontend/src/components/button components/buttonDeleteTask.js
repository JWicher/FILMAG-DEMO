import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import taskService from '../../services/taskService';

const ButtonDeleteTask = (props) => {

    const handleDeleteTask = async (taskToDelete) => {
        await taskService.deleteTask(taskToDelete);
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

export default ButtonDeleteTask
