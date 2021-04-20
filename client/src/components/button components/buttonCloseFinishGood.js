import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import finishGoodsService from '../../services/finishGoodsService';

const ButtonCloseFinishGood = (props) => {

    const handleClose = async (finishGood) => {
        finishGood.isClosed = true;
        finishGood.closedBy = userService.getUserFromJWT().name;
        
        await finishGoodsService.updateFinishGood(finishGood);
    }

    const form_close = {
        title: "Potwierdź zamknięcie",
        btn_css: "btn-danger btn-sm",
        action: (finishGood) => handleClose(finishGood),
        btn_label:
            <p>
                <span className="task-box_btn-label_full">Zamknij</span>
                <span className="task-box_btn-label_short">Z</span>
            </p>,
    };

    return (
        <ConfirmAlert item={props.finishGood} itemRepresentation={props.finishGood.name} form={form_close} />
    )
}

export default ButtonCloseFinishGood
