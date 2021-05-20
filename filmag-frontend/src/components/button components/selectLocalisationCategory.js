// import React from 'react';
import React from 'react';
import InputCustomSelect from '../input forms/inputCustomSelect';
import { toast } from 'react-toastify';
import localisationService from '../../services/localisationService';

const SelectLocalisationCategory = ({localisation}) => {

    async function handleInputOnChange({ currentTarget: input }, localisation){
        try {
            localisation.category = input.value;
            
            await localisationService.updateLocalisation(localisation);
        }
        catch (ex) {
            if (ex && ex.response) {
                toast.error(ex.response.data)
            }
        }
    };

    const options = ["", ...localisationService.getLocalisationNames()];
    
    return (
        <InputCustomSelect
            item={localisation._id}
            currentValue={localisation.category}
            options={options}
            onChange={ (event) => handleInputOnChange(event, localisation)}
        />
    );
}
 
export default SelectLocalisationCategory;