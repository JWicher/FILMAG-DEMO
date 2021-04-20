import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import FinishGood from './finishGood';
import FinishGoodsAutosizerBoxHeader from './AutosizerBoxHeader';
import finishGoodsService from '../../services/finishGoodsService';
import utils from '../../services/utils';
import { connect } from 'react-redux';

const AutosizerBox = (props) => {
    const starndardColumns = [
        { label: "#", path: "index" },
        { label: "Nazwa", path: "name" },
        { label: "Opis", path: "description" },
        { label: "Ilość", path: "qty" },
        { label: "Zarejestrowno", path: "createdAtFormatedData" },
        { label: "Cena", path: "rawMaterialPrice" },
        { label: "Rezerwacja", path: "reservation" },
        { label: "Status", path: "status" }
    ];
    
    const specialColumns = {
        column_btnDelete: { label: "", path: "btnDelete" }
    };

    const columns = {
        common: starndardColumns,
        special: specialColumns
    };
    const reduxState = { reducerServiceMode: props.reducerServiceMode }
    const filteredColumns = finishGoodsService.getFilteredColumns(columns,reduxState);
    const { currentSortingStatusFinishGoods: sortingCriteria } = props.reducerFinishGood
    const { data: finishGoods } = props;
    const data = utils.getSortedDataByStatus(finishGoods, sortingCriteria);

    return (
        <div className="finishGood-box">
            <FinishGoodsAutosizerBoxHeader columns={filteredColumns} />
            {data.length === 0 && <p>brak danych</p>}
            <AutoSizer >
                {({ height, width }) => (
                    <FixedSizeList
                        itemData={data}
                        height={height - 65}
                        width={width}
                        itemCount={data.length}
                        itemSize={60}
                    >
                        {({ data, index, style }) => {
                            const finishGood = data[index];
                            return (
                                <div style={{ ...style }}>
                                    <FinishGood
                                        key={finishGood._id}
                                        index={index + 1}
                                        finishGood={finishGood}
                                        columns={filteredColumns}
                                        history={props.history}
                                    >
                                    </FinishGood>
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
)(AutosizerBox)
