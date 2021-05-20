const { expect } = require("chai");
const { utils_loginAtempts_testMode: utils_loginAtempts } = require('../../utils/utils_loginAtempts');

const reqBody_1 = { name: "Jan Kowalski" }; // <= req.body.name; raw shape what get inside the module
const reqBody_2 = { name: "Bogdan Boner" }; // <= req.body.name; raw shape what get inside the module
const reqBody_3 = { name: "Agnieszka Nowak" }; // <= req.body.name; raw shape what get inside the module
const reqBody_4 = { name: "Jadwiga Paciaciak" }; // <= req.body.name; raw shape what get inside the module

const userJK_formated = {  // shape like in the array of atempts
    login: reqBody_1.name,
    atempts: 3,
    lastAtemptTime: new Date().getTime(),
    penaltyTimeStart: new Date().getTime() // not expired penalty time is < than one minute
};
const userBB_formated = {
    login: reqBody_2.name,
    atempts: 1,
    lastAtemptTime: new Date().getTime() - 60001 // expired atempt time is > than 60 * 1000 (one minute)
    // not have penalty time
};
const userAN_formated = {
    login: reqBody_3.name,
    atempts: 3,
    lastAtemptTime: new Date().getTime(),
    penaltyTimeStart: new Date().getTime() - 60001 // expired penalty time is > than 60 * 1000 (one minute)
};

function getArrayForTest() {
    return [
        { ...userJK_formated },
        { ...userBB_formated },
        { ...userAN_formated },
        // not included user from reqBody_4
    ];

}

describe('Testing utils - loginAtempts', () => {

    it('Insert current user to array of "atemptedLogins"', () => {
        const arrayForTests = getArrayForTest();
        utils_loginAtempts.insertLoginToPenaltyBox(reqBody_1.name, arrayForTests)
        utils_loginAtempts.insertLoginToPenaltyBox(reqBody_4.name, arrayForTests)

        expect(arrayForTests).to.have.length(4)
        expect(arrayForTests).to.deep.include({ login: reqBody_4.name, atempts: 0 })

    })

    it('Geting index of current user in the array from array "atemptedLogins"', () => {
        const arrayForTests = getArrayForTest();
        const result_1 = utils_loginAtempts.findUserIndexByLogin(reqBody_1.name, arrayForTests);
        const result_2 = utils_loginAtempts.findUserIndexByLogin(reqBody_2.name, arrayForTests);
        const result_3 = utils_loginAtempts.findUserIndexByLogin(reqBody_3.name, arrayForTests);
        const result_4 = utils_loginAtempts.findUserIndexByLogin(reqBody_4.name, arrayForTests);

        expect(result_1).to.equals(0)
        expect(result_2).to.equals(1)
        expect(result_3).to.equals(2)
        expect(result_4).to.equals(-1)
    })
    it('Reset current users number of atempts to 0 in the array "atemptedLogins"', () => {
        const arrayForTests = getArrayForTest();
        utils_loginAtempts.resetLoginAtemptsToZero(reqBody_1.name, arrayForTests)

        expect(arrayForTests).to.have.nested.property('[0].atempts').that.equals(0)
    })
    it('Remove current user from the array "atemptedLogins"', () => {
        const arrayForTests = getArrayForTest();
        utils_loginAtempts.removeLoginFromAtemptedLogins(reqBody_1.name, arrayForTests)

        expect(arrayForTests).to.not.deep.include(userJK_formated)
        expect(arrayForTests).to.deep.include(userBB_formated)
        expect(arrayForTests).to.deep.include(userAN_formated)
    })
    it('Increase atempts of current user', () => {
        const arrayForTests = getArrayForTest();
        utils_loginAtempts.inrcreaseLoginAtempts(reqBody_2.name, arrayForTests)

        expect(arrayForTests).to.deep.include({ ...userBB_formated, atempts: userBB_formated.atempts + 1 })
    })
    it('Update time of last atempt of current user', () => {
        const arrayForTests = getArrayForTest();
        const currentRequest = { ...reqBody_1 };
        const currentUser = getArrayForTest().filter(user => user.login === currentRequest.name)[0];
        const indexOfCurrentUser = utils_loginAtempts.findUserIndexByLogin(currentRequest.name, arrayForTests)

        utils_loginAtempts.updateLastAtemptTime(currentRequest.name, arrayForTests)

        expect(arrayForTests)
            .to.has.nested.property(`[${indexOfCurrentUser}].lastAtemptTime`)
            .that.is.greaterThan(currentUser.lastAtemptTime)
    })
    it('Check if user has a penalty time', () => {
        const arrayForTests = getArrayForTest();
        const result_1 = utils_loginAtempts.hasPenaltyTime(reqBody_1.name, arrayForTests)
        const result_2 = utils_loginAtempts.hasPenaltyTime(reqBody_2.name, arrayForTests)
        const result_3 = utils_loginAtempts.hasPenaltyTime(reqBody_3.name, arrayForTests)
        const result_4 = utils_loginAtempts.hasPenaltyTime(reqBody_4.name, arrayForTests)

        expect(result_1).to.true;
        expect(result_2).to.false;
        expect(result_3).to.true;
        expect(result_4).to.false;
    })
    it('Check if user penalty time has ended', () => {
        const arrayForTests = getArrayForTest();
        const result_1 = utils_loginAtempts.hasPenaltyTimeEnded(reqBody_1.name, arrayForTests)
        const result_2 = utils_loginAtempts.hasPenaltyTimeEnded(reqBody_2.name, arrayForTests)
        const result_3 = utils_loginAtempts.hasPenaltyTimeEnded(reqBody_3.name, arrayForTests)
        const result_4 = utils_loginAtempts.hasPenaltyTimeEnded(reqBody_4.name, arrayForTests)

        expect(result_1).to.be.false;
        expect(result_2).to.be.true;
        expect(result_3).to.be.true;
        expect(result_3).to.be.true;
    })

    it('Check if user exceeded atemps llimit', () => {
        const arrayForTests = getArrayForTest();
        const result_1 = utils_loginAtempts.hasExceededAtemptsLimit(reqBody_1.name, arrayForTests)
        const result_2 = utils_loginAtempts.hasExceededAtemptsLimit(reqBody_2.name, arrayForTests)
        const result_3 = utils_loginAtempts.hasExceededAtemptsLimit(reqBody_3.name, arrayForTests)
        const result_4 = utils_loginAtempts.hasExceededAtemptsLimit(reqBody_4.name, arrayForTests)

        expect(result_1).to.be.true;
        expect(result_2).to.be.false;
        expect(result_3).to.be.true;
        expect(result_4).to.be.false;
    })


    it('Check if last atempt was to long ago', () => {
        const arrayForTests = getArrayForTest();
        const result_1 = utils_loginAtempts.hasLastAtemptTimeExceeded(reqBody_1.name, arrayForTests)
        const result_2 = utils_loginAtempts.hasLastAtemptTimeExceeded(reqBody_2.name, arrayForTests)
        const result_3 = utils_loginAtempts.hasLastAtemptTimeExceeded(reqBody_3.name, arrayForTests)
        const result_4 = utils_loginAtempts.hasLastAtemptTimeExceeded(reqBody_4.name, arrayForTests)

        expect(result_1).to.be.false;
        expect(result_2).to.be.true;
        expect(result_3).to.be.false;
        expect(result_4).to.be.true;
    })
    it('Main test - does user can stil atempt to login', () => {
        const arrayForTests = getArrayForTest();

        const canStillAtemptToLogin_1 = utils_loginAtempts.checkUserLoginAtempts(reqBody_1.name, arrayForTests);
        const canStillAtemptToLogin_2 = utils_loginAtempts.checkUserLoginAtempts(reqBody_2.name, arrayForTests);
        const canStillAtemptToLogin_3 = utils_loginAtempts.checkUserLoginAtempts(reqBody_3.name, arrayForTests);
        const canStillAtemptToLogin_4 = utils_loginAtempts.checkUserLoginAtempts(reqBody_4.name, arrayForTests);

        expect(canStillAtemptToLogin_1).to.be.false;
        expect(canStillAtemptToLogin_2).to.be.true;
        expect(canStillAtemptToLogin_3).to.be.true;
        expect(canStillAtemptToLogin_4).to.be.true;
    })

})
