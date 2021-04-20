import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import taskService from '../../services/taskService';

const ButtonCloseTask = (props) => {

    const handleCloseTask = async (task) => {
        task.isDone = true;
        task.closedBy = userService.getUserFromJWT().name;
        await taskService.updateTask(task);
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

export default ButtonCloseTask
