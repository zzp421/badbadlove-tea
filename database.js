let users = [];

function findUserByUsername(username) {
    return users.find(user => user.username === username);
}

function saveUser(user) {
    users.push(user);
}

function getUsers() {
    return users;
}

module.exports = {
    findUserByUsername,
    saveUser,
    getUsers
};