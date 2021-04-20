import React from 'react';
import MenuItems from '../common/menuItems';
import userService from '../../services/userService';
import taskToExcellFileService from '../../services/taskToExcelService';
import client_paths from '../../constants/client_URL_paths';

function getTaskInExcelFile() {
    taskToExcellFileService.getTasksInExcelFile();
}

const SettingsHeaderBar = () => {
    const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
    const mainMenuItems = [
        {name: "Produkcja", category: "Produkcja", path: client_paths.tasks.main},
        {name: "Wyroby gotowe", category: "Wyroby gotowe", path: client_paths.finishGoods.main}
    ];
    const submenuOptions = [
        { label: "Wykaz użytkowników", category: "Opcja ustawień",  path: client_paths.settings.users },
        { label: "Wykaz lokalizacji", category: "Opcja ustawień",  path: client_paths.settings.localisations },
        { label: "Mój profil", category: "Opcja ustawień",  path: client_paths.settings.user }
    ]
    return (
        <header className="app__header">
            <div className="app__header-title">Ustawienia</div>
            {isSupervisor && <div className="app__header-barIcon" >
                <i className="fa fas fa-bars fa-3x"></i>
                <ul className="app__header-menu">
                    <MenuItems items={mainMenuItems} action={() => { return null }} />
                    <hr className="hr-line-color"/>
                    <MenuItems items={submenuOptions} action={() => { return null }} />
                    <hr className="hr-line-color"/>
                    <li className="app__header-menu_item app__header-menu_item-option" onClick={getTaskInExcelFile}>
                        <i className="fa fa-download"></i>
                        Pobierz zdarzenia do excel
                    </li>
                </ul>
            </div>}
        </header>
    );
}

export default SettingsHeaderBar;