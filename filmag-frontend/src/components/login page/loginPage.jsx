import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';

import LoginBox from "./loginBox";
import Advertisement from '../util compnents/advertisement';
import Loader from '../common/loader';

import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import authService from '../../services/authService';
import loginPageHelper from "./loginPageHelper";
import schemas from "../constans/schemas/schemas";

const LoginPage = (props) => {
    const [user, setUser] = useState({ name: "", password: "" })
    const [runLoader, setRunLoader] = useState(false)

    const schema = schemas.getLoginPageSchema();

    const handleLogin = async () => {
        const { error } = Joi.validate(user, schema);
        if (error) {
            toast.error(error);return
        }
        setRunLoader(true);

        try {
            const jwt = await authService.login(user);

            authService.setJwt(jwt);
            authService.setTokenToRequestsHeader(jwt);

            const userInfo = userService.getUserFromJWT();
            const userLocalisations = await localisationService.getUserLocalisationsFromDB(userInfo)

            localisationService.setUserLocalisations(userLocalisations)

            loginPageHelper.redirectUserToNextPath(props.history)
        }
        catch (ex) {
            if (ex.response && (ex.response.status === 400 || ex.response.status === 403)) {
                toast.error(ex.response.data)
            }

            setRunLoader(false);
        }
    };

    return (
        <React.Fragment>
            <header className="app__header">
                <div className="app__header-title">FILMAG</div>
            </header>
            <div className="app__content">
                <Advertisement />
                <div className="login-page">
                    {runLoader ? <Loader /> : <LoginBox user={user} inputHandler={setUser} loginHandler={handleLogin}/>}
                </div>
            </div>
        </React.Fragment>
    );
}
 
export default withRouter(LoginPage);