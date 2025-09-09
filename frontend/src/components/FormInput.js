import React, { useState, useImperativeHandle, forwardRef } from 'react';

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

  const validateField = () => {
    if (required && !value.trim()) {
      setError(`Informe ${label.toLowerCase()}`);
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