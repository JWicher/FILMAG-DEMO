import React from 'react';
import { Redirect } from 'react-router-dom';
import LinkWithButton from '../common/linkWithButton';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import Advertisement from '../util compnents/advertisement';
import userService from '../../services/userService';
import client_path from '../../constants/client_URL_paths';

const Home = () => {
    const user = userService.getUserFromJWT();

    if (!user) return <Redirect to={client_path.loginPage} />

    const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");

    return (
        <React.Fragment>
            <header className="app__header">
                <div className="app__header-title">FILMAG</div>
            </header>
            <div className="app__content">
                <div className="app__container-buttons">
                    <div className="settings__switch-buttons">
                        <LinkWithButton
                            label="Wyświetl zdarzenia"
                            path={client_path.tasks.main}
                            css={"btn btn-sm btn-primary"}
                        />
                        {isSupervisor &&
                            <LinkWithButton
                                label="Przejdź do ustawień"
                                path={client_path.settings.users}
                            />
                        }
                    </div>
                    <LogoutButtonBox />
                </div>
                <Advertisement />
            </div>
        </React.Fragment>
    );
}

export default Home;