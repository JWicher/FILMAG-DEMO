import React, { useState } from 'react';
import userService from '../../services/userService';
import { connect } from 'react-redux';
import actionsFinishGoods from '../../redux/actions/actionsFinishGoods';
import ButtonToggleManagerMode from '../button components/buttonToggleManagerMode';
import ButtonToggleChooseManyFinishGood from '../button components/buttonToggleChooseManyFinishGood';
import ButtonDeleteManyFinishGoods from '../button components/buttonDeleteManyFinishGoods';

const SortingButtonsFinishGoods = (props) => {
    const [currentSortingStatus, setCurrentSortingStatus] = useState("All");

    const sortingButtons = [
        { label: "Zamknięte", path: false },
        { label: "Otwarte", path: true },
        { label: "Wszystkie", path: "All" }
    ];

    const handleChangeSortingStatus = currentSortingStatus => {
        setCurrentSortingStatus(currentSortingStatus);
        props.changeCurrentSortingStatus(currentSortingStatus)
    };

    function getSortingButtonCustomStyles(buttonPath) {
        return (
            (buttonPath === currentSortingStatus ? "btn-secondary" : "btn-outline-secondary")
            + "  btn btn-sm sorting-buttons-box_sortingButton"
        )
    };

    function renderSortingButtons() {
        return (
            sortingButtons.map(button =>
                <button key={button.label}
                    className={getSortingButtonCustomStyles(button.path)}
                    onClick={() => handleChangeSortingStatus(button.path)}
                ><span className="buttontext">{button.label}</span>
                </button>
            )
        )
    };

    function showButton_managerMode() {
        const { serviceMode, serviceMode_jobName } = props.reducerServiceMode;
        const isManager = userService.isCurrentUserGreaterThanORequalTo("Kierownik");
        return serviceMode ? userService.isThisJobManaging(serviceMode_jobName) : isManager;
    }

    const { managerMode } = props.reducerServiceMode;

    return (
        <div className="sorting-buttons-box">
            {!managerMode && renderSortingButtons()}
            {showButton_managerMode() && <ButtonToggleManagerMode />}
            {managerMode && <ButtonToggleChooseManyFinishGood />}
            {managerMode && <ButtonDeleteManyFinishGoods />}
        </div>
    );
}

const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentSortingStatus: newStatus => dispatch(actionsFinishGoods.changeCurrentSortingStatus(newStatus)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SortingButtonsFinishGoods)
