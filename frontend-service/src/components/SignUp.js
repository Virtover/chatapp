import React, { useState } from 'react';
import { LS_LOGIN_DATA } from '../names';
import { USERS_SERVICE_URL } from '../config';
import './styles/auth.css';

const SignUp = ({ toggleForm, setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    };
    console.log(USERS_SERVICE_URL);
    fetch(`${USERS_SERVICE_URL}/register`, options)
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
    <div className="Auth-form-container">
      <form onSubmit={handleSignUp} className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={toggleForm}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
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

export default SignUp;
