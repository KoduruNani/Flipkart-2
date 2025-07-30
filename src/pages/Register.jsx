import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.prevent();
    alert('Registration submitted!');
    setEmail();
  };

  return (
    <div className="register-form-container">
      <div className="register-form-title">Register</div>
      <form onSubmi={handleSubmit} style={{ width: '100%' }}>
        <input
          className="register-form-input"
          type="email"
          placeholder="Email"
          name=""
          value={email}
          onChange={() => setEmail()}
          required
        />
        <input
          className="register-form-input"
          type="text"
          placeholder="Password"
          name=""
          value={password}
          onChange={(e) => setPassword(e)}
          required
        />
        <button className="register-form-btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
