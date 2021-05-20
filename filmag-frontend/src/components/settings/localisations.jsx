import React, { useState } from 'react';
import { io } from "socket.io-client";

import LinkWithButton from '../common/linkWithButton';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import BtnDeleteLocalisation from "../button components/buttonDeleteLocalisation";
import ButtonAddLocalisation from "../button components/buttonAddLocalisation";
import SelectLocalisationCategory from "../button components/selectLocalisationCategory";
import Loader from '../common/loader';

import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import client_paths from '../../constants/client_URL_paths';
import columnsLocalisations from "../constans/columns/columnsLocalisations";
import helper from "../../services/helpers";

const apiUrl = process.env.REACT_APP_BASIC_API_URL;

const Localisations = () => {
    const [ localisations, setLocalisations ] = useState([]);
    const [isMounted, setIsMounted] = useState(true);

    const socket = io(apiUrl);
    const columns = columnsLocalisations.getLocalisationsColumns();
    const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");

    if (isAdmin) {
        columns.push({ label: "", path: "btn-delete" })
    }

    function fetchAndSetNewData(){
        helper.fetchAndSetNewData(isMounted, localisationService.getLocalisations, setLocalisations);
    }

    function renderCellContent(localisation, columnPath){
        switch(columnPath){
            case "#": return localisations.indexOf(localisation) + 1;
            case "name": return localisation.name;
            case "category": return <SelectLocalisationCategory localisation={localisation} />;
            case "btn-delete": return <BtnDeleteLocalisation localisation={localisation} />;
            default: return
        }
    };

    helper.useEffectAsync(async () => {
        socket.on('localisations_updated', async () => await fetchAndSetNewData())
        await fetchAndSetNewData()
    }, () => {
        setIsMounted(false);
        socket.disconnect()
    }, [])

    return (
        <div className="app__content">
            <div className="app__container-buttons">
                <div className="settings__switch-buttons">
                    <LinkWithButton label="Wyświetl zdarzenia" path={client_paths.tasks.main} css={"btn btn-sm btn-primary"} />
                    <LinkWithButton label="Użytkownicy" path={client_paths.settings.users} />
                    <LinkWithButton label="Mój profil" path={client_paths.settings.user} />
                    {isAdmin && <ButtonAddLocalisation />}
                </div>
                <LogoutButtonBox />
            </div>
            <div className="localisations">
                <div className="localisation localisation__header">
                    {columns.map(column => <div key={column.path} className="localisation__content">{column.label}</div>)}
                </div>

                { !localisations ? <Loader /> :
                <div className="localisation__wrapper">
                    {localisations.map(user =>
                        <div key={user._id}
                            className="localisation">
                            {columns.map(column =>
                                <div key={user._id + column.path} className="localisation__content">
                                    {renderCellContent(user, column.path)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                }
            </div>
        </div>
    );
}
 
export default Localisations;