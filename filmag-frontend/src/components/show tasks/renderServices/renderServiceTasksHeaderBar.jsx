import React from 'react';
import MenuItems from '../../common/menuItems';
import ButtonAddTask from '../../button components/buttonAddTask';
import localisationService from '../../../services/localisationService';
import userService from '../../../services/userService';

const renderServiceTasksHeaderBar = {
    init: ({ serviceMode, serviceMode_jobName }) => {
        function renderServiceModeMainButton(handler) {
            const toggle = serviceMode ? "fa fa-toggle-on" : "fa fa-toggle-off";
            return (
                <li className="app__header-menu_item" onClick={() => handler(!serviceMode)} >
                    <i className={toggle}></i>
                    Tryb testu widoków
                </li>
            )
        };
        function getCustomServiceBtnStyle(jobName) {
            return jobName === serviceMode_jobName ? "btn btn-light btn-sm" : "btn btn-outline-light btn-sm";
        };

        return {
            renderShowDataMenu({ menuItems, menuHandler, serviceModeHandler }) {
                const { managersMainMenuItems, workersMinMenuItems } = menuItems;
                const validLocalisations = localisationService.getCurrentUserLocalisations();
                const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
                const isManagmenemt = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
                const mainMenuItems = isManagmenemt ? managersMainMenuItems : workersMinMenuItems;
        
                return (
                    <div className="app__header-barIcon  common-cursor-pointer" >
                        <i className="fa far fa-bars fa-3x"></i>
                        <ul className="app__header-menu">
                            {isAdmin && renderServiceModeMainButton(serviceModeHandler)}
                            <MenuItems items={mainMenuItems} action={menuHandler} />
                            <hr className="hr-line-color"/>
                            <MenuItems items={validLocalisations} action={menuHandler} />
                        </ul>
                    </div>
                )
            },
            renderAddTaskButtons({headerButtons, currentLocalisation}) {
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
            },
            renderServiceModeButtons({handler}) {
                const allJobNames = userService.getJobNames();
                return (
                    <div className="app__header_header-buttons-wrapper-service">
                        <i className="fa fas fa-cogs"></i>
                        <div className="app__header_headerButtons-service">
                            {allJobNames.map(jobName =>
                                <button
                                    key={jobName}
                                    className={getCustomServiceBtnStyle(jobName)}
                                    onClick={() => handler(jobName)}
                                >{jobName}
                                </button>
                            )}
                        </div>
                    </div>
                )
            }
        }
    }
};

export default renderServiceTasksHeaderBar;
