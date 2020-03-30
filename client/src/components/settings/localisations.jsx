import React, { Component } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import LinkWithButton from '../common/linkWithButton';
import ConfirmAlert from '../input forms/confirmAlert';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import InputCustomSelect from '../input forms/inputCustomSelect';
import LogoutButtonBox from '../util compnents/logoutButtonBox';
import userService from '../../services/userService';
import localisationService from '../../services/localisationService';
import Loader from '../common/loader';
import client_paths from '../../constants/client_URL_paths';

class Localisations extends Component {
    constructor() {
        super();
        const isAdmin = userService.isCurrentUserGreaterThanORequalTo("Admin");
        if (isAdmin) this.columns.push({ label: "", path: "btn-delete" })
    }

    state = {
        localisations: []
    };

    columns = [
        { label: "#", path: "#" },
        { label: "Nazwa", path: "name" },
        { label: "Kategoria", path: "category" }
    ];

    options = ["", ...localisationService.getLocalisationNames()];

    form_confirmAlert = {
        title: 'Potwierdź usunięcie lokalizacji',
        btn_label: <p><span className="localisation__content_btn-label_full">Usuń lokalizację</span><span className="localisation__content_btn-label_short">X</span></p>,
        btn_css: "btn-danger btn-sm",
        action: (localisation) => this.handleDeleteLocalisation(localisation)
    };

    form_addLocalisation = {
        title: "Dodaj nową lokalizację",
        p_label: "Nazwa",
        placeholder_1: "Podaj nazwę lokalizacji",
        btn_label: "Dodaj nową lokalizację",
        btn_css: "btn btn-success btn-sm",
        action: (localisation) => this.handleAddLocalisation(localisation)
    };

    schema = {
        name: Joi.string().min(1).max(255).required().error(() => { return { message: "Podana nazwa jest za krótka. Minimum to 1 znak." }; }),
    };

    async componentDidMount() {
        this.setState({ localisations: await localisationService.getLocalisations() })
    };
    validateNewLocalisation(localisation) {
        const { error } = Joi.validate(localisation, this.schema);
        return error ? error.details[0].message : null;
    };

    handleDeleteLocalisation = async (localisationToDelete) => {
        try {
            const localisation = await localisationService.deleteLocalisation(localisationToDelete);
            const localisations = this.state.localisations;

            const index = localisations.findIndex(l => l._id === localisation._id);
            if (index < 0) return;

            localisations.splice(index, 1)
            this.setState({ localisations });
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };
    handleAddLocalisation = async localisation => {

        try {
            const error = this.validateNewLocalisation(localisation);
            if (error) {
                toast.error(error);
                return null;
            }

            const newLocalisation = await localisationService.addLocalisation(localisation);
            const localisations = this.state.localisations;
            localisations.unshift(newLocalisation);
            this.setState({ localisations });
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
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

    handleInputOnChange = async ({ currentTarget: input }) => {
        try {
            const localisations = [...this.state.localisations];
            const index = localisations.findIndex(l => l._id === input.name);
            let localisation = localisations[index];
            localisation.category = input.value;
            localisations[index] = await localisationService.updateLocalisation(localisation);

            const sortedLocalisations = localisationService.sortLocalisationsOrder(localisations);
            localisationService.setUserLocalisations(sortedLocalisations);

            this.setState({ localisations: sortedLocalisations });
        }
        catch (ex) {
            if (ex && ex.response) {
                toast.error(ex.response.data)
            }
        }
    };

    renderCellContent = (localisation, column) => {
        const { localisations } = this.state;
        const form_confirmAlert = this.form_confirmAlert;
        if (column.path === "#") return localisations.indexOf(localisation) + 1;// kolumna dla lp.
        else if (column.path === "name") return localisation.name// kolumna zaznaczania czy lokalizacja widzi wszystko
        else if (column.path === "category") return this.renderInputCustomSelect(localisation)// kolumna zaznaczania czy lokalizacja widzi wszystko
        else if (column.path === "btn-delete") return this.renderConfirmAlert(localisation, form_confirmAlert) // kolumna dla przycisku
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

    renderHeader(columns, mainDivCSS, contentCSS) {  // podobne
        return (
            <div className={mainDivCSS}>
                {columns.map(column => <div key={column.path} className={contentCSS}>{column.label}</div>)}
            </div>
        )
    }

    renderLocalisations(localisations, mainDivCSS, itemCSS, contentCSS) {  // podobne
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