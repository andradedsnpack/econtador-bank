import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import BankSelection from '../components/BankSelection';
import { useToast } from '../context/ToastContext';
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
  const { showSuccess, showError } = useToast();
  const accountNumberRef = useRef();
  const agencyRef = useRef();
  const bankRef = useRef();
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
    const isBankValid = bankRef.current?.validate() ?? true;
    const isPasswordValid = passwordRef.current?.validate() ?? true;
    
    if (!isAccountNumberValid || !isAgencyValid || !isBankValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);

    try {
      if (editingAccount) {
        await accountAPI.updateAccount(editingAccount.id, formData);
        showSuccess('Conta atualizada com sucesso!');
      } else {
        await accountAPI.createAccount(formData);
        showSuccess('Conta cadastrada com sucesso!');
      }
      await loadAccounts();
      handleCloseModal();
    } catch (error) {
      showError(error.response?.data?.message || 'Erro ao salvar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      try {
        await accountAPI.deleteAccount(accountId);
        await loadAccounts();
        showSuccess('Conta excluída com sucesso!');
      } catch (error) {
        showError('Erro ao excluir conta');
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

        
        <form onSubmit={handleSubmit} noValidate>
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

          <BankSelection
            ref={bankRef}
            label="Banco"
            banks={banks}
            selectedBank={formData.bank}
            onBankSelect={handleBankSelect}
            getBankImage={getBankImage}
            required
          />

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