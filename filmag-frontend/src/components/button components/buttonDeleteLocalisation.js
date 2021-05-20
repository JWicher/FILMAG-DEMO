import React from 'react';
import ConfirmAlert from '../input forms/confirmAlert';
import { toast } from 'react-toastify';
import localisationService from '../../services/localisationService';

const ButtonDeleteLocalisation = ({localisation}) => {

    async function handleDeleteLocalisation(localisationToDelete){
        try {
            await localisationService.deleteLocalisation(localisationToDelete);
        }
        catch (ex) {
            if (ex && ex.response) toast.error(ex.response.data)
        }
    };

    const form_deleteLocalisation = {
        title: 'Potwierdź usunięcie lokalizacji',
        btn_label: (
            <p>
                <span className="localisation__content_btn-label_full">Usuń lokalizację</span>
                <span className="localisation__content_btn-label_short">X</span>
            </p>
        ),
        btn_css: "btn-danger btn-sm",
        action: (localisation) => handleDeleteLocalisation(localisation)
    }



    return (
            <ConfirmAlert
                item={localisation}
                itemRepresentation={localisation.name}
                form={form_deleteLocalisation}
            />
        );
}
 
export default ButtonDeleteLocalisation;