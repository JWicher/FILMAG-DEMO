import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonReserveFinishGood = (props) => {

    const user = userService.getUserFromJWT();

    const getCustomForm = (finishGood) => {
        const currentUserReservedThisFinishGood = finishGood.reservedBy === user.name;
        const btnStyle_finishGoodReserved = currentUserReservedThisFinishGood ? "btn-warning btn-sm" : "btn-secondary btn-sm";
        const fullText = currentUserReservedThisFinishGood ? "Zwolnij" : (finishGood.reservedBy ? "Zarezerwowane" : "Rezerwuj");
        const shortText = currentUserReservedThisFinishGood ? "Z" : (finishGood.reservedBy ? "Z" : "R");
        const title = !finishGood.reservedBy ? "Potwierdź rezerwację produktu" : "Potwierdź zwolnienie produktu";
        const btn_css = finishGood.reservedBy ? btnStyle_finishGoodReserved : "btn-success btn-sm";
        const btn_label =
            <p>
                <span className="finishGood-box__btn-label_full">{fullText}</span>
                <span className="finishGood-box__btn-label_short">{shortText}</span>
            </p>;

        return {
            title: title,
            btn_label: btn_label,
            btn_css: btn_css,
            isDisabled: finishGood.reservedBy && finishGood.reservedBy !== user.name,
            action: (finishGood) => handleChangeReservationFinishGood(finishGood)
        };
    };

    const handleChangeReservationFinishGood = async (finishGood) => {

        if(!finishGood.reservedBy){
            finishGood.reservedBy = user.name;
            finishGood.isReserved = true;
        }
        else{
            finishGood.reservedBy = "";
            finishGood.isReserved = false;
        }
        const { finishGoods: prev_finishGoods } = props.reducerFinishGood;
        const reserved_finishGood = await finishGoodsService.updateFinishGood(finishGood);
        const updated_finishGoods = [...prev_finishGoods];
        const index = updated_finishGoods.findIndex(fG => fG._id === reserved_finishGood._id);
        updated_finishGoods[index] = reserved_finishGood;

        props.updateFinishGoods(updated_finishGoods)
    };


    return (
        <ConfirmAlert item={props.finishGood} itemRepresentation={props.finishGood.name} form={getCustomForm(props.finishGood)} />
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
)(ButtonReserveFinishGood)
