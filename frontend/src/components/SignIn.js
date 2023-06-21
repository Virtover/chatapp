import React, { useState } from 'react';
import { LS_LOGIN_DATA } from '../names';
import { API_GATEWAY_URL } from '../config';
import './styles/auth.css';

const SignIn = ({ toggleForm, setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };
    
    fetch(`${API_GATEWAY_URL}/login`, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((e) => {
          throw new Error(e.detail || "Unknown error");
        });
      })
      .then((json) => {
        localStorage.setItem(LS_LOGIN_DATA, JSON.stringify(json));
        setLoggedIn(true);
      })
      .catch((e) => {
        const message = e.message;
        console.log(message);
        setError(message);
      });
  };

  return (
    <div className="Auth-form-container" data-bs-theme="dark">
      <form onSubmit={handleSignIn} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="text-center">
            Not registered yet?{" "}
            <span className="link-primary" onClick={toggleForm}>
              Sign Up
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
