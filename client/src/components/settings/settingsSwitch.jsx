import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import SettingsHeaderBar from './settingsHeaderBar';
import Users from './users';
import Localisations from './localisations';
import UserPage from './userPage';
import ProtectedRoute from '../util compnents/protectedRoute';
import client_paths from '../../constants/client_URL_paths';

const SettingsSwitch = () => {
    return (
        <React.Fragment>
            <SettingsHeaderBar />
            <Switch>
                <ProtectedRoute
                    path={client_paths.settings.localisations}
                    requireUserLevel={"Koordynator"}
                    component={Localisations}
                    redirectPath={client_paths.noPermissions}
                />
                <ProtectedRoute
                    path={client_paths.settings.users}
                    requireUserLevel={"Koordynator"}
                    component={Users}
                    redirectPath={client_paths.noPermissions}
                />
                <ProtectedRoute
                    path={client_paths.settings.user}
                    requireUserLevel={"Operator"}
                    component={UserPage}
                    redirectPath={client_paths.loginPage}
                />
                <Redirect from={client_paths.settings.main} to={client_paths.settings.users} />
            </Switch>
        </React.Fragment>
    );
}

export default SettingsSwitch;