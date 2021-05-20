import React from 'react';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';

const ButtonToggleChooseManyTasks = (props) => {

    const { chooseManyTasksMode } = props.reducerTasks;

    return (
        <button
            className={(chooseManyTasksMode ? "btn-dark" : "btn-outline-dark") + " btn btn-sm sorting-buttons-box_chooseManyTasksButton"}
            onClick={() => props.toggleChooseManyTasksMode(!chooseManyTasksMode)}
        >Zaznacz wiele
        </button>
    )
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChooseManyTasksMode: boolean => dispatch(actionsTasks.toggleChooseManyTasksMode(boolean)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ButtonToggleChooseManyTasks)
