import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    alert('Registration submitted!');
  };

  return (
    <div className="register-form-container">
      <div className="register-form-title">Register</div>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <input
          className="register-form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="register-form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="register-form-btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
