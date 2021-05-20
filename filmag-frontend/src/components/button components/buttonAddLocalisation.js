import React from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import ConfirmAlertSettings from '../input forms/confirmAlertSettings';
import localisationService from '../../services/localisationService';
import schemas from "../constans/schemas/schemas";

const ButtonAddLocalisation = () => {

    async function handleAddLocalisation(localisation){
        try {
            const schema = schemas.getLocalisationSchema();
    
            const { error } = Joi.validate(localisation, schema);
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

    const form_addLocalisation = {
        title: "Dodaj nową lokalizację",
        p_label: "Nazwa",
        placeholder_1: "Podaj nazwę lokalizacji",
        btn_label: "Dodaj nową lokalizację",
        btn_css: "btn btn-success btn-sm",
        action: (localisation) => handleAddLocalisation(localisation)
    }

    return <ConfirmAlertSettings form={form_addLocalisation} />;
}
 
export default ButtonAddLocalisation;