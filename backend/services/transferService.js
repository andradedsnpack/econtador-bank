const Account = require('../models/Account');
const Transfer = require('../models/Transfer');

class TransferService {
  static async createTransfer(userId, transferData) {
    const { fromAccountId, toAccountNumber, toAgency, amount, description } = transferData;
    const transferAmount = parseFloat(amount);
    
    if (transferAmount > 5000) {
      throw new Error('Valor máximo para transferência é R$ 5.000,00');
    }

    const fromAccount = Account.findById(fromAccountId);
    if (!fromAccount || fromAccount.userId !== userId) {
      throw new Error('Conta de origem não encontrada');
    }

    if (fromAccount.balance < transferAmount) {
      throw new Error('Saldo insuficiente');
    }

    const toAccount = Account.findByAccountAndAgency(toAccountNumber, toAgency);
    if (!toAccount) {
      throw new Error('Conta de destino não encontrada');
    }

    if (fromAccountId === toAccount.id) {
      throw new Error('Não é possível transferir para a mesma conta');
    }

    Account.update(fromAccountId, { balance: parseFloat(fromAccount.balance) - transferAmount });
    Account.update(toAccount.id, { balance: parseFloat(toAccount.balance) + transferAmount });
    
    // Atualizar os objetos locais para o recibo
    fromAccount.balance -= transferAmount;
    toAccount.balance += transferAmount;

    const transfer = Transfer.create({
      fromAccountId,
      toAccountId: toAccount.id,
      amount: transferAmount,
      description: description || 'Transferência'
    });

    return {
      transfer,
      fromAccount,
      toAccount,
      receipt: this.generateReceipt(transfer, fromAccount, toAccount)
    };
  }

  static async getUserTransfers(userId) {
    const userAccounts = Account.findByUserId(userId);
    return Transfer.findByUserId(userId, userAccounts);
  }

  static generateReceipt(transfer, fromAccount, toAccount) {
    const fromBank = Account.getBanks().find(b => b.id === fromAccount.bank);
    const toBank = Account.getBanks().find(b => b.id === toAccount.bank);
    
    return {
      id: transfer.id,
      fromAccount: `${fromAccount.accountNumber} - ${fromAccount.agency}`,
      toAccount: `${toAccount.accountNumber} - ${toAccount.agency}`,
      fromBank: fromBank?.name || fromAccount.bank,
      toBank: toBank?.name || toAccount.bank,
      amount: transfer.amount,
      date: transfer.createdAt,
      description: transfer.description
    };
  }
}

module.exports = TransferService;