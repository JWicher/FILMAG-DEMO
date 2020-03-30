import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { toast } from 'react-toastify';
import ConfirmAlert from '../input forms/confirmAlert';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import actionsServiceMode from '../../redux/actions/actionsServiceMode';
import { connect } from 'react-redux';

class LogoutButtonBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: userService.getUserFromJWT()
        }
    }

    form_confirmAlert = {
        title: "Wylogowanie",
        btn_label: <i className="fa fas fa-sign-out"></i>,
        btn_css: "btn btn-outline-secondary btn-sm",
        action: () => this.logout()
    };

    componentDidMount() {
        const user = userService.getUserFromJWT();
        this.setState({ user });
    }

    logout = async () => {
        try {
            await userService.logoutUser();
            this.props.toggleServiceMode(false);
            this.props.toggleManagerMode(false);
            this.props.changeServiceMode_jobName("Admin");
        } catch (ex) {
            toast.error("Wystąpił błąd podczas wylogowania")
        }
        finally {
            localStorage.clear();
            this.props.history.push(client_paths.home);
        }

    };

    handleInputOnChange = ({ currentTarget: input }) => {
        const user = { ...this.state.user };
        user[input.name] = input.value;
        this.setState({ user })
    };

    render_pLabel() {
        const { name } = this.state.user;
        const index = name.indexOf(" ") - 1;
        if (index < 0 && name[index] === "a") {
            return "Jesteś zalogowana jako:";
        }
        return "Jesteś zalogowany jako:"
    }

    render() {
        const { user } = this.state;
        const showOrHideElement = userService.isCurrentUserGreaterThan("Koordynator") ? "" : "display-flex";

        return (
            <div className="logout-button-box">

                <div className={"logout-button-box__info " + showOrHideElement}>
                    <p>{this.render_pLabel()}</p>
                    <Link to={client_paths.settings.user} >
                        <p style={{ textTransform: "capitalize" }}>{user.name}</p>
                    </Link>
                </div>
                <ConfirmAlert
                    item={user}
                    itemRepresentation="Czy chcesz się wylogować?"
                    form={this.form_confirmAlert}
                />
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return state;
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleServiceMode: bool => dispatch(actionsServiceMode.toggleServiceMode(bool)),
        toggleManagerMode: bool => dispatch(actionsServiceMode.toggleManagerMode(bool)),
        changeServiceMode_jobName: jobName => dispatch(actionsServiceMode.changeServiceMode_jobName(jobName)),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(LogoutButtonBox))
