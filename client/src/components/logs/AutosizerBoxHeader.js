import React from 'react';
import utils from '../../services/utils';
import { connect } from 'react-redux';

const LogsAutosizerBoxHeader = (props) => {
    const { columns } = props;
    
    return (
        <div className={"log-box__header"}>
            {columns.map(column =>
                <div
                    key={column.path}
                    className={utils.getCustomCssClass(column.path, "log-box__header")}
                >{column.label}
                </div>
            )}
        </div>
    )
}

export default connect(
    (state) => { return state }
)(LogsAutosizerBoxHeader)
