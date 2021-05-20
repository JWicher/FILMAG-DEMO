import React from 'react';
import UserInfoLogin from './logoutButtonBox';
import LinkWithButton from '../common/linkWithButton';
import client_paths from '../../constants/client_URL_paths';

const NoPermissions = () => {
    return (
        <React.Fragment>
            <header className="app__header"></header>
            <div className="app__content">
                <div className="app__container-buttons">
                    <div></div>
                    <UserInfoLogin />
                </div>
                <div className="no-permissions-box">
                    <h2>ODMOWA DOSTĘPU</h2>
                    <p>Nie posiadasz uprawnień do przeglądania zawartości tej strony.</p>
                    <LinkWithButton label="Przejdź do wyboru lokalizacji" path={client_paths.selectLocalisation} />
                </div>
            </div>
        </React.Fragment>
    );
}

export default NoPermissions;