import React from 'react';
import { connect } from 'react-redux';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonToggleManagerMode = (props) => {

    const { managerMode } = props.reducerServiceMode

    const getManagerModeButtonStyle = () => {

        return (
            (managerMode ? "btn-dark" : "btn-outline-dark")
            + " btn btn-sm sorting-buttons-box_managerModeButton"
        )
    }

    const reset_selectedTasksIDs_fromManagerMode = () => {
        props.updateChoosenTasksFromManagerMode([])
    }

    const turnOff_chooseManyTasksMode = () => {
        props.toggleChooseManyTasksMode(false)
    }

    const checkAndtoggleChooseManyTasksMode = () => {
        props.toggleManagerMode(!managerMode)

        if (!managerMode) {
            reset_selectedTasksIDs_fromManagerMode();
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
        updateChoosenTasksFromManagerMode: tasks => dispatch(actionsTasks.updateChoosenTasksFromManagerMode(tasks)),

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonToggleManagerMode)
