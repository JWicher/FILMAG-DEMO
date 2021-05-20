import React from 'react';

const FinishGoodsAutosizerBoxHeader = (props) => {
    const { columns } = props;
    
    return (
        <div className={"finishGood-box__header"}>
            {columns.map(column =>
                <div
                    key={column.path}
                    className={`finishGood-box__header_${column.path}`}
                >{column.label}
                </div>
            )}
        </div>
    )
}

export default FinishGoodsAutosizerBoxHeader
