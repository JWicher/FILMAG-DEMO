const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const localisation_order = {
    "Magazyn": 1,
    "Maszyna": 100,
    "Utrzymanie ruchu": 1000
};

const localisationShcema = new mongoose.Schema({
    name: { type: String, required: true },
    order_number: { type: Number },
    path: { type: String },
    category: { type: String, default: "" }
});

const Localisation = mongoose.model('Localisation', localisationShcema);

function createNewLocalisation({ name }) {

    return new Localisation({
        name,
    });
}

async function updateSortOrder(lokalisationCategory) {
    const allLocalisationsWithThisCategory = await Localisation.find({ category: lokalisationCategory }).sort({ order_number: 1 });
    allLocalisationsWithThisCategory.forEach((item, index) => item.order_number = localisation_order[lokalisationCategory] + index);
    allLocalisationsWithThisCategory.forEach(async item => await Localisation.findByIdAndUpdate(item.id, item, { new: false }))
}

async function get_latest_ordrer_number_of_category(lokalisationCategory) {
    const allLocalisationsWithThisCategory = await Localisation.find({ category: lokalisationCategory }).sort({ order_number: 1 });
    const length = allLocalisationsWithThisCategory.length;
    const lastElement = allLocalisationsWithThisCategory[length - 1];
    return lastElement ? lastElement.order_number : 0;
}


function validateLocalisation(reqBody) {
    const schema = {
        name: Joi.string().required()
    };
    return Joi.validate(reqBody, schema);
};

module.exports = {
    model: Localisation,
    methods: {
        validate: validateLocalisation,
        createNewLocalisation,
        updateSortOrder,
        get_latest_ordrer_number_of_category
    }
};
