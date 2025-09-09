import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
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
  const toAccountNumberRef = useRef();
  const toAgencyRef = useRef();
  const amountRef = useRef();

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
    
    const isToAccountNumberValid = toAccountNumberRef.current?.validate() ?? true;
    const isToAgencyValid = toAgencyRef.current?.validate() ?? true;
    const isAmountValid = amountRef.current?.validate() ?? true;
    
    if (!isToAccountNumberValid || !isToAgencyValid || !isAmountValid) {
      return;
    }
    
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

          <FormInput
            ref={toAccountNumberRef}
            label="Conta de destino"
            name="toAccountNumber"
            placeholder="123456-7"
            value={formData.toAccountNumber}
            onChange={handleChange}
            required
          />

          <FormInput
            ref={toAgencyRef}
            label="Agência de destino"
            name="toAgency"
            placeholder="0001"
            value={formData.toAgency}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <FormInput
              ref={amountRef}
              label="Valor"
              type="number"
              name="amount"
              placeholder="0,00"
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
            <label>Descrição</label>
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
              <span>Conta origem:</span>
              <span>{receipt.fromAccount}</span>
            </div>
            <div className="receipt-row">
              <span>Banco origem:</span>
              <span>{receipt.fromBank}</span>
            </div>
            <div className="receipt-row">
              <span>Conta destino:</span>
              <span>{receipt.toAccount}</span>
            </div>
            <div className="receipt-row">
              <span>Banco destino:</span>
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
          
          <div className="actions">
            <div className="receipt-actions">
              <button className="btn btn-secondary" onClick={handleDownloadReceipt}>
                Baixar comprovante
              </button>
              <button className="btn btn-secondary" onClick={handleShareReceipt}>
                Compartilhar por email
              </button>
              </div>
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