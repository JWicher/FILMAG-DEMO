async function changeIsLogged_to_true(user) {
    user.isLogged = true;
    await user.save();
    return user;
}

function getCurrentTime() {
    return new Date().getTime();
}
function getFormatedTime() {
    const timeOnServer_GMT0 = new Date().getTime();
    const timeOffset_Poland = -120;
    const localTimeInPoland = timeOnServer_GMT0 - timeOffset_Poland * 60 * 1000; // local Time in Poland
    const date = new Date(localTimeInPoland).toISOString();
    const day = date.slice(0, 10);
    const time = date.slice(11, 19);
    return day + " | " + time;
}

module.exports = {
    changeIsLogged_to_true,
    getCurrentTime,
    getFormatedTime
};
