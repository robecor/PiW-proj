const randomId = require('random-id');

class User {
  constructor(ws) {
    this._id = randomId(30, "aA0");
    this.ws = ws;
  }

  addName(name) {
    this.name = name;
  }
}

module.exports = User;