import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <div className="sidebar">
        <img className="logo" src="./econtador-bank-logo-alt.png" alt="logo" />
        <br />
        <br />
        <nav>
          <ul>
            <li>
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/accounts" className={isActive('/accounts') ? 'active' : ''}>
                Minhas contas
              </Link>
            </li>
            <li>
              <Link to="/transfers" className={isActive('/transfers') ? 'active' : ''}>
                Transferências
              </Link>
            </li>
            <li>
                <button 
                  className="sidebar-about-btn" 
                  onClick={() => setIsAboutModalOpen(true)}
                >
                  Sobre
                </button>
              </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Bem-vindo, {user?.name}!</h1>
          <button className="btn btn-secondary" onClick={logout}>
            Sair
          </button>
        </div>
        <Outlet />
      </div>
      
      <Modal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)}
        title="Sobre o eContador Bank"
      >
        <div className="about-modal">
          <div className="about-logo">
            <img src="./econtador-bank-logo.png" alt="eContador Bank" />
          </div>
          <div className="about-info">
            <p><strong>Versão:</strong> 1.1.0</p>
            <br />
            <p>Software desenvolvido por inteligência artificial para fins didáticos.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Layout;