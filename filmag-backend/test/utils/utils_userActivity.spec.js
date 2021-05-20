const { expect } = require("chai");
const utils_userActivity = require('../../utils/utils_userActivity');

const userJanKowalski = { _id: 1, name: "Jan Kowalski", lastActivity: 1000167214911 };
const userBogdanBoner = { _id: 2, name: "Bogdan Boner", lastActivity: 1000167214938 };

describe('Testing utils - userActivity', () => {

    it('Users activity data should be stored in an array', () => {
        const activeUsers = utils_userActivity.getActiveUser();
        expect(activeUsers).to.be.an('array')
    })

    it('Insert user to array of active users', () => {
        const result = utils_userActivity.insertActiveUser(userJanKowalski, []);
        expect(result)
            .to.have.nested.property('[0]._id')
            .that.equals(userJanKowalski._id)

    })
    it('Remove target user but not remove other users', () => {
        const result = utils_userActivity.removeUserFromActiveUsers(userJanKowalski, [{ ...userJanKowalski }, { ...userBogdanBoner }]);
        expect(result).to.deep.include(userBogdanBoner)
    })

    it('Update user lastActivity property', () => {
        const result = utils_userActivity.updateUserFromActiveUsers(userJanKowalski, [{ ...userJanKowalski }, { ...userBogdanBoner }]);
        expect(result)
            .to.have.nested.property('[0].lastActivity')
            .that.not.equals(userJanKowalski.lastActivity)
    })

})
