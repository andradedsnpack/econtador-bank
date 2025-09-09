import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardAPI } from '../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return <div>Carregando dashboard...</div>;
  }

  if (!dashboardData) {
    return <div>Erro ao carregar dados do dashboard</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Saldo Total</h3>
          <div className="value">{formatCurrency(dashboardData.totalBalance)}</div>
        </div>
        
        <div className="dashboard-card">
          <h3>Entradas (30 dias)</h3>
          <div className="value" style={{color: '#28a745'}}>
            {formatCurrency(dashboardData.income)}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Saídas (30 dias)</h3>
          <div className="value" style={{color: '#dc3545'}}>
            {formatCurrency(dashboardData.expenses)}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Contas Cadastradas</h3>
          <div className="value">{dashboardData.accountsCount}</div>
        </div>
      </div>

      <div className="chart-container">
        <h3>Movimentação dos Últimos 6 Meses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dashboardData.chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#28a745" 
              name="Entradas"
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#dc3545" 
              name="Saídas"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;