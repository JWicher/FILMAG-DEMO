import React, { Component } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import { io } from "socket.io-client";

import LinkWithButton from '../common/linkWithButton';
import ConfirmAlert from '../input forms/confirmAlert';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import InputCustomSelect from '../input forms/inputCustomSelect';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import Loader from '../common/loader';
import client_paths from '../../constants/client_URL_paths';
import formsLocalisations from "../constans/forms/formsLocalisations.jsx";
import columnsLocalisations from "../constans/columns/columnsLocalisations";
import schemas from "../constans/schemas/schemas";

const apiUrl = process.env.REACT_APP_BASIC_API_URL;

class Localisations extends Component {
    constructor() {
        super();
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        if (isAdmin) this.columns.push({ label: "", path: "btn-delete" })
    }

    state = {
        localisations: []
    };

    socket = io(apiUrl);

    async componentDidMount() {
        this.mounted = true;
        this.socket.on('localisations_updated', async () => await this.fetchNewData());
        await this.fetchNewData();
    };

    componentWillUnmount() {
        this.mounted = false;
        this.socket.disconnect();
  }

    async fetchNewData(){
        try{
            const localisations = await localisationService.getLocalisations();
            this.mounted && this.setState({ localisations });
        }
        catch (error) {
              toast.error("Problem z pobraniem danych z serwera.")
        }
    };

    validateNewLocalisation(localisation) {
        const { error } = Joi.validate(localisation, this.schema);
        return error ? error.details[0].message : null;
    };

    handleDeleteLocalisation = async (localisationToDelete) => {
        try {
            await localisationService.deleteLocalisation(localisationToDelete);
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
     handleAddLocalisation = async (localisation) => {
        console.log('add localisation 1')
        try {
            const error = this.validateNewLocalisation(localisation);
            if (error) {
                toast.error(error);
                return;
            }
            await localisationService.addLocalisation(localisation);
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };

    handleInputOnChange = async ({ currentTarget: input }) => {
        try {
            const index = this.state.localisations.findIndex(l => l._id === input.name);
            const localisation = this.state.localisations[index];
            localisation.category = input.value;
            
            await localisationService.updateLocalisation(localisation);
        }
        catch (ex) {
            if (ex && ex.response) {
                toast.error(ex.response.data)
            }
        }
    };

    renderInputCustomSelect(localisation) {
        return (
            <InputCustomSelect
                item={localisation._id}
                currentValue={localisation.category}
                options={this.options}
                onChange={this.handleInputOnChange}
            />
        )
    };

    renderCellContent = (localisation, column) => {
        const { localisations } = this.state;
        const form_confirmAlert = this.form_confirmAlert;
        if (column.path === "#") return localisations.indexOf(localisation) + 1;
        else if (column.path === "name") return localisation.name;
        else if (column.path === "category") return this.renderInputCustomSelect(localisation);
        else if (column.path === "btn-delete") return this.renderConfirmAlert(localisation, form_confirmAlert);
    };

    renderConfirmAlert(area, form) {
        return (
            <ConfirmAlert
                item={area}
                itemRepresentation={area.name}
                form={form}
            />
        )
    };

    renderAddLocalisationButton() {
        return <ConfirmAlertSettings form={this.form_addLocalisation} />
    };

    renderHeader(columns, mainDivCSS, contentCSS) {
        return (
            <div className={mainDivCSS}>
                {columns.map(column => <div key={column.path} className={contentCSS}>{column.label}</div>)}
            </div>
        )
    }

    renderLocalisations(localisations, mainDivCSS, itemCSS, contentCSS) {
        return (
            <div className={mainDivCSS}>
                {localisations.map(user =>
                    <div key={user._id}
                        className={itemCSS}>
                        {this.columns.map(column =>
                            <div key={user._id + column.path} className={contentCSS}
                            >{this.renderCellContent(user, column)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    form_confirmAlert = formsLocalisations.confirmAlert(this.handleDeleteLocalisation);
    form_addLocalisation = formsLocalisations.addLocalisation(this.handleAddLocalisation);
    columns = columnsLocalisations.getLocalisationsColumns();
    schema = schemas.getLocalisationSchema();
    options = ["", ...localisationService.getLocalisationNames()];

    render() {
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        const { localisations } = this.state;

        return (
            <div className="app__content">
                <div className="app__container-buttons">
                    <div className="settings__switch-buttons">
                        <LinkWithButton label="Wyświetl zdarzenia" path={client_paths.tasks.main} css={"btn btn-sm btn-primary"} />
                        <LinkWithButton label="Użytkownicy" path={client_paths.settings.users} />
                        <LinkWithButton label="Mój profil" path={client_paths.settings.user} />
                        {isAdmin && this.renderAddLocalisationButton()}
                    </div>
                    <LogoutButtonBox />
                </div>
                <div className="localisations">
                    {this.renderHeader(this.columns, "localisation localisation__header", "localisation__content")}
                    {localisations && localisations.length === 0 && <Loader />}
                    {this.renderLocalisations(localisations, "localisation__wrapper", "localisation", "localisation__content")}
                </div>
            </div>
        );
    }
}

export default Localisations;