import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonDeleteFinishGood = (props) => {

    const handleDeleteFinishGood = async (finishGoodToDelete) => {
        const deleted_finishGood = await finishGoodsService.deleteFinishGood(finishGoodToDelete);
        const { finishGoods: prev_finishGoods } = props.reducerFinishGood;
        const updated_finishGoods = [...prev_finishGoods];
        const index = updated_finishGoods.findIndex(fG => fG._id === deleted_finishGood._id);
        updated_finishGoods.splice(index, 1);

        props.updateFinishGoods(updated_finishGoods)
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


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateFinishGoods: finishGoods => dispatch(actionsFinishGoods.updateFinishGoods(finishGoods)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonDeleteFinishGood)
