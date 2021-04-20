import React, { Component } from 'react';
import Joi from 'joi-browser';
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

import LinkWithButton from '../common/linkWithButton';
import Loader from '../common/loader';
import CustomCheckBox from '../common/customCheckBox';
import ConfirmAlert from '../input forms/confirmAlert';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import InputCustomSelect from '../input forms/inputCustomSelect';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import SettingsUserRecord from './userRecord';
import userService from '../../services/userService';
import forms from "../constans/forms/formsUsers.jsx";
import columnsUsers from "../constans/columns/columnsUsers.jsx";
import schemas from "../constans/schemas/schemas";
import client_paths from '../../constants/client_URL_paths';

const apiUrl = process.env.REACT_APP_BASIC_API_URL;

class Users extends Component {
    constructor() {
        super();
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        if (isAdmin) {
            this.columns.push({ label: "", path: "btn-delete" })
        }
    };

    state = {
        users: [],
    };

    columns = columnsUsers.getUserColumns();
    options = userService.getJobNames();
    schema = schemas.getUserSchema();
    socket = io(apiUrl);

    async componentDidMount() {
        this.mounted = true;
        this.socket.on('users_updated', async () => await this.fetchNewData());

        await this.fetchNewData();
    };

    componentWillUnmount() {
        this.mounted = false;
        this.socket.disconnect();
  }

    async fetchNewData(){
        try{
            const users = await userService.getUsers();
            this.mounted && this.setState({ users });
        }
        catch (error) {
              toast.error("Problem z pobraniem danych z serwera.")
        }
    };

    // handlers
    handleDeleteUser = async (userToDelete) => {
        try {
            await userService.deleteUser(userToDelete);
            toast.info("Usunięto użytkownika.")
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
    handleAddUser = async inputData => {
        try {
            const newUserData = {
                name: inputData.name
            };

            const error = this.validateNewUser(newUserData);
            if (error) {
                toast.error(error)
                return null;
            }

            await userService.addUser(newUserData);
            toast.success("Dodano użytkownika")
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
    handleResetPassword = async user => {
        try {
            await userService.resetUserPasswordToDefault({ _id: user._id });
            toast.info("Zmieniono hasło użytkownika.")
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data);
        }
    };
    // services
    validateNewUser(user) {
        const { error } = Joi.validate(user, this.schema);
        return error ? error.details[0].message : null;
    };

    updateUserPermissions = async ({ user, area }) => {
        const userWithLocalyChangedPermissions = this.chamgeUserPermisions(user, area);
        await userService.updateUser(userWithLocalyChangedPermissions);
    };
    chamgeUserPermisions(user, area) {
        const index = user.permissions.indexOf(area);
        if (index >= 0) user.permissions.splice(index, 1);
        else user.permissions.push(area);

        return user;
    }
    selectOptions(user) {
        const isOptionButtonDissabled = userService.isCurrentUserLessThanORequalTo(user.job);
        const options = [...this.options];
        const index = options.indexOf(userService.getUserFromJWT().job);
        return isOptionButtonDissabled ? [user.job] : options.splice(index + 1);
    }
    isChecked(userPermissions, area) {
        return userPermissions.indexOf(area) >= 0
    };
    // render functions
    handleInputOnChange = async ({ currentTarget: input }) => {
        const users = [...this.state.users];
        const index = users.findIndex(u => u._id === input.name);
        const user = users[index];

        user.job = input.value;
        user.isCommonUser = false;

        if (input.value === "Współdzielone") {
            user.isCommonUser = true;
        }
        
        await userService.updateUser(user);
    };
    renderCheckBox(user, area) {
        const isDisabled = userService.isCurrentUserLessThanORequalTo(user.job);
        return (
            <CustomCheckBox
                item={{ user, area }}
                isChecked={this.isChecked(user.permissions, area)}
                isDisabled={isDisabled}
                action={(user) => this.updateUserPermissions(user)}
            />
        )
    };
    renderUserStatus(user) {
        return (
            <div className={"fa far fa-user" + (user.isLogged ? " text-success" : " text-muted")}></div>
        )
    }
    renderButton(user, form) {
        const isDisabled = userService.isCurrentUserLessThanORequalTo(user.job);
        return (
            <ConfirmAlert
                item={user}
                itemRepresentation={user.name}
                form={form}
                disableButton={isDisabled}
            />
        )
    };
    renderInputCustomSelect(user) {
        const isDisabled = userService.isCurrentUserLessThanORequalTo(user.job);
        return (
            <InputCustomSelect
                item={user._id}
                currentValue={user.job}
                isDisabled={isDisabled}
                options={this.selectOptions(user)}
                onChange={this.handleInputOnChange}
            />
        )
    };
    renderAddUserButton() {
        return (
            <ConfirmAlertSettings form={forms.addteUser(this.handleAddUser)} />
        )
    };
    renderCellContent = (user, column) => {
        const { users } = this.state;

        if (column.path === "#") return users.indexOf(user) + 1;
        else if (column.path === "name") return user.name;
        else if (column.path === "userJob") return this.renderInputCustomSelect(user);
        else if (column.path === "status") return this.renderUserStatus(user);
        else if (column.path === "Magazyn") return this.renderCheckBox(user, "Magazyn");
        else if (column.path === "Maszyny") return this.renderCheckBox(user, "Maszyna");
        else if (column.path === "Utrzymanie ruchu") return this.renderCheckBox(user, "Utrzymanie ruchu");
        else if (column.path === "Wyroby gotowe") return this.renderCheckBox(user, "Wyroby gotowe");
        else if (column.path === "btn-reset" && !user.isDone) return this.renderButton(user, forms.resetPassword(this.handleResetPassword))
        else if (column.path === "btn-delete" && !user.isDone) return this.renderButton(user, forms.deleteUser(this.handleDeleteUser))
        return;
    };
    renderHeader() {
        return (
            <div className="user user__header">
                {this.columns.map(column =>
                    <div key={column.path} className="user__content">{column.label}</div>
                )}
            </div>
        )
    }
    renderUsers() {
        return (
            <AutoSizer >
                {({ height, width }) => (
                    <FixedSizeList
                        itemData={this.state.users}
                        height={height - 75}
                        width={width}
                        itemCount={this.state.users.length}
                        itemSize={50}
                    >
                        {({ data, index, style }) => {
                            const user = data[index];
                            return (
                                <div style={{ ...style }}>
                                    <SettingsUserRecord
                                        user={user}
                                        columns={this.columns}
                                        renderCellContent={this.renderCellContent}
                                    />
                                </div>
                            )
                        }}
                    </FixedSizeList>
                )}
            </AutoSizer>
        )
    };

    // main render
    render() {
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");

        return (
            <div className="app__content">
                <div className="app__container-buttons">
                    <div className="settings__switch-buttons">
                        <LinkWithButton label="Wyświetl zdarzenia" path={client_paths.tasks.main} css={"btn btn-sm btn-primary"} />
                        <LinkWithButton label="Lokalizacje" path={client_paths.settings.localisations} />
                        <LinkWithButton label="Mój profil" path={client_paths.settings.user} />
                        {isAdmin && this.renderAddUserButton()}
                    </div>
                    <LogoutButtonBox />
                </div>

                <div className="users">
                    {this.renderHeader()}
                    {this.state.users && this.state.users.length === 0 && <Loader />}
                    {this.renderUsers()}
                </div>
            </div>
        );
    }
}

export default Users;