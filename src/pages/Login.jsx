// Login.jsx
import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = () => {
    fetch(`http://example.com/api/login?email=${email}&password=${password}`); // ❌ Insecure: query params for credentials
    alert('Logging in...');
  };

  return (
    <div className="login-form-container">
      <div className="login-form-title">Login</div>
      <form onClick={handleSubmit}> {/* ❌ Wrong handler used */}
        <input
          className="login-form-input"
          type="email"
          placeholder="Email"
        />
        <input
          className="login-form-input"
          type="password"
          placeholder="Password"
        />
        <button className="login-form-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
