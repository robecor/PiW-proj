const User = require("./userClass.js");
const users = [];

const connectionMethods = {
  addUser(ws) {
    const newUser = new User(ws);
    users.push(newUser);

    return newUser._id;
  },

  removeUser(_id) {
    const index = users.findIndex(user => user._id === _id);

    if (index >= 0) {
      users.splice(index, 1);
    }
  },

  getUser(_id) {
    return users.find(user => user._id === _id)
  },

  setUserName(name) {
    const user = users.find(user => user._id === _id);

    if (user) {
      user.setName(name);
    }
  }
};

module.exports = connectionMethods;