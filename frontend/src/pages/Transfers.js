import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { transferAPI, accountAPI } from '../services/api';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({
    fromAccountId: '',
    toAccountNumber: '',
    toAgency: '',
    amount: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTransfers();
    loadAccounts();
    loadBanks();
  }, []);

  const loadTransfers = async () => {
    try {
      const response = await transferAPI.getTransfers();
      setTransfers(response.data);
    } catch (error) {
      console.error('Erro ao carregar transferências:', error);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await accountAPI.getAccounts();
      setAccounts(response.data);
    } catch (error) {
      console.error('Erro ao carregar contas:', error);
    }
  };

  const loadBanks = async () => {
    try {
      const response = await accountAPI.getBanks();
      setBanks(response.data);
    } catch (error) {
      console.error('Erro ao carregar bancos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await transferAPI.createTransfer(formData);
      setReceipt(response.data.receipt);
      await loadTransfers();
      setFormData({
        fromAccountId: '',
        toAccountNumber: '',
        toAgency: '',
        amount: '',
        description: ''
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao realizar transferência');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
COMPROVANTE DE TRANSFERÊNCIA
============================

Conta Origem: ${receipt.fromAccount}
Banco Origem: ${receipt.fromBank}

Conta Destino: ${receipt.toAccount}
Banco Destino: ${receipt.toBank}

Valor: ${formatCurrency(receipt.amount)}
Data: ${new Date(receipt.date).toLocaleString('pt-BR')}
Descrição: ${receipt.description}

============================
eContador Bank
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprovante-${receipt.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareReceipt = () => {
    const subject = 'Comprovante de Transferência - eContador Bank';
    const body = `
Comprovante de Transferência

Conta Origem: ${receipt.fromAccount}
Banco Origem: ${receipt.fromBank}
Conta Destino: ${receipt.toAccount}
Banco Destino: ${receipt.toBank}
Valor: ${formatCurrency(receipt.amount)}
Data: ${new Date(receipt.date).toLocaleString('pt-BR')}
Descrição: ${receipt.description}

eContador Bank
    `;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  const getAccountDisplay = (account) => {
    const bank = banks.find(b => b.id === account.bank);
    return `${account.accountNumber} - ${account.agency} (${bank?.name || account.bank})`;
  };

  return (
    <div>
      <h2>Transferências</h2>
      <br />

      <div className="transfer-form">
        <h3>Nova Transferência</h3>
        <br />
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Conta de origem</label>
            <select
              name="fromAccountId"
              value={formData.fromAccountId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma conta</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {getAccountDisplay(account)} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Conta de destino</label>
            <input
              type="text"
              name="toAccountNumber"
              value={formData.toAccountNumber}
              onChange={handleChange}
              placeholder="Número da conta"
              required
            />
          </div>

          <div className="form-group">
            <label>Agência de destino</label>
            <input
              type="text"
              name="toAgency"
              value={formData.toAgency}
              onChange={handleChange}
              placeholder="Agência"
              required
            />
          </div>

          <div className="form-group">
            <label>Valor</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              max="5000"
              required
            />
            <small>Valor máximo: R$ 5.000,00</small>
          </div>

          <div className="form-group">
            <label>Descrição (opcional)</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição da transferência"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Transferindo...' : 'Transferir'}
          </button>
        </form>
      </div>

      {receipt && (
        <div className="receipt">
          <div className="receipt-header">
            <h3>Comprovante de Transferência</h3>
            <p>Transferência realizada com sucesso!</p>
          </div>
          
          <div className="receipt-details">
            <div className="receipt-row">
              <span>Conta Origem:</span>
              <span>{receipt.fromAccount}</span>
            </div>
            <div className="receipt-row">
              <span>Banco Origem:</span>
              <span>{receipt.fromBank}</span>
            </div>
            <div className="receipt-row">
              <span>Conta Destino:</span>
              <span>{receipt.toAccount}</span>
            </div>
            <div className="receipt-row">
              <span>Banco Destino:</span>
              <span>{receipt.toBank}</span>
            </div>
            <div className="receipt-row">
              <span>Valor:</span>
              <span><strong>{formatCurrency(receipt.amount)}</strong></span>
            </div>
            <div className="receipt-row">
              <span>Data:</span>
              <span>{formatDate(receipt.date)}</span>
            </div>
            <div className="receipt-row">
              <span>Descrição:</span>
              <span>{receipt.description}</span>
            </div>
          </div>
          
          <div className="receipt-actions">
            <button className="btn btn-secondary" onClick={handleDownloadReceipt}>
              Baixar Comprovante
            </button>
            <button className="btn btn-secondary" onClick={handleShareReceipt}>
              Compartilhar por Email
            </button>
            <button className="btn btn-primary" onClick={() => setReceipt(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="transfer-history">
        <h3>Histórico de transferências</h3>
        
        {transfers.length === 0 ? (
          <p>Nenhuma transferência encontrada.</p>
        ) : (
          transfers.map(transfer => (
            <div key={transfer.id} className="transfer-item">
              <div>
                <p><strong>{transfer.description || 'Transferência'}</strong></p>
                <p>{formatDate(transfer.createdAt)}</p>
              </div>
              <div>
                <p><strong>{formatCurrency(transfer.amount)}</strong></p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transfers;