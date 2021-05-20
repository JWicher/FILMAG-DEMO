import React from 'react';
import { connect } from 'react-redux';

const Log = React.memo((props) => {

    function renderType(type){
        return <div className={`log-box__log_level log-box__log_level-${type}`}>[{type}]</div>
    }

    function renderMessage(message){
        return <div className={`log-box__log_message`}>{message}</div>
    }

    function renderTime(timestamp){
        return <div className={`log-box__log_time`}>{timestamp}</div>
    }

    function renderContent(log, column) {
        if (column.path === "level") return renderType(log.level);
        if (column.path === "message") return renderMessage(log.message);
        if (column.path === "time") return renderTime(log.timestamp);
        return log[column.path];
    }
    
    const { log, columns } = props;

    return (
            <div className="log-box__log">
                {columns.map(column =>
                    <div key={log.timestamp + column.path} className={`log-box__log_${column.path}`}>
                        {renderContent(log, column)}
                    </div>
                )}
            </div>
    );
})


const mapStateToProps = (state) => {
    return state;
};

export default connect(
    mapStateToProps
)(Log)