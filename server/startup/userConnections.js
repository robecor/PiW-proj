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

  setUserName(userId, name) {
    const user = users.find(user => user._id === userId);

    if (user) {
      user.setName(name);
    }
  },

  getUsers() {
    return users;
  },

  getUserWithName(userId) {
    const resultUser = users.find(user => user._id === userId);

    if (resultUser) {
      return {
        _id: resultUser._id,
        name: resultUser.name,
      };
    } else {
      return null;
    }
  },

  getConnectedUsersWithName() {
    const usersWithName = users.filter((user) => {
      return user.name;
    });

    return usersWithName.map((user) => {
      return {
        _id: user._id,
        name: user.name
      };
    });
  },

  sendMessageToUser(userId, message) {
    const user = users.find(user => user._id === userId);

    if (user) {
      user.ws.send(message);
    }
  },

  sendMessageToAllUsers(userId, message) {
    let toSendUsers = users;

    if (userId) {
      toSendUsers = toSendUsers.filter(user => user._id !== userId);
    }

    toSendUsers.forEach((user) => {
      user.ws.send(message);
    });
  }
};

module.exports = connectionMethods;