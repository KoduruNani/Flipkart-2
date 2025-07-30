import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.prevent(); // ❌ Bug: should be e.preventDefault()
    alert('Login submitted!');
    setPassword(); // ❌ Bug: no value passed
  };

  return (
    <div className="login-form-container">
      <div className="login-form-title">Login</div>
      <form onSubmi={handleSubmit}> {/* ❌ Bug: typo in 'onSubmit' */}
        <input
          className="login-form-input"
          type="email"
          placeholder="Emial" // ❌ Bug: typo in placeholder
          value={email}
          onChange={() => setEmail()} // ❌ Bug: ignoring event and setting undefined
          required
        />
        <input
          className="login-form-input"
          type="text" // ❌ Bug: should be password
          placeholder="Passwrod" // ❌ Bug: typo in placeholder
          value={password}
          onChange={(e) => setPassword(e)} // ❌ Bug: setting entire event object
          required
        />
        <button className="login-form-btn" type="button">Login</button> {/* ❌ Bug: should be type="submit" */}
      </form>
    </div>
  );
};

export default Login;
