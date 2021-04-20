import React from 'react';
import { toast } from 'react-toastify';
import FormInputFinishGood from '../input forms/formInputFinishGood';
import finishGoodsService from '../../services/finishGoodsService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonAddFinishGood = (props) => {

    const handleAddFinishGood = async (new_finishGood) => {
        try{
            const newFinishGood = await finishGoodsService.addFinishGood(new_finishGood);
            const { finishGoods } = props.reducerFinishGood;
            finishGoods.unshift(newFinishGood);
            props.updateFinishGoods(finishGoods);

            toast.success("Dodano produkt");
        }
        catch(ex){
            if (ex.response && (ex.response.status === 400 || ex.response.status === 403)) {
                toast.error(ex.response.data)
            }
        }
    }

    const form_confirmAlertInput_addFinishGood = {
        title: "Dodaj produkt",
        p_label_name: "Nazwa",
        p_label_description: "Opis",
        p_label_qty: "Ilość",
        p_label_rawMaterialPrice_value: "Cena",
        btn_css: "btn btn-success btn-sm",
        action: (item) => handleAddFinishGood(item),
    };


    return (
        <FormInputFinishGood
            localisation={props.localisation}
            button={props.button}
            form={form_confirmAlertInput_addFinishGood}
        />
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
)(ButtonAddFinishGood)
