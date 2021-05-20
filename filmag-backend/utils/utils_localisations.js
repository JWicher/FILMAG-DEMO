async function getUserLocalisations(user) {
    const allLocalisations = await Localisation.find().sort({ number: 1, category: 1 });
    const userLocalisations = allLocalisations.filter(l => user.permissions.indexOf(l.category) >= 0)
    return userLocalisations;
};

module.exports = {
    getUserLocalisations
};
