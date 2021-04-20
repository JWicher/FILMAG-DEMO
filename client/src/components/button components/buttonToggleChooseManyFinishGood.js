import React from 'react';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonToggleChooseManyFinishGood = (props) => {
    const { chooseManyFinishGoodsMode } = props.reducerFinishGood;

    return (
        <button
            className={(chooseManyFinishGoodsMode ? "btn-dark" : "btn-outline-dark") + " btn btn-sm sorting-buttons-box_chooseManyTasksButton"}
            onClick={() => props.toggleChooseManyFinishGoodMode(!chooseManyFinishGoodsMode)}
        >Zaznacz wiele
        </button>
    )

}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChooseManyFinishGoodMode: boolean => dispatch(actionsFinishGoods.toggleChooseManyFinishGoodMode(boolean)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonToggleChooseManyFinishGood)
