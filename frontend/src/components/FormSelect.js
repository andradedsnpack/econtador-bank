import React, { useState, useImperativeHandle, forwardRef } from 'react';

const FormSelect = forwardRef(({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false,
  children,
  ...props 
}, ref) => {
  const [error, setError] = useState('');

  const validateField = () => {
    if (required && !value) {
      const getArticleAndLabel = (fieldLabel) => {
        const labelLower = fieldLabel.toLowerCase();
        if (labelLower.includes('conta')) {
          return { article: 'a', displayLabel: labelLower };
        }
        return { article: 'o', displayLabel: labelLower };
      };
      
      const { article, displayLabel } = getArticleAndLabel(label);
      setError(`Informe ${article} ${displayLabel}`);
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
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={error ? 'input-error' : ''}
        {...props}
      >
        {children}
      </select>
      {error && <div className="field-error">{error}</div>}
    </div>
  );
});

export default FormSelect;