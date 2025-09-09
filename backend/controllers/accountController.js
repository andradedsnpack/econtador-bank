const AccountService = require('../services/accountService');

class AccountController {
  static async getAccounts(req, res) {
    try {
      const accounts = await AccountService.getUserAccounts(req.user.userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async createAccount(req, res) {
    try {
      const account = await AccountService.createAccount(req.user.userId, req.body);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateAccount(req, res) {
    try {
      const account = await AccountService.updateAccount(req.params.id, req.user.userId, req.body);
      res.json(account);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteAccount(req, res) {
    try {
      await AccountService.deleteAccount(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static getBanks(req, res) {
    const banks = AccountService.getBanks();
    res.json(banks);
  }
}

module.exports = AccountController;