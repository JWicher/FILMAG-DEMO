import Joi from 'joi-browser';

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
    
}
