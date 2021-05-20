import React from 'react';
import { connect } from 'react-redux';
import filesaver from 'file-saver';
import MenuItems from '../common/menuItems';
import logsService from '../../services/logsService';
import client_paths from '../../constants/client_URL_paths';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';

const LogsHeaderBar = (props) => {

    const handleChangeCurrentLocalisation = localisation => {
        props.changeCurrentLocalisation(localisation)
    };

    async function saveFileWithLogs() {
        const data = await logsService.getLogsFile();
        const blob = new Blob([data], {type: "text/plain;charset=utf-8"})
        await filesaver.saveAs(blob, "fileName.log");
    };

    const mainMenuItems = [
        {name: "Ustawienia", category: "Ustawienia", path: client_paths.settings.main},
        {name: "Produkcja", category: "Produkcja", path: client_paths.tasks.main}
    ]

    return (
        <header className="app__header align-to-right">
            <div className="app__header_title-barIcon-wrapper">
                <div className="app__header-title">Logi</div>
                <div className="app__header-barIcon  common-cursor-pointer" >
                    <i className="fa far fa-bars fa-3x"></i>
                    <ul className="app__header-menu">
                        <MenuItems items={mainMenuItems} action={handleChangeCurrentLocalisation} />
                        <li className="app__header-menu_item app__header-menu_item-option"
                            onClick={() => saveFileWithLogs()}
                            >
                                <i className="fa fa-download"></i>
                                Pobierz logi
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}

const mapStateToProps = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        changeCurrentLocalisation: localisation => dispatch(actionsLocalisations.changeCurrentLocalisation(localisation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsHeaderBar)
