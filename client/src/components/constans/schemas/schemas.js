import Joi from 'joi-browser';
import currencyEnums from "../../../enums/currency.json";

export default {
    getUserSchema: () => ({
        name: Joi.string().min(5).required().error(() => { return { message: "Podana nazwa jest za krótka. Minimum to 5 znaków." }; })
    }),
    getLocalisationSchema: () => ({
        name: Joi.string().min(1).max(255).required().error(() => { return { message: "Podana nazwa jest za krótka. Minimum to 1 znak." }; }),
    }),
    getUserPageSchema: () => {
        const errorMessage = {
            password: "Podane hasło jest za krótkie. Minimum to 5 znaków",
            newPin: "Niepoprawna długość PIN. ILość znaków musi wynosić 4"
        }

        return {
            schemaPassword: {
                password: Joi.string().min(5).required().error(() => { return { message: errorMessage.password }; }),
                newPassword: Joi.string().min(5).required().error(() => { return { message: errorMessage.password }; })
            },
            schemaPIN: {
                password: Joi.string().min(5).required().error(() => { return { message: errorMessage.password }; }),
                newPIN: Joi.string().min(4).max(4).required().error(() => { return { message: errorMessage.newPin }; })
            }
        }
    },
    getLoginPageSchema: () => ({
        name: Joi.string().min(1).required().error(() => { return { message: "Za krótki login." }; }),
        password: Joi.string().min(5).required().error(() => { return { message: "Za krótkie hasło." }; })
    }),
    getFormInputFinishGoodSchema: () => {
        const errorMessages = {
            name: 'Nazwa nie może być pusta i może mieć maks. 30 znaków',
            description: 'Opis nie może być pusty i może mieć maks. 100 znaków',
            qty: 'Pole "Ilość" nie może być puste a wartość być liczbą z zakresu 1 - 9999'
          }

        return {
            name: Joi.string().max(30).required().error(() => { return { message: errorMessages["name"] }; }),
            description: Joi.string().max(100).required().error(() => { return { message: errorMessages["description"] }; }),
            qty: Joi.number().min(1).max(99999).required().error(() => { return { message: errorMessages["qty"] }; }),
            rawMaterialPrice_value: Joi.string().allow(''),
            rawMaterialPrice_currency: Joi.string().valid(...Object.values(currencyEnums)),
            createdBy: Joi.string().required(),
            isReserved: Joi.boolean(),
            isClosed: Joi.boolean(),
            reservedBy: Joi.string().allow(''),
            closedBy: Joi.string().allow('')
        }
    },
    getFormInputTaskSchema: () => {
        const errorMessages = {
            content: 'Treść zdarzenia nie może być pusta i może mieć maks. 40 znaków',
            qty: 'Pole "Ilość" nie może być puste a wartość być liczbą z zakresu 1 - 9999',
            location: "Proszę podać lokalizację",
            idCode: "Nieprawidłowy kod ID",
            pin: "Nieprawidłowy PIN"
          }

          const standardSchema = {
            content: Joi.string().max(40).required().error(() => { return { message: errorMessages["content"] }; }),
            type: Joi.string().required(),
            createdBy: Joi.string(),
            location: Joi.string().required().error(() => { return { message: errorMessages["location"] }; }),
            qty: Joi.number().min(1).max(99999).required().error(() => { return { message: errorMessages["qty"] }; })
        };

        return {
            standard: standardSchema,
            expanded: {
                ...standardSchema,
                idCode: Joi.string().min(3).max(3).required().error(() => { return { message: errorMessages["idCode"] }; }),
                pin: Joi.string().min(4).max(4).required().error(() => { return { message: errorMessages["pin"] }; })
            }
        }
    },
    getFormPartialDeliverySchema: () => ({
            partialQty: Joi.number().min(1).max(99999).required().error(() => {return { message: "Podana ilość musi być określona jako liczba i mieścić się w zakresie 1-9999." }})
    }),
}
