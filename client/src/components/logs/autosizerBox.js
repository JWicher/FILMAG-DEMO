import React from 'react';
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from "react-window";
import Log from './log';
import LogsAutosizerBoxHeader from './AutosizerBoxHeader';
import { connect } from 'react-redux';

const AutosizerBox = (props) => {

    const columns = [
        { label: "#", path: "index" },
        { label: "typ", path: "type" },
        { label: "Treść", path: "message" },
        { label: "Użytkownik", path: "author" },
        { label: "Zarejestrowno", path: "time" }
    ];
    
    const { currentSortingStatusLogs: sortingCriteria } = props.reducerLogs
    const { data: logs } = props;
    const data = sortingCriteria === "All" ? logs : logs.filter( item => item.type === sortingCriteria)

    return (
        <div className="log-box">
            <LogsAutosizerBoxHeader columns={columns} />
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
                            const log = data[index];
                            return (
                                <div style={{ ...style }}>
                                    <Log
                                        key={log._id}
                                        index={index + 1}
                                        log={log}
                                        columns={columns}
                                        history={props.history}
                                    >
                                    </Log>
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
