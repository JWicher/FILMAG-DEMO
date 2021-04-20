import React, { useState } from 'react';
import { connect } from 'react-redux';
import actionsLogs from '../../redux/actions/actionsLogs';

const SortingButtonsLogs = (props) => {
    const [currentSortingStatus, setCurrentSortingStatus] = useState("All");

    const sortingButtons = [
        { label: "Error", path: "error" },
        { label: "Warn", path: "warn" },
        { label: "Info", path: "info" },
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
    }


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
    }

    return (
        <div className="sorting-buttons-box">
            {renderSortingButtons()}
        </div>
    );
}


const mapStateToProps = (state) => {
    return state;
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentSortingStatus: newStatus => dispatch(actionsLogs.changeCurrentSortingStatus(newStatus)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SortingButtonsLogs)
