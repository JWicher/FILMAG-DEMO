import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import taskService from '../../services/taskService';

const ButtonTakeTask = (props) => {

    const user = userService.getUserFromJWT();

    const handleTakeTask = async (task) => {
        task.takedBy = userService.getUserFromJWT().name;
        await taskService.updateTask(task);
    };

    const getCustomForm = (task) => {
        const currentUserTakedThisTask = task.takedBy === user.name;
        const btnStyle_taskTaked = currentUserTakedThisTask && !task.isDOne ? "btn-info btn-sm" : "btn-outline-secondary btn-sm";
        const fullText = currentUserTakedThisTask ? "Obsługujesz" : (task.takedBy ? "Przejmij" : "Biorę zlecenie");
        const shortText = currentUserTakedThisTask ? "T" : (task.takedBy ? "P" : "B");
        const title = !task.takedBy ? "Potwierdź przyjęcie zlecenia" : (task.takedBy !== user.name ? "Potwierdź przejęcie zlecenia" : "");
        const btn_css = task.takedBy ? btnStyle_taskTaked : "btn-warning btn-sm";
        const btn_label =
            <p>
                <span className="task-box_btn-label_full">{fullText}</span>
                <span className="task-box_btn-label_short">{shortText}</span>
            </p>;

        return {
            title: title,
            btn_label: btn_label,
            btn_css: btn_css,
            isNoActionButton: currentUserTakedThisTask,
            action: (task) => handleTakeTask(task)
        };
    };

    return (
        <ConfirmAlert item={props.task} itemRepresentation={props.task.content} form={getCustomForm(props.task)} />
    )
}

export default ButtonTakeTask
