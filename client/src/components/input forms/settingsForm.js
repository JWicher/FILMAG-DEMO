import React, { Component } from 'react';
import ConfirmAlert from './confirmAlert';
import userService from '../../services/userService';
import ConfirmAlertSettings from '../confirmAlertSettings';

class SettingsForm extends Component {
    state = {}

    renderHeader(columns, mainDivCSS, contentCSS) {  // podobne
        return (
            <div className={mainDivCSS}>
                {columns.map(column =>
                    <div key={column.path} className={contentCSS}>{column.label}</div>
                )}
            </div>
        )
    }

    renderItems(items, mainDivCSS, itemCSS, contentCSS) {  // podobne
        return (
            <div className={mainDivCSS}>
                {items.map(user =>
                    <div key={user._id} className={itemCSS}>
                        {this.columns.map(column =>
                            <div key={user._id + column.path} className={contentCSS}
                            >{this.renderCellContent(user, column)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    renderConfirmAlert(user, form, checkDisplay = false) { // podobne
        const isDisbaled = checkDisplay && !userService.isCurrentUserGreaterThan(user.job) ? true : false;
        return (
            <ConfirmAlert
                item={user}
                itemRepresentation={user.name}
                form={form}
                disableButton={isDisbaled}
            />
        )
    };
    renderAddnewItemButton(form) {
        return <ConfirmAlertSettings form={form} />
    };  // podobne

}

export default SettingsForm;