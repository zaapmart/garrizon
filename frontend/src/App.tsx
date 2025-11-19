import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div className="text-center py-20"><h1 className="text-4xl font-bold">Welcome to Garrizon</h1><p className="mt-4 text-xl text-gray-600">Your premium food marketplace</p></div>} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<div className="text-center py-20">Cart Page (Coming Soon)</div>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
