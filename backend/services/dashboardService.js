const Account = require('../models/Account');
const Transfer = require('../models/Transfer');

class DashboardService {
  static async getDashboardData(userId) {
    const userAccounts = Account.findByUserId(userId);
    const userTransfers = Transfer.findByUserId(userId, userAccounts);
    
    const totalBalance = userAccounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTransfers = userTransfers.filter(t => t.createdAt >= thirtyDaysAgo);
    
    const userAccountIds = userAccounts.map(acc => acc.id);
    const income = recentTransfers
      .filter(t => userAccountIds.includes(t.toAccountId))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = recentTransfers
      .filter(t => userAccountIds.includes(t.fromAccountId))
      .reduce((sum, t) => sum + t.amount, 0);

    const sixMonthsData = this.getSixMonthsData(userTransfers, userAccountIds);

    return {
      totalBalance,
      income,
      expenses,
      accountsCount: userAccounts.length,
      transfersCount: userTransfers.length,
      chartData: sixMonthsData
    };
  }

  static getSixMonthsData(transfers, userAccountIds) {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthTransfers = transfers.filter(t => 
        t.createdAt >= monthStart && t.createdAt <= monthEnd
      );
      
      const income = monthTransfers
        .filter(t => userAccountIds.includes(t.toAccountId))
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransfers
        .filter(t => userAccountIds.includes(t.fromAccountId))
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        income,
        expenses
      });
    }
    
    return months;
  }
}

module.exports = DashboardService;