import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import Task from './task';
import TaskBoxHeader from './taskBoxHeader';
import taskService from '../../services/taskService';
import { connect } from 'react-redux';
import columnsTaskBox from "../constans/columns/columnsTaskBox";

const TaskBox = (props) => {
    const columns = columnsTaskBox.getTaskBoxColumns();

    const reduxState = {
        reducerTasks: props.reducerTasks,
        reducerLocalisations: props.reducerLocalisations,
        reducerServiceMode: props.reducerServiceMode
    };
    const { data: tasks } = props;
    const data = taskService.getSortedData(tasks, reduxState);
    const filteredClumns = taskService.getFilteredColumns(columns, reduxState);

    return (
        <div className="task-box">
            <TaskBoxHeader columns={filteredClumns} />
            {data.length === 0 && <p>brak danych</p>}
            <AutoSizer >
                {({ height, width }) => (
                    <FixedSizeList
                        itemData={data}
                        height={height - 30}
                        width={width}
                        itemCount={data.length}
                        itemSize={43}
                    >
                        {({ data, index, style }) => {
                            const task = data[index];
                            return (
                                <div style={{ ...style }}>
                                    <Task
                                        key={task._id}
                                        index={index + 1}
                                        task={task}
                                        columns={filteredClumns}
                                    >
                                    </Task>
                                </div>
                            )
                        }}
                    </FixedSizeList>
                )}
            </AutoSizer>
        </div>
    );
}

export default connect(
    (state) => { return state }
)(TaskBox)
