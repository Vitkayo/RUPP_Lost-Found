import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Use a simple password for your project (e.g., 'admin123')
    if (password === 'RUPPSTAFF') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('Wrong password!');
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 border-2 border-black" style={{ maxWidth: '400px', borderRadius: '15px' }}>
        <h2 className="fw-bold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold">Enter Admin Password</label>
            <input 
              type="password" 
              className="form-control border-2 border-black" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;