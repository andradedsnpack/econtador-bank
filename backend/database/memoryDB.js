const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const users = [
  {
    id: uuidv4(),
    name: 'João Silva',
    email: 'joao@email.com',
    password: bcrypt.hashSync('123456', 10),
    createdAt: new Date()
  }
];

const accounts = [
  {
    id: uuidv4(),
    userId: users[0].id,
    accountNumber: '12345-6',
    agency: '0001',
    bank: 'bradesco',
    password: bcrypt.hashSync('1234', 10),
    balance: 5000.00,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    userId: users[0].id,
    accountNumber: '78901-2',
    agency: '0001',
    bank: 'itau',
    password: bcrypt.hashSync('5678', 10),
    balance: 3000.00,
    createdAt: new Date()
  }
];

const transfers = [
  {
    id: uuidv4(),
    fromAccountId: accounts[0].id,
    toAccountId: accounts[1].id,
    amount: 500.00,
    description: 'Transferência inicial',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

const banks = [
  { id: 'bradesco', name: 'Bradesco' },
  { id: 'itau', name: 'Itaú' },
  { id: 'nubank', name: 'Nubank' },
  { id: 'inter', name: 'Inter' },
  { id: 'banco_do_brasil', name: 'Banco do Brasil' }
];

module.exports = {
  users,
  accounts,
  transfers,
  banks
};