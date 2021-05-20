import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import finishGoodsService from '../../services/finishGoodsService';

const ButtonDeleteFinishGood = (props) => {

    const handleDeleteFinishGood = async (finishGoodToDelete) => {
        await finishGoodsService.deleteFinishGood(finishGoodToDelete);
    };

    const form_deleteTask = {
        title: "Potwierdź usunięcie zdarzenia z rejestru",
        btn_label: <p><span className="task-box_btn-label_full">Usuń</span><span className="task-box_btn-label_short">X</span></p>,
        btn_css: "btn-outline-danger btn-sm",
        action: (finishGood) => handleDeleteFinishGood(finishGood)
    };

    return (
        <ConfirmAlert item={props.finishGood} itemRepresentation={props.finishGood.name} form={form_deleteTask} />
    )
}

export default ButtonDeleteFinishGood