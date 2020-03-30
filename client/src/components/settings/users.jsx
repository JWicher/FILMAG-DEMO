import React, { Component } from 'react';
import Joi from 'joi-browser';
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import LinkWithButton from '../common/linkWithButton';
import ConfirmAlert from '../input forms/confirmAlert';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import InputCustomSelect from '../input forms/inputCustomSelect';
import CustomCheckBox from '../common/customCheckBox';
import SettingsUserRecord from './userRecord';
import Loader from '../common/loader';
import userService from '../../services/userService';
import client_paths from '../../constants/client_URL_paths';
import { toast } from 'react-toastify';

class Users extends Component {
    state = {
        users: [],
    };
    // forms and variables
    form_deleteUser = {
        title: "Potwierdź usunięcie konta",
        btn_label: <p><span className="user__content_btn-label_full">Usuń konto</span><span className="user__content_btn-label_short">X</span></p>,
        btn_css: "btn btn-danger btn-sm",
        action: (user) => this.handleDeleteUser(user)
    };
    form_resetPassword = {
        title: "Resetowanie hasło",
        btn_label: <p><span className="user__content_btn-label_full">Resetuj hasło</span><span className="user__content_btn-label_short">R</span></p>,
        message: `Resetujesz hasło użytkownika. Nowe hasło: 12345.`,
        btn_css: "btn btn-secondary btn-sm",
        action: (user) => this.handleResetPassword(user)
    };
    form_addteUser = {
        title: "Dodaj konto użytkownika",
        p_label: "Login",
        btn_label: "Dodaj nowe konto",
        placeholder_1: "Podaj nazwę użytkownika",
        btn_css: "btn btn-success btn-sm",
        action: (inputData) => this.handleAddUser(inputData)
    };
    columns = [
        { label: "#", path: "#" },
        { label: "Pracownik", path: "name" },
        { label: "Stanowisko", path: "userJob" },
        { label: <i className="fa fas fa-desktop"></i>, path: "status" },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Magazyn</span>
                    <span className="user__content_btn-label_short">MG</span>
                </div>,
            path: "Magazyn"
        },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Maszyny</span>
                    <span className="user__content_btn-label_short">MS</span>
                </div>,
            path: "Maszyny"
        },
        {
            label:
                <div>
                    <span className="user__content_btn-label_full">Utrzymanie ruchu</span>
                    <span className="user__content_btn-label_short">UR</span>
                </div>,
            path: "Utrzymanie ruchu"
        },
        { label: "", path: "btn-reset" }
    ];
    options = userService.getJobNames();
    schema = {
        name: Joi.string().min(5).required().error(() => { return { message: "Podana nazwa jest za krótka. Minimum to 5 znaków." }; }),
        password: Joi.string().min(5).required().error(() => { return { message: "Podane hasło jest za krótkie. Minimum to 5 znaków." }; })
    };
    // basic
    constructor() {
        super();
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        if (isAdmin) {
            this.columns.push({ label: "", path: "btn-delete" })
        }
    };
    async componentDidMount() {
        this.setState({ users: await userService.getUsers() });
    };
    // handlers
    handleDeleteUser = async (userToDelete) => {
        try {
            const user = await userService.deleteUser(userToDelete);
            let users = [...this.state.users];

            const index = users.findIndex(u => u._id === user._id);
            if (index < 0) return;

            users.splice(index, 1)
            this.setState({ users });
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
    handleAddUser = async inputData => {

        try {
            const newUserData = {
                name: inputData.name,
                password: "12345"
            };

            const error = this.validateNewUser(newUserData);
            if (error) {
                toast.error(error)
                return null;
            }

            const newUser = await userService.addUser(newUserData);
            const users = [...this.state.users];
            users.unshift(newUser);

            this.setState({ users });

        } catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
    handleResetPassword = async user => {
        try {
            await userService.resetUserPassword({ _id: user._id, password: "12345" });
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
        const updatedUserInDataBase = await userService.updateUser(userWithLocalyChangedPermissions);

        const users = [...this.state.users];
        const index = users.findIndex(user => user._id === updatedUserInDataBase._id);
        users[index] = updatedUserInDataBase;
        this.setState({ users });
    };
    chamgeUserPermisions(user, area) {
        const index = user.permissions.indexOf(area);
        if (index >= 0) {
            user.permissions.splice(index, 1);
        }
        else {
            user.permissions.push(area);
        }
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

        if (input.value === "Współdzielone") {
            user.isCommonUser = true;
        }
        else user.isCommonUser = false;

        users[index] = await userService.updateUser(user);

        this.setState({ users })
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
            <ConfirmAlertSettings form={this.form_addteUser} />
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
        else if (!user.isDone && column.path === "btn-reset") return this.renderButton(user, this.form_resetPassword)// kolumna dla przycisku resetu hasła
        else if (!user.isDone && column.path === "btn-delete") return this.renderButton(user, this.form_deleteUser) // kolumna dla przycisku usunięcia konta
        return;
    };
    renderHeader() {  // podobne
        return (
            <div className="user user__header">
                {this.columns.map(column =>
                    <div key={column.path} className="user__content">{column.label}</div>
                )}
            </div>
        )
    }
    renderUsers() {  // podobne
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