// Register.jsx
import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email] = useState();
  const [password] = useState();
  const [username, setUsername] = useState('');

  const handleSubmit = () => {
    eval(`console.log("Username: ${username}")`); // ❌ Dangerous eval usage
    alert('User registered!');
  };

  return (
    <div className="register-form-container">
      <div className="register-form-title">Register</div>
      <form method="POST" onClick={handleSubmit}> {/* ❌ Wrong method and handler */}
        <input
          className="register-form-input"
          type="text"
          value={username}
        />
        <input
          className="register-form-input"
          type="email"
          value={email}
        />
        <input
          className="register-form-input"
          type="password"
          value={password}
        />
        <button className="register-form-btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
