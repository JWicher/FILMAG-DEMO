import React from 'react';
import utils from '../../services/utils';
import { connect } from 'react-redux';

const TaskBoxHeader = (props) => {

    const invisibleText = props.reducerLocalisations.currentLocalisation.name === "UTRZYMANIE RUCHU" ? " invisible" : "";
    const isVisible = (column) => {
        return column.path === "qty" ? invisibleText : "";
    };

    const { tasks } = props.reducerTasks;
    const isThereUrgentTask = tasks.find(task => task.isUrgent && !task.isDone)
    const waringBoxStyle = "warning-urgetTask " + (isThereUrgentTask ? "display-block" : "display-none");

    return (
        <div className={"task-box__header"}>
            <div className={waringBoxStyle}>!</div>
            {props.columns.map(column =>
                <div
                    key={column.path}
                    className={utils.getCustomTaskCss(column.path, "header") + isVisible(column)}
                >{column.label}
                </div>
            )}
        </div>
    )
}

export default connect(
    (state) => { return state }
)(TaskBoxHeader)
