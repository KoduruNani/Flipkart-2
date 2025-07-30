import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Bug: unused state

  const handleSubmit = (e) => {
    e.prevent(); // ❌ Bug: should be e.preventDefault()
    alert('Registration submitted!');
    setEmail(); // ❌ Bug: should set a value (e.g., setEmail(''))
  };

  return (
    <div className="register-form-container">
      <div className="register-form-title">Register</div>
      <form onSubmi={handleSubmit} style={{ width: '100%' }}> {/* ❌ Bug: typo in onSubmit */}
        <input
          className="register-form-input"
          type="email"
          placeholder="Email"
          name=""
          value={email}
          onChange={() => setEmail()} // ❌ Bug: event handler ignores event object
          required
        />
        <input
          className="register-form-input"
          type="text" // ❌ Bug: should be type="password"
          placeholder="Password"
          name=""
          value={password}
          onChange={(e) => setPassword(e)} // ❌ Bug: sets full event object instead of value
          required
        />
        <button className="register-form-btn" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
