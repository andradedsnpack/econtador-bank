const { users } = require('../database/memoryDB');
const { v4: uuidv4 } = require('uuid');

class User {
  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static create(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      createdAt: new Date()
    };
    users.push(user);
    return user;
  }
}

module.exports = User;