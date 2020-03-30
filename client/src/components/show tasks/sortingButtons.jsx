import React, { useState } from 'react';
import userService from '../../services/userService';
import { connect } from 'react-redux';
import actionsTasks from '../../redux/actions/actionsTasks';
import ButtonToggleManagerMode from '../button components/buttonToggleManagerMode';
import ButtonToggleChooseManyTasks from '../button components/buttonToggleChooseManyTasks';
import ButtonDeleteManyTasks from '../button components/buttonDeleteManyTasks';
import ButtonCloseManyTasks from '../button components/buttonCloseManyTasks';


const SortingButtons = (props) => {
    const [currentSortingStatus, setCurrentSortingStatus] = useState(false);

    const sortingButtons = [
        { label: "W trakcie", path: false },
        { label: "Zakończone", path: true },
        { label: "Wszystkie", path: "All" }
    ];

    const handleChangeSortingStatus = currentSortingStatus => {
        setCurrentSortingStatus(currentSortingStatus);
        props.changeCurrentSortingStatuts(currentSortingStatus)
    };

    function getSortingButtonCustomStyles(buttonPath) {
        return (
            (buttonPath === currentSortingStatus ? "btn-secondary" : "btn-outline-secondary")
            + "  btn btn-sm sorting-buttons-box_sortingButton"
        )
    }


    function renderSortingButtons() {
        return (
            sortingButtons.map(button =>
                <button key={button.label}
                    className={getSortingButtonCustomStyles(button.path)}
                    onClick={() => handleChangeSortingStatus(button.path)}
                >{button.label}
                </button>
            )
        )
    }

    function showButton_managerMode() {
        const { serviceMode, serviceMode_jobName } = props.reducerServiceMode;
        const isManager = userService.isCurrentUserGreaterThanORequalTo("Kierownik");
        return serviceMode ? userService.isThisJobManaging(serviceMode_jobName) : isManager;
    }

    const { managerMode } = props.reducerServiceMode;

    return (
        <div className="sorting-buttons-box">
            {!managerMode && <p className="sorting-buttons-box_paragraph">Pokaż zdarzenia:</p>}
            {!managerMode && renderSortingButtons()}
            {showButton_managerMode() && <ButtonToggleManagerMode />}
            {managerMode && <ButtonToggleChooseManyTasks />}
            {managerMode && <ButtonCloseManyTasks />}
            {managerMode && <ButtonDeleteManyTasks />}
        </div>
    );
}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentSortingStatuts: newStatus => dispatch(actionsTasks.changeCurrentSortingStatuts(newStatus)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SortingButtons)
