import React, { useState, useEffect } from 'react';
import MenuItems from '../common/menuItems';
import ButtonAddFinishGood from '../button components/buttonAddFinishGood';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import { connect } from 'react-redux';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';

const LogsHeaderBar = (props) => {
    const [currentLocalisation, setCurrentLocalisation] = useState(props.reducerLocalisations.currentLocalisation);
    const [serviceMode, setServiceMode] = useState(props.reducerServiceMode.serviceMode);

    const handleChangeCurrentLocalisation = localisation => {
        setCurrentLocalisation(localisation);
        props.changeCurrentLocalisation(localisation)
        props.toggleManagerMode(false)
    };
    const handleChangeServiceMode = serviceMode => {
        setServiceMode(serviceMode);
        props.toggleServiceMode(serviceMode)
    };

    const managersMainMenuItems = [
        {name: "Ustawienia", category: "Ustawienia", path: client_paths.settings.main},
        {name: "Produkcja", category: "Produkcja", path: client_paths.tasks.main}

    ]
    const workersMinMenuItems = [
        {name: "Produkcja", category: "Produkcja", path: client_paths.tasks.main}
    ]


    const headerButtons = [
        { label: "Dodaj", type: "order" }
    ];

    const allJobNames = userService.getJobNames();

    function renderDropdownMenu() {
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        const isManagmenemt = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
        const mainMenuItems = isManagmenemt ? managersMainMenuItems : workersMinMenuItems;
        
        return (
            <div className="app__header-barIcon  common-cursor-pointer" >
                <i className="fa far fa-bars fa-3x"></i>
                <ul className="app__header-menu">
                    {isAdmin && renderServiceModeMainButton()}
                    <MenuItems items={mainMenuItems} action={handleChangeCurrentLocalisation} />
                </ul>
            </div>
        )
    }

    function renderServiceModeMainButton() {
        const toggle = serviceMode ? "fa fa-toggle-on" : "fa fa-toggle-off";

        return (
            <li className="app__header-menu_item" onClick={() => handleChangeServiceMode(!serviceMode)} >
                <i className={toggle}></i>
                Tryb testu widoków
            </li>
        )
    }

    function renderHeaderButtons() {
        return (
            <div className="app__header_header-buttons-wrapper">
                <i className="fa fas fa-cart-arrow-down"></i>
                <div className="app__header_headerButtons">
                    {headerButtons.map(button =>
                        <ButtonAddFinishGood
                            key={button.label}
                            localisation={currentLocalisation}
                            button={button}
                        />
                    )}
                </div>
            </div>
        )
    }

    function renderServiceModeButtons() {
        function getCustomServiceBtnStyle(button) {
            const { serviceMode_jobName } = props.reducerServiceMode;
            return button === serviceMode_jobName ? "btn btn-light btn-sm" : "btn btn-outline-light btn-sm";
        }

        return (
            <div className="app__header_header-buttons-wrapper-service">
                <i className="fa fas fa-cogs"></i>
                <div className="app__header_headerButtons-service">
                    {allJobNames.map(jobName =>
                        <button
                            key={jobName}
                            className={getCustomServiceBtnStyle(jobName)}
                            onClick={() => props.changeServiceMode_jobName(jobName)}
                        >{jobName}
                        </button>
                    )}
                </div>
            </div>
        )
    }

    useEffect(() => {
        setCurrentLocalisation(props.reducerLocalisations.currentLocalisation);
        setServiceMode(props.reducerServiceMode.serviceMode);
    }, [props.reducerLocalisations.currentLocalisation, props.reducerServiceMode.serviceMode])

    return (
        <header className="app__header">
            {serviceMode && renderServiceModeButtons()}
            {renderHeaderButtons()}
            <div className="app__header_title-barIcon-wrapper">
                <div className="app__header-title">{currentLocalisation.name}</div>
                {renderDropdownMenu()}
            </div>
        </header>
    );
}


const mapStateToProps = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleServiceMode: bool => dispatch(actionsServiceMode.toggleServiceMode(bool)),
        toggleManagerMode: bool => dispatch(actionsServiceMode.toggleManagerMode(bool)),
        changeServiceMode_jobName: jobName => dispatch(actionsServiceMode.changeServiceMode_jobName(jobName)),
        changeCurrentLocalisation: localisation => dispatch(actionsLocalisations.changeCurrentLocalisation(localisation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogsHeaderBar)
