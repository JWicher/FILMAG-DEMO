import React, { Component } from 'react';
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

class UserPage extends Component {
    state = {
        user: {}
    }

    async componentDidMount() {
        const user = userService.getUserFromJWT();
        this.setState({ user });
    };

    handleResetPassword = async ({ password, newPassword }) => {
        let user = { ...this.state.user };
        const error = this.validateNewCredencials({ password, newPassword }, this.schemaPassword);

        if (error) {
            toast.error(error);
            return;
        }
        try {
            const token = await userService.resetUserPassword({ _id: user._id, password, newPassword });
            authService.setJwt(token)

            toast.success("Zaktualizowano hasło");
            this.setState({ user: userService.getUserFromJWT() })
        }
        catch (ex) {
            if (ex.response)
                toast.error(ex.response.data);
        }
    };

    handleResetPIN = async ({ password, newPIN }) => {
        let user = { ...this.state.user };
        const error = this.validateNewCredencials({ password, newPIN }, this.schemaPIN);

        if (error) {
            toast.error(error);
            return;
        }
        try {
            const token = await userService.resetUserPIN({ _id: user._id, password, newPIN });
            authService.setJwt(token)
            toast.success("Zaktualizowano PIN");
            this.setState({ user: userService.getUserFromJWT() })
        }
        catch (ex) {
            if (ex.response)
                toast.error(ex.response.data);
        }
    };
    validateNewCredencials(user, schema) {
        const { error } = Joi.validate(user, schema);
        return error ? error.details[0].message : null;
    };


    renderSettingsNavigationButtons() {
        const settings = client_paths.settings;

        return <div className="settings__switch-buttons">
            <LinkWithButton label="Wyświetl zdarzenia" path={client_paths.tasks.main} css={"btn btn-sm btn-primary"} />
            <LinkWithButton label="Użytkownicy" path={settings.users} />
            <LinkWithButton label="Lokalizacje" path={settings.localisations} />
        </div>
    };
    renderReturnButton() {
        return <button className="btn btn-sm btn-primary" onClick={this.props.history.goBack}>Powróć do wybranej lokalizacji</button>
    }

    form_resetPassword = formsUserPage.resetPassword(this.handleResetPassword)
    form_resetPIN = formsUserPage.resetPIN(this.handleResetPIN)
    schemaPassword = schemas.getUserPageSchema().schemaPassword;
    schemaPIN = schemas.getUserPageSchema().schemaPIN;

    render() {
        const user = userService.getUserFromJWT();
        const { name: userName, shortIdentifier } = user;
        const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");

        return (
            <div className="app__content">
                <div className="app__container-buttons">
                    <div className="settings__switch-buttons">
                        {!isSupervisor && this.renderReturnButton()}
                        {isSupervisor && this.renderSettingsNavigationButtons()}
                        <div></div>
                    </div>
                    <LogoutButtonBox />
                </div>
                <div className="settings__user-page">
                    <div className="settings__user-page_user_box">
                        <h2>Profil użytkownika</h2>
                        <div className="settings__user-page_user_box__info-box_group">
                            <p>Login:</p>
                            <div style={{ textTransform: "capitalize" }} >{userName}</div>
                        </div>
                        <div className="settings__user-page_user_box__info-box_group">
                            <p>Hasło :</p>
                            <div><ConfirmAlertSettings form={this.form_resetPassword} /></div>
                        </div>
                        <hr className="border border-white" />
                        {
                            !user.isCommonUser &&
                            <div>
                                <div className="settings__user-page_user_box__info-box_group">
                                    <p>Kod Id :</p>
                                    <div >{shortIdentifier.idCode}</div>
                                </div>
                                <div className="settings__user-page_user_box__info-box_group">
                                    <p>PIN :</p>
                                    <div><ConfirmAlertSettings form={this.form_resetPIN} /></div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default UserPage;