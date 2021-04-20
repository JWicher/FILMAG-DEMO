import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonCloseFinishGood = (props) => {

    const handleClose = async (finishGood) => {

        finishGood.isClosed = true;
        finishGood.closedBy = userService.getUserFromJWT().name;
        
        const closed_finishGood = await finishGoodsService.updateFinishGood(finishGood);

        const { finishGoods: prev_finishGoods } = props.reducerFinishGood;
        const updated_finishGoods = [...prev_finishGoods];
        const index = updated_finishGoods.findIndex(fG => fG._id === closed_finishGood._id);
        updated_finishGoods[index] = closed_finishGood;

        props.updateFinishGoods(updated_finishGoods)
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


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateFinishGoods: finishGoods => dispatch(actionsFinishGoods.updateFinishGoods(finishGoods))
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonCloseFinishGood)
