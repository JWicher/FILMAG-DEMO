import React from 'react';
import utils from '../../services/utils';
import { connect } from 'react-redux';

const FinishGoodsAutosizerBoxHeader = (props) => {
    const { columns } = props;
    
    return (
        <div className={"finishGood-box__header"}>
            {columns.map(column =>
                <div
                    key={column.path}
                    className={utils.getCustomCssClass(column.path, "finishGood-box__header")}
                >{column.label}
                </div>
            )}
        </div>
    )
}

export default connect(
    (state) => { return state }
)(FinishGoodsAutosizerBoxHeader)
