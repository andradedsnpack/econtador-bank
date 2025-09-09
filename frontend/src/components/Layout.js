import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

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
                Contas
              </Link>
            </li>
            <li>
              <Link to="/transfers" className={isActive('/transfers') ? 'active' : ''}>
                Transferências
              </Link>
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
    </div>
  );
};

export default Layout;