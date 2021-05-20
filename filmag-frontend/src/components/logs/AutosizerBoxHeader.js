import React from 'react';
import { connect } from 'react-redux';

const LogsAutosizerBoxHeader = (props) => {
    const { columns } = props;
    
    return (
        <div className={"log-box__header"}>
            {columns.map(column =>
                <div
                    key={column.path}
                    className={`log-box__header_${column.path}`}
                >{column.label}
                </div>
            )}
        </div>
    )
}

export default connect(
    (state) => { return state }
)(LogsAutosizerBoxHeader)
