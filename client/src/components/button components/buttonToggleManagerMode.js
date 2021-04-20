import React from 'react';
import { connect } from 'react-redux';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import actionsTasks from '../../redux/actions/actionsTasks';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';

const ButtonToggleManagerMode = (props) => {

    const { managerMode } = props.reducerServiceMode

    const getManagerModeButtonStyle = () => {
        return (
            (managerMode ? "btn-dark" : "btn-outline-dark")
            + " btn btn-sm sorting-buttons-box_managerModeButton"
        )
    }

    const reset_selectedIDs_fromManagerMode = () => {
        props.updateChoosenTasksFromManagerMode([])
        props.updateChoosenFinishGoodsFromManagerMode([])
    }

    const turnOff_chooseManyTasksMode = () => {
        props.toggleChooseManyTasksMode(false)
        props.toggleChooseManyFinishGoodMode(false)
    }

    const checkAndtoggleChooseManyTasksMode = () => {
        props.toggleManagerMode(!managerMode)
        props.toggleChooseManyFinishGoodMode(!managerMode)

        if (!managerMode) {
            reset_selectedIDs_fromManagerMode();
            turnOff_chooseManyTasksMode();
        }
    }

    return (
        <button
            className={getManagerModeButtonStyle()}
            onClick={() => checkAndtoggleChooseManyTasksMode()}
        >{managerMode ? "Wyłącz tryb" : "Tryb zarządzania"}
        </button>
    )

}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleManagerMode: boolean => dispatch(actionsServiceMode.toggleManagerMode(boolean)),
        toggleChooseManyTasksMode: boolean => dispatch(actionsTasks.toggleChooseManyTasksMode(boolean)),
        toggleChooseManyFinishGoodMode: boolean => dispatch(actionsFinishGoods.toggleChooseManyFinishGoodMode(boolean)),
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),
        updateChoosenFinishGoodsFromManagerMode: finishGoods => dispatch(actionsFinishGoods.updateChoosenFinishGoodsFromManagerMode(finishGoods)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonToggleManagerMode)
