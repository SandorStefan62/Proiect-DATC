import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;