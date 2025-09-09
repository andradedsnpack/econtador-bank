import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authAPI } from '../services/api';
import FormInput from '../components/FormInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isNameValid = nameRef.current?.validate() ?? true;
    const isEmailValid = emailRef.current?.validate() ?? true;
    const isPasswordValid = passwordRef.current?.validate() ?? true;
    const isConfirmPasswordValid = confirmPasswordRef.current?.validate() ?? true;
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      showError('Senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register(formData);
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img className="logo" src="./econtador-bank-logo.png" alt="Logo" />
        <br />
        <br />
        
        <h2 className="text-center">Cadastro</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          <FormInput
            ref={nameRef}
            label="Nome"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <FormInput
            ref={emailRef}
            label="Email"
            type="email"
            name="email"
            placeholder="john@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <FormInput
            ref={passwordRef}
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <FormInput
            ref={confirmPasswordRef}
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="text-center mt-2">
          <p>Já tem conta? <Link to="/login">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;