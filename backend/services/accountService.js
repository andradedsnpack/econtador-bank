const bcrypt = require('bcryptjs');
const Account = require('../models/Account');

class AccountService {
  static async getUserAccounts(userId) {
    return Account.findByUserId(userId);
  }

  static async createAccount(userId, accountData) {
    const { accountNumber, agency, bank, password, balance } = accountData;
    
    const existingAccount = Account.findByAccountAndAgency(accountNumber, agency);
    if (existingAccount && existingAccount.userId === userId) {
      throw new Error('Você já possui uma conta com estes dados');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    return Account.create({
      userId,
      accountNumber,
      agency,
      bank,
      password: hashedPassword,
      balance: balance || 0
    });
  }

  static async updateAccount(accountId, userId, updateData) {
    const account = Account.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Conta não encontrada');
    }

    const { accountNumber, agency, bank, password } = updateData;
    const updatedData = { accountNumber, agency, bank };
    
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    return Account.update(accountId, updatedData);
  }

  static async deleteAccount(accountId, userId) {
    const account = Account.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new Error('Conta não encontrada');
    }

    return Account.delete(accountId);
  }

  static getBanks() {
    return Account.getBanks();
  }
}

module.exports = AccountService;