import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonDeleteManyFinishGoods = (props) => {

    const { selectedFinishGoodIDs_fromManagerMode } = props.reducerFinishGood;

    const deleteAllChoosenFinishGoods = () => {
        const { finishGoods } = props.reducerFinishGood;
        let updated_finishGoods_list = [...finishGoods]

        selectedFinishGoodIDs_fromManagerMode.forEach(async finishGoodId_toDelete => {

            const index = updated_finishGoods_list.findIndex(finishGood => finishGood._id === finishGoodId_toDelete);
            if (index < 0) return;
            updated_finishGoods_list.splice(index, 1);

            await finishGoodsService.deleteFinishGood({ _id: finishGoodId_toDelete })
        });

        props.updateChoosenFinishGoodsFromManagerMode([])
    }

    const form_deleteManyTask = {
        title: "Potwierdź usunięcie wielu produktów",
        btn_label: "Usuń wiele",
        btn_css: "btn-outline-danger btn-sm sorting-buttons-box_operationForManyTasksButton",
        action: () => deleteAllChoosenFinishGoods()
    };

    const isButtonDisabled = !props.reducerFinishGood.chooseManyFinishGoodsMode || selectedFinishGoodIDs_fromManagerMode.length <= 0;

    return (
        <ConfirmAlert form={form_deleteManyTask} disableButton={isButtonDisabled} />
    )
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateChoosenFinishGoodsFromManagerMode: finishGoods => dispatch(actionsFinishGoods.updateChoosenFinishGoodsFromManagerMode(finishGoods)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonDeleteManyFinishGoods)
