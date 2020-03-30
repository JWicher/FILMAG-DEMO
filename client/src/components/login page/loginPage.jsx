import React, { Component } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import Advertisement from '../util compnents/advertisement';
import Loader from '../common/loader';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import authService from '../../services/authService';
import utilsService from '../../services/utils';
import httpService from '../../services/httpService';
import client_paths from '../../constants/client_URL_paths';

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                name: "",
                password: ""
            },
            isWaitingForSerwerResponse: false,
        }
    }

    schema = {
        name: Joi.string().min(1).required().error(() => { return { message: "Za krótki login." }; }),
        password: Joi.string().min(5).required().error(() => { return { message: "Za krótkie hasło." }; })
    };
    errorMessage = "Obecnie Twoje konto nie posiada dostępu do żadych lokalizacji. Zgłoś problem przełożonemu lub adminowi."

    handleInputOnChange = ({ currentTarget: input }) => {
        const user = { ...this.state.user };
        user[input.name] = input.value;
        this.setState({ user })
    };

    handleLogin = async () => {
        const { name, password } = this.state.user;
        const error = this.validateUser({ name, password });
        if (error) { toast.error(error); return null; }

        this.runLoader(true);
        try {
            const jwt = await authService.login(name, password);

            authService.setJwt(jwt);
            httpService.setHeader_xAuthToken(jwt)

            const user = userService.getUserFromJWT();
            const userLocalisations = await localisationService.getUserLocalisationsFromDB(user)

            localisationService.setUserLocalisations(userLocalisations)

            this.redirectUserToNextPath()
        }
        catch (ex) {
            if (ex.response && (ex.response.status === 400 || ex.response.status === 403)) {
                toast.error(ex.response.data)
            }

            this.runLoader(false);
        }

    };

    runLoader(mode) {
        let { isWaitingForSerwerResponse } = this.state;
        isWaitingForSerwerResponse = mode;
        this.setState({ isWaitingForSerwerResponse })
    }

    redirectUserToNextPath = async () => {
        const userLocalisations = localisationService.getCurrentUserLocalisations();
        const isSupervisor = userService.isCurrentUserGreaterThanORequalTo("Koordynator");
        const isCommonUser = userService.getUserFromJWT().isCommonUser;

        if (isSupervisor || isCommonUser) {
            this.props.history.push(client_paths.tasks.main);
        }
        else if (userLocalisations.length > 1) {
            this.props.history.push(client_paths.selectLocalisation);
        }
        else if (userLocalisations.length === 1) {
            this.props.history.push(userLocalisations[0].path);
        }
        else {
            toast.error(this.errorMessage);
            return null;
        }
    }

    validateUser(user) {
        const { error } = Joi.validate(user, this.schema);
        return error ? error.details[0].message : null;
    };

    renderLoginBox() {
        return (
            <div className="login-page_login_box">
                <h1>Zaloguj się</h1>
                <div className="login-page_login_box__input-box">
                    <div className="login-page_login_box__input-box_group">
                        <p>Login</p>
                        <input name="name"
                            autoComplete="off"
                            autoFocus
                            onChange={this.handleInputOnChange}
                            onKeyPress={(target) => utilsService.runFunctionAfterPressEnter(target, this.handleLogin)}
                        ></input>
                    </div>
                </div>
                <div className="login-page_login_box__input-box">
                    <div className="login-page_login_box__input-box_group">
                        <p>Hasło</p>
                        <input name="password"
                            autoComplete="off"
                            type="password"
                            onChange={this.handleInputOnChange}
                            onKeyPress={(target) => utilsService.runFunctionAfterPressEnter(target, this.handleLogin)}
                        ></input>
                    </div>
                </div>
                <div className="login-page_login_box__button-group">
                    <button onClick={this.handleLogin}
                    >Zaloguj się</button>
                </div>
            </div>
        );
    }
    render() {

        return (
            <React.Fragment>
                <header className="app__header">
                    <div className="app__header-title">FILMAG</div>
                </header>
                <div className="app__content">
                    <Advertisement />
                    <div className="login-page">
                        {this.state.isWaitingForSerwerResponse && <Loader />}
                        {!this.state.isWaitingForSerwerResponse && this.renderLoginBox()}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default LoginPage;

