import React, { useState, useImperativeHandle, forwardRef } from 'react';

const BankSelection = forwardRef(({ 
  label, 
  banks, 
  selectedBank, 
  onBankSelect, 
  getBankImage, 
  required = false 
}, ref) => {
  const [error, setError] = useState('');

  const validateField = () => {
    if (required && !selectedBank) {
      setError('Informe o banco');
      return false;
    }
    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate: validateField
  }));

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="required-text">(obrigatório)</span>}
      </label>
      <div className="bank-selection">
        {banks.map(bank => (
          <div 
            key={bank.id}
            className={`bank-card ${selectedBank === bank.id ? 'selected' : ''} ${error ? 'input-error' : ''}`}
            onClick={() => {
              onBankSelect(bank.id);
              if (error) {
                setError('');
              }
            }}
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
      {error && <div className="field-error">{error}</div>}
    </div>
  );
});

export default BankSelection;