import React, { useState, useEffect } from 'react';
import MenuMainItem from '../common/menuMainItem';
import MenuItems from '../common/menuItems';
import ButtonAddTask from '../button components/buttonAddTask';
import localisationService from '../../services/localisationService';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import { connect } from 'react-redux';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';

const Tasks_HeaderBar = (props) => {
    const [currentLocalisation, setCurrentLocalisation] = useState(props.reducerLocalisations.currentLocalisation);
    const [serviceMode, setServiceModen] = useState(props.reducerServiceMode.serviceMode);

    const handleChangeCurrentLocalisation = localisation => {
        setCurrentLocalisation(localisation);
        props.changeCurrentLocalisation(localisation)
    };
    const handleChangeServiceMode = serviceMode => {
        setServiceModen(serviceMode);
        props.toggleServiceMode(serviceMode)
    };



    const headerButtons = [
        { label: "Zamów formatkę", type: "order" },
        { label: "Odbiór palet", type: "orderTakeout" },
        { label: "Awaria", type: "breakdown" },
        { label: "Przezbrojenie", type: "modelChange" },
        { label: "Czyszczenie", type: "cleaning" }
    ];

    const allJobNames = userService.getJobNames();

    function renderShowDataMenu() {
        const validLocalisations = localisationService.getCurrentUserLocalisations();
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");

        return (
            <div className="app__header-barIcon  common-cursor-pointer" >
                <i className="fa far fa-bars fa-3x"></i>
                <ul className="app__header-menu">
                    {isAdmin && renderServiceModeMainButton()}
                    <MenuMainItem label="Ustawienia" path={client_paths.settings.main} icon="fa-cog" />
                    <MenuItems items={validLocalisations} action={handleChangeCurrentLocalisation} />
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

    function renderAddTaskButtons() {
        return (
            <div className="app__header_header-buttons-wrapper">
                <i className="fa fas fa-cart-arrow-down"></i>
                <div className="app__header_headerButtons">
                    {headerButtons.map(button =>
                        <ButtonAddTask
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
        setServiceModen(props.reducerServiceMode.serviceMode);
    }, [props.reducerLocalisations.currentLocalisation, props.reducerServiceMode.serviceMode])

    const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
    const isCommonUser = userService.getUserFromJWT().isCommonUser;

    return (
        <header className="app__header">
            {serviceMode && renderServiceModeButtons()}
            {(currentLocalisation.category === "Maszyna" || isCommonUser) && renderAddTaskButtons()}
            <div className="app__header_title-barIcon-wrapper">
                <div className="app__header-title">{currentLocalisation.name}</div>
                {isSupervisor && renderShowDataMenu()}
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
        changeServiceMode_jobName: jobName => dispatch(actionsServiceMode.changeServiceMode_jobName(jobName)),
        changeCurrentLocalisation: localisation => dispatch(actionsLocalisations.changeCurrentLocalisation(localisation)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tasks_HeaderBar)
