import React, { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Chat from './components/Chat';
import { LS_LOGIN_DATA } from './names';
import { API_GATEWAY_URL } from './config';

const App = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem(LS_LOGIN_DATA);
    if (data) {
      const dataParsed = JSON.parse(data);
      setLoginData(dataParsed);
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: dataParsed.username,
          token: dataParsed.token,
        }),
      };
      
      fetch(`${API_GATEWAY_URL}/verify_token`, options)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.json().then((e) => {
            throw new Error(e.detail || "Unknown error");
          });
        })
        .then((json) => {
          if (json.result) {
            setLoginData(dataParsed);
          } else {
            setLoginData(null);
          }
        })
        .catch((e) => {
          setLoginData(null);
        });
    }
  }, []);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div data-bs-theme="dark">
      {loginData ? (
        <Chat setLoginData={setLoginData} />
      ) : isSignIn ? (
        <SignIn toggleForm={toggleForm} setLoginData={setLoginData} />
      ) : (
        <SignUp toggleForm={toggleForm} setLoginData={setLoginData} />
      )}
    </div>
  );
};

export default App;
