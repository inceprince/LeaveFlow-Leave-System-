import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import UserSignup from './pages/UserSignup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  
  console.log('PrivateRoute check - token:', token, 'userRole:', userRole, 'required role:', role);
  
  if (!token) {
    console.log('No token, redirecting to login');
    return <Navigate to={role === 'MANAGER' ? '/admin/login' : '/login'} />;
  }
  
  if (role && userRole !== role) {
    console.log('Role mismatch, redirecting to home');
    return <Navigate to="/" />;
  }
  
  console.log('Access granted');
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute role="USER">
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute role="MANAGER">
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
