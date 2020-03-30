let atemptedLogins = []; // [ {login: string <= req.body.name, atempts: number, lastAtemptTime: Date} ]
const penaltyTimeLimit = 1 * 60 * 1000; // 1 minute

function checkUserLoginAtempts(login, array = atemptedLogins) { // login: string <= req.body.name
    let userIsInTheArray = findUserIndexByLogin(login, array) >= 0;
    if (!userIsInTheArray) insertLoginToPenaltyBox(login, array)
    inrcreaseLoginAtempts(login, array);

    if (hasLastAtemptTimeExceeded(login, array)) resetLoginAtemptsToZero(login, array)
    updateLastAtemptTime(login, array)

    if (hasExceededAtemptsLimit(login, array)) {
        if (!hasPenaltyTime(login, array)) setPenaltyTime(login, array)
        if (hasPenaltyTimeEnded(login, array)) {
            removeLoginFromAtemptedLogins(login, array)
            return true
        }
    }
    else {
        return true
    }
    return false
}

function findUserIndexByLogin(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = array.findIndex(user => user.login === login)
    return index
}

function insertLoginToPenaltyBox(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index < 0) {
        array.push({ login, atempts: 0 })
    }
}

function resetLoginAtemptsToZero(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = array.findIndex(user => user.login === login);
    if (index >= 0) {
        array[index].atempts = 0;
    }
}


function removeLoginFromAtemptedLogins(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index >= 0) {
        array.splice(index, 1);
    }
}

function inrcreaseLoginAtempts(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index >= 0) {
        const loginObject = array[index];
        loginObject.atempts++
        array[index] = loginObject;
    }
}

function updateLastAtemptTime(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index >= 0) {
        const user = array[index];
        user.lastAtemptTime = new Date().getTime();
        array[index] = user;
    }
}
function setPenaltyTime(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index >= 0) {
        const loginObject = array[index];
        loginObject.penaltyTimeStart = new Date().getTime();
        array[index] = loginObject;
    }
}


function hasPenaltyTimeEnded(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index < 0) return

    const user = array[index];
    const userPenaltyTimeStart = user && user.penaltyTimeStart ? user.penaltyTimeStart : 0;
    const now = new Date().getTime();
    const durationOfUserPenaltyTime = now - userPenaltyTimeStart;

    if (durationOfUserPenaltyTime > penaltyTimeLimit) {
        return true
    }

    return false
}

function hasExceededAtemptsLimit(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    return array[index] ? array[index].atempts >= 3 : false
}

function hasPenaltyTime(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index < 0) return false
    return array[index].penaltyTimeStart ? true : false
}

function hasLastAtemptTimeExceeded(login, array = atemptedLogins) { // login: string <= req.body.name; array: [{login: string, atempts: number}]
    const index = findUserIndexByLogin(login, array)
    if (index < 0) return true

    const now = new Date().getTime();
    const lastAtemptTime = array[index].lastAtemptTime ? array[index].lastAtemptTime : 0;
    const timeAfterLastAtempt = now - lastAtemptTime;

    if (timeAfterLastAtempt > penaltyTimeLimit) {
        return true;
    }
    else {
        return false
    }
}

module.exports = {
    checkUserLoginAtempts,
    removeLoginFromAtemptedLogins,
}

module.exports.utils_loginAtempts_testMode = {
    checkUserLoginAtempts,
    removeLoginFromAtemptedLogins,

    findUserIndexByLogin,
    insertLoginToPenaltyBox,
    removeLoginFromAtemptedLogins,
    inrcreaseLoginAtempts,
    updateLastAtemptTime,
    setPenaltyTime,
    hasPenaltyTimeEnded,
    hasExceededAtemptsLimit,
    hasPenaltyTime,
    hasLastAtemptTimeExceeded,
    resetLoginAtemptsToZero
}