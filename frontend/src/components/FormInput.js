import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useToast } from '../context/ToastContext';

const FormInput = forwardRef(({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  placeholder,
  ...props 
}, ref) => {
  const [error, setError] = useState('');
  const { showError } = useToast();

  const validateField = () => {
    if (required && !value.trim()) {
      const getArticleAndLabel = (fieldLabel) => {
        const labelLower = fieldLabel.toLowerCase();
        if (labelLower.includes('confirmar senha')) {
          return { article: 'a', displayLabel: 'senha' };
        }
        if (labelLower.includes('senha') || labelLower.includes('agência') || labelLower.includes('conta')) {
          return { article: 'a', displayLabel: labelLower };
        }
        return { article: 'o', displayLabel: labelLower };
      };
      
      const { article, displayLabel } = getArticleAndLabel(label);
      setError(`Informe ${article} ${displayLabel}`);
      return false;
    }
    
    if (type === 'email' && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showError('Email inválido');
      return false;
    }
    
    if (type === 'number' && value && parseFloat(value) > 5000) {
      showError('O valor deve ser menor ou igual a 5000');
      return false;
    }
    
    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validate: validateField
  }));

  const handleBlur = () => {
    validateField();
  };

  return (
    <div className="form-group">
      <label>
        {label} {required && <span className="required-text">(obrigatório)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        {...props}
      />
      {error && <div className="field-error">{error}</div>}
    </div>
  );
});

export default FormInput;