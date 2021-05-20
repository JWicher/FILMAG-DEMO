import React from 'react';

const SortingButtonsLogs = (props) => {

    const sortingButtons = [
        { label: "Wszystkie", path: "" },
        { label: "Error", path: "error" },
        { label: "Warn", path: "warn" },
        { label: "Info", path: "info" }
    ];

    function getSortingButtonCustomStyles(buttonPath) {
        return (
            (buttonPath === props.sortingType ? "btn-secondary" : "btn-outline-secondary")
            + "  btn btn-sm sorting-buttons-box_sortingButton"
        )
    }

    function renderSortingButtons() {
        return (
            sortingButtons.map(button =>
                <button key={button.label}
                    className={getSortingButtonCustomStyles(button.path)}
                    onClick={() => props.handleChangeSortingStatus(button.path)}
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

export default SortingButtonsLogs
