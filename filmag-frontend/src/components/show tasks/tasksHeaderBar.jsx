import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import { connect } from 'react-redux';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import actionsLocalisations from '../../redux/actions/actionsLocalisations';
import renderMaster from "./renderServices/renderMaster";

const TasksHeaderBar = (props) => {
    const [currentLocalisation, setCurrentLocalisation] = useState(props.reducerLocalisations.currentLocalisation);
    const [serviceMode, setServiceModen] = useState(props.reducerServiceMode.serviceMode);

    const handleChangeCurrentLocalisation = localisation => {
        setCurrentLocalisation(localisation);
        props.changeCurrentLocalisation(localisation)
        props.toggleManagerMode(false)
    };
    const handleChangeServiceMode = serviceMode => {
        setServiceModen(serviceMode);
        props.toggleServiceMode(serviceMode)

    };

    useEffect(() => {
        setCurrentLocalisation(props.reducerLocalisations.currentLocalisation);
        setServiceModen(props.reducerServiceMode.serviceMode);
    }, [props.reducerLocalisations.currentLocalisation, props.reducerServiceMode.serviceMode])

    const isCommonUser = userService.getUserFromJWT().isCommonUser;
    const renderMasterInstance = renderMaster.tasksHeaderBarModule.init({ serviceMode, serviceMode_jobName: props.reducerServiceMode.serviceMode_jobName })

    const headerButtons = [
        { label: "Zamów formatkę", type: "order" },
        { label: "Odbiór palet", type: "orderTakeout" },
        { label: "Awaria", type: "breakdown" },
        { label: "Przezbrojenie", type: "modelChange" },
        { label: "Czyszczenie", type: "cleaning" }
    ];

    const menuItems = {
        managersMainMenuItems: [
            {name: "Ustawienia", category: "Ustawienia", path: client_paths.settings.main},
            {name: "Wyroby gotowe", category: "Wyroby gotowe", path: client_paths.finishGoods.main}
        ],
        workersMinMenuItems: [
            {name: "Wyroby gotowe", category: "Wyroby gotowe", path: client_paths.finishGoods.main}
        ]
    };

    const shouldRenderAddTaskButton = currentLocalisation.category === "Maszyna" || isCommonUser;
    
    return (
        <header className="app__header">
            {serviceMode && renderMasterInstance.renderServiceModeButtons({handler: props.changeServiceMode_jobName })}
            {shouldRenderAddTaskButton && renderMasterInstance.renderAddTaskButtons({headerButtons, currentLocalisation})}
            
            <div className="app__header_title-barIcon-wrapper">
                <div className="app__header-title">{currentLocalisation.name}</div>
                {renderMasterInstance.renderShowDataMenu({
                    menuItems,
                    menuHandler: handleChangeCurrentLocalisation,
                    serviceModeHandler: handleChangeServiceMode
                    })
                }
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
)(TasksHeaderBar)
