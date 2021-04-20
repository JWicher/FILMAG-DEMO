import React from 'react';
import utils from '../../services/utils';
import { connect } from 'react-redux';

const Log = React.memo((props) => {

    function renderAuthor(author){
        return `Nazwa: ${author.name} Id: ${author._id}`;
    }
    function renderTyper(type){
        return <div className={`log-box__log_type-${type}`}>[{type}]</div>
    }
    function renderContent(log, column, index) {
        if (column.path === "index") return index;
        if (column.path === "type") return renderTyper(log.type);
        if (column.path === "author") return renderAuthor(log.author);
        return log[column.path];
    }

    // return
    const { log, columns, index } = props;

    return (
            <div
                className="log-box__log"
                >
                {columns.map(column =>
                    <div key={log._id + column.path} className={utils.getCustomCssClass(column.path, "log-box__log")}>
                        {renderContent(log, column, index)}
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