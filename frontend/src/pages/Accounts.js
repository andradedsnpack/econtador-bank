import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { accountAPI } from '../services/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountNumber: '',
    agency: '',
    bank: '',
    password: '',
    balance: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const accountNumberRef = useRef();
  const agencyRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    loadAccounts();
    loadBanks();
  }, []);

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

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        accountNumber: account.accountNumber,
        agency: account.agency,
        bank: account.bank,
        password: '',
        balance: ''
      });
    } else {
      setEditingAccount(null);
      setFormData({
        accountNumber: '',
        agency: '',
        bank: '',
        password: '',
        balance: ''
      });
    }
    setIsModalOpen(true);
    setError('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
    setFormData({
      accountNumber: '',
      agency: '',
      bank: '',
      password: '',
      balance: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBankSelect = (bankId) => {
    setFormData({
      ...formData,
      bank: bankId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isAccountNumberValid = accountNumberRef.current?.validate() ?? true;
    const isAgencyValid = agencyRef.current?.validate() ?? true;
    const isPasswordValid = passwordRef.current?.validate() ?? true;
    
    if (!isAccountNumberValid || !isAgencyValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      if (editingAccount) {
        await accountAPI.updateAccount(editingAccount.id, formData);
      } else {
        await accountAPI.createAccount(formData);
      }
      await loadAccounts();
      handleCloseModal();
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await accountAPI.deleteAccount(accountId);
        await loadAccounts();
      } catch (error) {
        alert('Erro ao excluir conta');
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBankName = (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : bankId;
  };

  const getBankImage = (bankId) => {
    return `/banks/${bankId}.svg`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Minhas contas</h2>
      </div>
      <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          Nova conta
      </button>
      <br />
      <br />
      <br />

      <div className="accounts-grid">
        {accounts.map(account => (
          <div key={account.id} className="account-card">
            <div className="account-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => handleOpenModal(account)}
              >
                Editar
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(account.id)}
              >
                Excluir
              </button>
            </div>
            
            <div className="account-bank-info">
              <div className="account-bank-logo">
                <img 
                  src={getBankImage(account.bank)} 
                  alt={getBankName(account.bank)}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}}>{getBankName(account.bank).substring(0, 3).toUpperCase()}</div>
              </div>
              <h3>{getBankName(account.bank)}</h3>
            </div>
            <p><strong>Conta:</strong> {account.accountNumber}</p>
            <p><strong>Agência:</strong> {account.agency}</p>
            <p><strong>Saldo:</strong> {formatCurrency(account.balance)}</p>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhuma conta cadastrada. Clique em "Nova conta" para começar.
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingAccount ? 'Editar conta' : 'Nova conta'}
      >
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            ref={accountNumberRef}
            label="Número da conta"
            name="accountNumber"
            placeholder="123456-7"
            value={formData.accountNumber}
            onChange={handleChange}
            required
          />

          <FormInput
            ref={agencyRef}
            label="Agência"
            name="agency"
            placeholder="0001"
            value={formData.agency}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label>Banco</label>
            <div className="bank-selection">
              {banks.map(bank => (
                <div 
                  key={bank.id}
                  className={`bank-card ${formData.bank === bank.id ? 'selected' : ''}`}
                  onClick={() => handleBankSelect(bank.id)}
                >
                  <div className="bank-logo">
                    <img 
                      src={getBankImage(bank.id)} 
                      alt={bank.name}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}}>{bank.name.substring(0, 3).toUpperCase()}</div>
                  </div>
                  <div>{bank.name}</div>
                </div>
              ))}
            </div>
          </div>

          <FormInput
            ref={passwordRef}
            label="Senha da conta"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!editingAccount && (
            <div className="form-group">
              <label>Saldo inicial</label>
              <input
                type="number"
                name="balance"
                placeholder="0,00"
                value={formData.balance}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Accounts;