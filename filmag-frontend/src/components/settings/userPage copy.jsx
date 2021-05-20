import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Joi from 'joi-browser';
import LinkWithButton from '../common/linkWithButton';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import userService from '../../services/userService';
import authService from '../../services/authService';
import client_paths from '../../constants/client_URL_paths';
import formsUserPage from "../constans/forms/formsUserPage.jsx";
import schemas from "../constans/schemas/schemas";


const UserPage = (props) => {
    const [ user, setUser ] = useState(userService.getUserFromJWT());
    
    const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
    const form_resetPassword = formsUserPage.resetPassword( handleResetPassword )
    const form_resetPIN = formsUserPage.resetPIN( handleResetPIN )

    async function handleResetPassword({ password, newPassword }){
        const schemaPassword = schemas.getUserPageSchema().schemaPassword;
        const { error } = Joi.validate(user, schemaPassword);

        if (error) {
            toast.error(error.details[0].message);
            return;
        }

        try {
            const token = await userService.resetUserPassword({ _id: user._id, password, newPassword });
            authService.setJwt(token);

            toast.success("Zaktualizowano hasło");

            const updatedUser = userService.getUserFromJWT()
            setUser(updatedUser)
        }
        catch (ex) {
            if (ex.response)
                toast.error(ex.response.data);
        }
    };

    async function handleResetPIN({ password, newPIN }){
        const schemaPIN = schemas.getUserPageSchema().schemaPIN;
        const { error } = Joi.validate(user, schemaPIN);

        if (error) {
            toast.error(error);
            return;
        }
        try {
            const token = await userService.resetUserPIN({ _id: user._id, password, newPIN });
            authService.setJwt(token);

            toast.success("Zaktualizowano PIN");
            
            const updatedUser = userService.getUserFromJWT();
            setUser(updatedUser)
        }
        catch (ex) {
            if (ex.response)
                toast.error(ex.response.data);
        }
    };

    return (
        <div className="app__content">
            <div className="app__container-buttons">
                <div className="settings__switch-buttons">
                    {!isSupervisor
                            ? 
                        <button className="btn btn-sm btn-primary" onClick={props.history.goBack}>Powróć do wybranej lokalizacji</button>
                            :
                        <div className="settings__switch-buttons">
                            <LinkWithButton label="Wyświetl zdarzenia" path={client_paths.tasks.main} css={"btn btn-sm btn-primary"} />
                            <LinkWithButton label="Użytkownicy" path={client_paths.settings.users} />
                            <LinkWithButton label="Lokalizacje" path={client_paths.settings.localisations} />
                        </div>
                    }
                    <div></div>
                </div>
                <LogoutButtonBox />
            </div>
            <div className="settings__user-page">
                <div className="settings__user-page_user_box">
                    <h2>Profil użytkownika</h2>
                    <div className="settings__user-page_user_box__info-box_group">
                        <p>Login:</p>
                        <div style={{ textTransform: "capitalize" }} >{user.userName}</div>
                    </div>
                    <div className="settings__user-page_user_box__info-box_group">
                        <p>Hasło :</p>
                        <div><ConfirmAlertSettings form={form_resetPassword} /></div>
                    </div>
                    <hr className="border border-white" />
                    {
                        !user.isCommonUser &&
                        <div>
                            <div className="settings__user-page_user_box__info-box_group">
                                <p>Kod Id :</p>
                                <div >{user.shortIdentifier.idCode}</div>
                            </div>
                            <div className="settings__user-page_user_box__info-box_group">
                                <p>PIN :</p>
                                <div><ConfirmAlertSettings form={form_resetPIN} /></div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );;
}
 
export default withRouter(UserPage);