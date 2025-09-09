const TransferService = require('../services/transferService');

class TransferController {
  static async createTransfer(req, res) {
    try {
      const result = await TransferService.createTransfer(req.user.userId, req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTransfers(req, res) {
    try {
      const transfers = await TransferService.getUserTransfers(req.user.userId);
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = TransferController;