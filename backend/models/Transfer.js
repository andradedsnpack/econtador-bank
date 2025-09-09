const { transfers } = require('../database/memoryDB');
const { v4: uuidv4 } = require('uuid');

class Transfer {
  static findByAccountId(accountId) {
    return transfers.filter(transfer => 
      transfer.fromAccountId === accountId || transfer.toAccountId === accountId
    );
  }

  static create(transferData) {
    const transfer = {
      id: uuidv4(),
      ...transferData,
      createdAt: new Date()
    };
    transfers.push(transfer);
    return transfer;
  }

  static findByUserId(userId, accounts) {
    const userAccountIds = accounts.map(acc => acc.id);
    return transfers.filter(transfer => 
      userAccountIds.includes(transfer.fromAccountId) || 
      userAccountIds.includes(transfer.toAccountId)
    );
  }
}

module.exports = Transfer;