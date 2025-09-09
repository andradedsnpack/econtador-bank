const { accounts, banks } = require('../database/memoryDB');
const { v4: uuidv4 } = require('uuid');

class Account {
  static findByUserId(userId) {
    return accounts.filter(account => account.userId === userId);
  }

  static findById(id) {
    return accounts.find(account => account.id === id);
  }

  static findByAccountAndAgency(accountNumber, agency) {
    return accounts.find(account => 
      account.accountNumber === accountNumber && account.agency === agency
    );
  }

  static create(accountData) {
    const account = {
      id: uuidv4(),
      ...accountData,
      createdAt: new Date()
    };
    accounts.push(account);
    return account;
  }

  static update(id, updateData) {
    const index = accounts.findIndex(account => account.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updateData };
      return accounts[index];
    }
    return null;
  }

  static delete(id) {
    const index = accounts.findIndex(account => account.id === id);
    if (index !== -1) {
      return accounts.splice(index, 1)[0];
    }
    return null;
  }

  static getBanks() {
    return banks;
  }
}

module.exports = Account;