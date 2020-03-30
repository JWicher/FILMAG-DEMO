import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import SettingsHeaderBar from './settingsHeaderBar';
import Users from './users';
import Localisations from './localisations';
import UserPage from './userPage';
import ProtectedRoute from '../util compnents/protectedRoute';
import client_paths from '../../constants/client_URL_paths';

const SettingsSwitch = () => {
    const path_settings = client_paths.settings;

    const submenuOptions = [
        { label: "Wykaz użytkowników", path: path_settings.users },
        { label: "Wykaz lokalizacji", path: path_settings.localisations },
        { label: "Mój profil", path: path_settings.user }
    ]

    return (
        <React.Fragment>
            <SettingsHeaderBar validLocations={submenuOptions} />
            <Switch>
                <ProtectedRoute
                    path={path_settings.localisations}
                    requireUserLevel={"Koordynator"}
                    component={Localisations}
                    redirectPath={client_paths.noPermissions}
                />
                <ProtectedRoute
                    path={path_settings.users}
                    requireUserLevel={"Koordynator"}
                    component={Users}
                    redirectPath={client_paths.noPermissions}
                />
                <ProtectedRoute
                    path={path_settings.user}
                    requireUserLevel={"Operator"}
                    component={UserPage}
                    redirectPath={client_paths.loginPage}
                />
                <Redirect from={path_settings.main} to={path_settings.users} />
            </Switch>
        </React.Fragment>
    );
}

export default SettingsSwitch;