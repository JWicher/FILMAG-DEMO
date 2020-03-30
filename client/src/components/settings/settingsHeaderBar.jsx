import React from 'react';
import MenuMainItem from '../common/menuMainItem';
import MenuItems from '../common/menuItems';
import userService from '../../services/userService';
import taskToExcellFileService from '../../services/taskToExcelService';

function getTaskInExcelFile() {
    taskToExcellFileService.getTasksInExcelFile();
}

const SettingsHeaderBar = ({ validLocations }) => {
    const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");

    return (
        <header className="app__header">
            <div className="app__header-title">Ustawienia</div>
            {isSupervisor && <div className="app__header-barIcon" >
                <i className="fa fas fa-bars fa-3x"></i>
                <ul className="app__header-menu">
                    <MenuMainItem label="Wyświetl zdarzenia" path="/show-data" icon="fa-align-justify" />
                    <MenuItems items={validLocations} action={() => { return null }} />
                    <li className="app__header-menu_item app__header-menu_item-option" onClick={getTaskInExcelFile}><i className="fa fa-download"></i>Pobierz zdarzenia do excel</li>
                </ul>
            </div>}
        </header>
    );
}

export default SettingsHeaderBar;