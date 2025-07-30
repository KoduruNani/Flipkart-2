import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    alert('Login submitted!');
  };

  return (
    <div className="login-form-container">
      <div className="login-form-title">Login</div>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          className="login-form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="login-form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="login-form-btn" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
