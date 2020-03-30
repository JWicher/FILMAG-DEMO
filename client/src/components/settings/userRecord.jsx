import React, { PureComponent } from 'react';

class UserRecord extends PureComponent {
    state = {}
    render() {
        const { user, columns, renderCellContent } = this.props;
        return (
            <div className="user__wrapper">
                <div key={user._id}
                    className="user">
                    {columns.map(column =>
                        <div key={user._id + column.path} className="user__content"
                        >{renderCellContent(user, column)}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default UserRecord;