let activeUsers = [];

function insertActiveUser(user, arrayActiveUsers = activeUsers) {
    arrayActiveUsers.push({ _id: user._id, name: user.name, lastActivity: new Date().getTime() })
    return arrayActiveUsers
}
function getActiveUser() {
    return activeUsers;
}
function removeUserFromActiveUsers(user, arrayActiveUsers = activeUsers) {
    const index = arrayActiveUsers.findIndex(u => u.name === user.name)

    if (index >= 0) arrayActiveUsers.splice(index, 1);

    return arrayActiveUsers;
}
function updateUserFromActiveUsers(user, arrayActiveUsers = activeUsers) {
    const index = arrayActiveUsers.findIndex(u => u.name === user.name)

    if (index >= 0) {
        const thisUser = arrayActiveUsers[index];
        arrayActiveUsers[index] = { ...thisUser, lastActivity: new Date().getTime() }
    }
    return arrayActiveUsers
}

module.exports = {
    getActiveUser,
    insertActiveUser,
    updateUserFromActiveUsers,
    removeUserFromActiveUsers,
}

